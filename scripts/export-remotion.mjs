#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {availableParallelism} from 'node:os';
import {spawnSync} from 'node:child_process';
import puppeteer from 'puppeteer';
import {captureOptions, withCapture} from './lib/capture.mjs';
import {verifyMedia} from './lib/verify.mjs';

const env = process.env;
const quality = (env.QUALITY || 'fast').toLowerCase();
if (!['fast', 'final'].includes(quality)) throw new Error('QUALITY must be fast or final');

const options = captureOptions(env, quality === 'final' ? 60 : 30);
const {fps, width, height} = options;
if (width % 2 || height % 2) throw new Error('H.264 yuv420p requires even WIDTH/HEIGHT');

const crf = Number(env.CRF ?? (quality === 'final' ? 16 : 18));
if (!Number.isFinite(crf) || crf < 0 || crf > 51) throw new Error('CRF must be between 0 and 51');

const preset = env.PRESET || (quality === 'final' ? 'medium' : 'veryfast');
const presets = ['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'];
if (!presets.includes(preset)) throw new Error('Invalid PRESET');

const imageFormat = (env.REMOTION_IMAGE_FORMAT || (quality === 'final' ? 'png' : 'jpeg')).toLowerCase();
if (!['jpeg', 'png'].includes(imageFormat)) throw new Error('REMOTION_IMAGE_FORMAT must be jpeg or png');
const jpegQuality = Number(env.REMOTION_JPEG_QUALITY ?? 92);
if (!Number.isSafeInteger(jpegQuality) || jpegQuality < 0 || jpegQuality > 100) {
  throw new Error('REMOTION_JPEG_QUALITY must be an integer between 0 and 100');
}

const concurrency = env.REMOTION_CONCURRENCY || '75%';
if (!/^\d+%$/.test(concurrency) && !(Number.isSafeInteger(Number(concurrency)) && Number(concurrency) > 0)) {
  throw new Error('REMOTION_CONCURRENCY must be a positive integer or percentage such as 75%');
}

const hardwareAcceleration = (env.REMOTION_HARDWARE_ACCELERATION || 'disabled').toLowerCase();
if (!['disabled', 'if-possible', 'required'].includes(hardwareAcceleration)) {
  throw new Error('REMOTION_HARDWARE_ACCELERATION must be disabled, if-possible, or required');
}
const videoBitrate = env.VIDEO_BITRATE || (width >= 3840 || height >= 2160 ? '45M' : '16M');

const outVideo = path.resolve(env.OUT_VIDEO || 'output/final.mp4');
if (path.extname(outVideo).toLowerCase() !== '.mp4') throw new Error('OUT_VIDEO must end in .mp4');

for (const cmd of ['ffmpeg', 'ffprobe']) {
  if (spawnSync(cmd, ['-version'], {stdio: 'ignore'}).status !== 0) {
    throw new Error(`${cmd} is required on PATH`);
  }
}

const remotionRoot = path.resolve('remotion');
const remotionPackage = path.join(remotionRoot, 'node_modules/@remotion/renderer/package.json');
if (!fs.existsSync(remotionPackage)) {
  throw new Error('Remotion dependencies are missing. Run `npm run remotion:setup` first.');
}
const requireFromRemotion = createRequire(path.join(remotionRoot, 'package.json'));
const {bundle} = requireFromRemotion('@remotion/bundler');
const {renderMedia, selectComposition} = requireFromRemotion('@remotion/renderer');
const remotionVersion = JSON.parse(fs.readFileSync(path.join(remotionRoot, 'node_modules/remotion/package.json'), 'utf8')).version;

function audioSource(key, bases) {
  if (env[key]) {
    const file = path.resolve(env[key]);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`${key} file not found: ${file}`);
    return file;
  }
  for (const base of bases) {
    for (const ext of ['.wav', '.mp3', '.m4a', '.aac', '.flac', '.ogg']) {
      const file = path.resolve(base + ext);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
    }
  }
  return null;
}

function gain(key, fallback) {
  const value = Number(env[key] ?? fallback);
  if (!Number.isFinite(value) || value < 0) throw new Error(`${key} must be finite and nonnegative`);
  return value;
}

const finalAudio = audioSource('AUDIO', ['audio/final-mix', 'audio/final']);
const voiceover = audioSource('VOICEOVER', ['audio/voiceover', 'audio/vo']);
const sfx = audioSource('SFX', ['audio/sfx-mix', 'audio/sfx']);
const ambience = audioSource('AMBIENCE', ['audio/ambience', 'audio/tech-ambience']);
const tracks = finalAudio ? [{file: finalAudio, gain: 1}] : [
  {file: voiceover, gain: gain('VO_GAIN', 1)},
  {file: sfx, gain: gain('SFX_GAIN', 0.42)},
  {file: ambience, gain: gain('AMBIENCE_GAIN', 0.20)},
].filter((track) => track.file);
const hasAudio = tracks.length > 0;

if (env.REQUIRE_VO === '1' && !finalAudio && !voiceover) throw new Error('REQUIRE_VO=1 requires AUDIO or VOICEOVER');
if (env.REQUIRE_AUDIO === '1' && !hasAudio) throw new Error('REQUIRE_AUDIO=1 requires an audio source');

for (const {file} of tracks) {
  const result = spawnSync('ffprobe', [
    '-v', 'error', '-select_streams', 'a:0',
    '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', file,
  ], {encoding: 'utf8'});
  if (result.status !== 0 || result.stdout.trim() !== 'audio') {
    throw new Error(`Invalid audio source: ${file}`);
  }
}

async function linkOrCopy(source, destination) {
  if (!fs.existsSync(source)) return;
  await fsp.mkdir(path.dirname(destination), {recursive: true});
  try {
    await fsp.symlink(source, destination, fs.statSync(source).isDirectory() ? 'dir' : 'file');
  } catch {
    await fsp.cp(source, destination, {recursive: true, force: true});
  }
}

async function preparePublicDir(publicDir) {
  const root = process.cwd();
  const indexFile = path.resolve(env.INDEX || 'index.html');
  if (!fs.existsSync(indexFile) || !fs.statSync(indexFile).isFile()) {
    throw new Error(`INDEX file not found: ${indexFile}`);
  }

  await fsp.mkdir(publicDir, {recursive: true});
  await linkOrCopy(path.join(root, 'assets'), path.join(publicDir, 'assets'));
  await linkOrCopy(path.join(root, 'runtime'), path.join(publicDir, 'runtime'));
  await linkOrCopy(path.join(root, 'index.html'), path.join(publicDir, 'index.html'));
  await linkOrCopy(path.join(root, 'node_modules/gsap'), path.join(publicDir, 'node_modules/gsap'));

  const relative = path.relative(root, indexFile);
  const scenePath = relative.startsWith('..') || path.isAbsolute(relative)
    ? 'external-scene.html'
    : relative.split(path.sep).join('/');

  if (!['index.html'].includes(scenePath) && !scenePath.startsWith('assets/')) {
    await linkOrCopy(indexFile, path.join(publicDir, ...scenePath.split('/')));
  }

  return scenePath;
}

function muxAudio(videoInput, output, encodedDuration) {
  const args = ['-hide_banner', '-loglevel', 'warning', '-y', '-i', videoInput];
  for (const track of tracks) args.push('-i', track.file);
  args.push('-map', '0:v:0', '-c:v', 'copy');

  const filters = tracks.map((track, index) => `[${index + 1}:a]volume=${track.gain},apad[a${index}]`);
  if (tracks.length === 1) {
    args.push('-filter_complex', filters.join(';'), '-map', '[a0]');
  } else {
    filters.push(`${tracks.map((_, index) => `[a${index}]`).join('')}amix=inputs=${tracks.length}:duration=longest:dropout_transition=0,alimiter=limit=0.95[aout]`);
    args.push('-filter_complex', filters.join(';'), '-map', '[aout]');
  }
  args.push('-c:a', 'aac', '-b:a', '192k', '-t', String(encodedDuration), '-movflags', '+faststart', output);

  const result = spawnSync('ffmpeg', args, {stdio: 'inherit'});
  if (result.status !== 0) throw new Error(`FFmpeg audio mux failed (${result.status})`);
}

await fsp.mkdir(path.dirname(outVideo), {recursive: true});
const workDir = await fsp.mkdtemp(path.join(path.dirname(outVideo), '.remotion-'));
const publicDir = path.join(workDir, 'public');
const bundleDir = path.join(workDir, 'bundle');
const rawVideo = path.join(workDir, 'video-only.mp4');
const stagedVideo = path.join(workDir, 'render.mp4');
const started = performance.now();

try {
  const scenePath = await preparePublicDir(publicDir);

  let duration;
  await withCapture({...options, width: Math.min(width, 1280), height: Math.min(height, 720)}, async (capture) => {
    duration = capture.duration;
  });
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Invalid OPENER.DURATION');

  const frameCount = Math.ceil(duration * fps);
  const encodedDuration = frameCount / fps;
  const inputProps = {
    scenePath,
    width,
    height,
    fps,
    durationInFrames: frameCount,
    sceneTimeoutMs: Number(env.REMOTION_SCENE_TIMEOUT_MS || 30000),
  };

  console.log(
    `remotion ${remotionVersion}: ${width}x${height} ${fps}fps, ${frameCount} frames, ` +
    `concurrency=${concurrency}, image=${imageFormat}, preset=${preset}`,
  );

  const serveUrl = await bundle({
    entryPoint: path.join(remotionRoot, 'src/index.js'),
    rootDir: remotionRoot,
    publicDir,
    outDir: bundleDir,
    enableCaching: true,
    onProgress: (progress) => {
      if (progress === 100 || progress % 25 === 0) console.log(`Bundle ${progress}%`);
    },
  });

  const browserExecutable = env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();
  const composition = await selectComposition({
    serveUrl,
    id: 'AMHFXBridge',
    inputProps,
    browserExecutable,
  });

  let lastProgress = -1;
  const renderOptions = {
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: rawVideo,
    inputProps,
    concurrency,
    imageFormat,
    pixelFormat: 'yuv420p',
    browserExecutable,
    hardwareAcceleration,
    muted: true,
    overwrite: true,
    onProgress: ({progress}) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== lastProgress) {
        lastProgress = pct;
        console.log(`Render ${pct}%`);
      }
    },
  };

  if (imageFormat === 'jpeg') renderOptions.jpegQuality = jpegQuality;
  if (hardwareAcceleration === 'disabled') {
    renderOptions.crf = crf;
    renderOptions.x264Preset = preset;
  } else {
    renderOptions.videoBitrate = videoBitrate;
  }

  await renderMedia(renderOptions);

  if (hasAudio) muxAudio(rawVideo, stagedVideo, encodedDuration);
  else await fsp.rename(rawVideo, stagedVideo);

  const probe = spawnSync('ffprobe', [
    '-v', 'error', '-count_frames',
    '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,nb_read_frames',
    '-of', 'json', stagedVideo,
  ], {encoding: 'utf8'});
  if (probe.status !== 0) throw new Error(`ffprobe failed: ${probe.stderr}`);

  const verified = verifyMedia(JSON.parse(probe.stdout), {...options, frameCount, hasAudio});
  const report = {
    status: 'TECHNICALLY_VERIFIED',
    playback_review: 'PENDING',
    output: outVideo,
    quality,
    requested: {width, height, fps},
    source_duration: duration,
    frame_count: frameCount,
    ...verified,
    audio_sources: {final_mix: finalAudio, voiceover, sfx, ambience},
    pipeline: 'remotion-opener-bridge',
    render_engine: 'remotion',
    remotion_version: remotionVersion,
    concurrency,
    image_format: imageFormat,
    jpeg_quality: imageFormat === 'jpeg' ? jpegQuality : null,
    hardware_acceleration: hardwareAcceleration,
    x264_preset: preset,
    crf: hardwareAcceleration === 'disabled' ? crf : null,
    video_bitrate: hardwareAcceleration === 'disabled' ? null : videoBitrate,
    cpu_threads: availableParallelism(),
    elapsed_seconds: (performance.now() - started) / 1000,
    frames_directory: null,
  };
  await fsp.writeFile(path.join(workDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');

  await fsp.rename(stagedVideo, outVideo);
  await fsp.rename(path.join(workDir, 'report.json'), outVideo.replace(/\.mp4$/i, '.verify.json'));
  console.log(`TECHNICALLY_VERIFIED: ${outVideo}\nPlayback review required before FINAL_VERIFIED.`);
} finally {
  await fsp.rm(workDir, {recursive: true, force: true});
}
