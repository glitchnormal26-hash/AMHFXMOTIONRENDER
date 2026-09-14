#!/usr/bin/env node
// Deterministic lossless PNG capture -> FFmpeg pipe -> validated H.264/AAC MP4.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { availableParallelism } from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { captureOptions, withCapture } from './lib/capture.mjs';
import { verifyMedia } from './lib/verify.mjs';

const env = process.env;
const quality = (env.QUALITY || 'fast').toLowerCase();
if (!['fast', 'final'].includes(quality)) throw new Error('QUALITY must be fast or final');
const options = captureOptions(env, quality === 'final' ? 60 : 30);
const { fps, width, height } = options;
if (width % 2 || height % 2) throw new Error('H.264 yuv420p requires even WIDTH/HEIGHT');
const crf = Number(env.CRF ?? (quality === 'final' ? 16 : 18));
if (!Number.isFinite(crf) || crf < 0 || crf > 51) throw new Error('CRF must be between 0 and 51');
const preset = env.PRESET || (quality === 'final' ? 'medium' : 'veryfast');
if (!['ultrafast','superfast','veryfast','faster','fast','medium','slow','slower','veryslow'].includes(preset)) {
  throw new Error('Invalid PRESET');
}
const encodeThreads = Number(env.ENCODE_THREADS ?? Math.max(1, Math.min(4, availableParallelism() - 1)));
if (!Number.isSafeInteger(encodeThreads) || encodeThreads < 1) throw new Error('ENCODE_THREADS must be a positive integer');
const outVideo = path.resolve(env.OUT_VIDEO || 'output/final.mp4');
if (path.extname(outVideo).toLowerCase() !== '.mp4') throw new Error('OUT_VIDEO must end in .mp4');
for (const cmd of ['ffmpeg', 'ffprobe']) {
  if (spawnSync(cmd, ['-version'], { stdio: 'ignore' }).status !== 0) throw new Error(`${cmd} is required on PATH`);
}
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
const finalAudio = audioSource('AUDIO', ['audio/final-mix', 'audio/final']);
const voiceover = audioSource('VOICEOVER', ['audio/voiceover', 'audio/vo']);
const sfx = audioSource('SFX', ['audio/sfx-mix', 'audio/sfx']);
const ambience = audioSource('AMBIENCE', ['audio/ambience', 'audio/tech-ambience']);
const hasAudio = Boolean(finalAudio || voiceover || sfx || ambience);
if (env.REQUIRE_VO === '1' && !finalAudio && !voiceover) throw new Error('REQUIRE_VO=1 requires AUDIO or VOICEOVER');
if (env.REQUIRE_AUDIO === '1' && !hasAudio) throw new Error('REQUIRE_AUDIO=1 requires an audio source');
function gain(key, fallback) {
  const value = Number(env[key] ?? fallback);
  if (!Number.isFinite(value) || value < 0) throw new Error(`${key} must be finite and nonnegative`);
  return value;
}
const tracks = finalAudio ? [{ file: finalAudio, gain: 1 }] : [
  { file: voiceover, gain: gain('VO_GAIN', 1) },
  { file: sfx, gain: gain('SFX_GAIN', 0.42) },
  { file: ambience, gain: gain('AMBIENCE_GAIN', 0.20) }
].filter(track => track.file);
// Fail on invalid audio before spending time on browser capture.
for (const { file } of tracks) {
  const result = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0',
    '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  if (result.status !== 0 || result.stdout.trim() !== 'audio') throw new Error(`Invalid audio source: ${file}`);
}

await fsp.mkdir(path.dirname(outVideo), { recursive: true });
// Same-filesystem staging protects an existing deliverable if capture/encode fails.
const workDir = await fsp.mkdtemp(path.join(path.dirname(outVideo), '.render-'));
const stagedVideo = path.join(workDir, 'render.mp4');
let framesDir;
let encoder;
let encoderDone;
let encoderError;
const started = performance.now();
try {
  if (env.KEEP_FRAMES === '1' || env.FRAMES_DIR) {
    const base = path.resolve(env.FRAMES_DIR || 'frames');
    await fsp.mkdir(base, { recursive: true });
    framesDir = await fsp.mkdtemp(path.join(base, 'render-'));
  }
  await withCapture(options, async ({ duration, frame }) => {
    const frameCount = Math.ceil(duration * fps);
    const encodedDuration = frameCount / fps;
    const args = ['-hide_banner', '-loglevel', 'warning', '-y', '-f', 'image2pipe',
      '-framerate', String(fps), '-c:v', 'png', '-i', 'pipe:0'];
    for (const track of tracks) args.push('-i', track.file);
    args.push('-map', '0:v:0');
    if (tracks.length) {
      const filters = tracks.map((track, i) => `[${i + 1}:a]volume=${track.gain},apad[a${i}]`);
      if (tracks.length === 1) args.push('-filter_complex', filters.join(';'), '-map', '[a0]');
      else {
        filters.push(`${tracks.map((_, i) => `[a${i}]`).join('')}amix=inputs=${tracks.length}:duration=longest:dropout_transition=0,alimiter=limit=0.95[aout]`);
        args.push('-filter_complex', filters.join(';'), '-map', '[aout]');
      }
      args.push('-c:a', 'aac', '-b:a', '192k');
    }
    args.push('-c:v', 'libx264', '-threads', String(encodeThreads), '-preset', preset, '-crf', String(crf), '-pix_fmt', 'yuv420p',
      '-t', String(encodedDuration), '-movflags', '+faststart', stagedVideo);
    encoder = spawn('ffmpeg', args, { stdio: ['pipe', 'ignore', 'inherit'] });
    encoderDone = new Promise(resolve => {
      encoder.on('error', error => { encoderError = error; });
      encoder.on('close', (code, signal) => {
        if (code !== 0) encoderError ||= new Error(`FFmpeg failed (${code ?? signal})`);
        resolve();
      });
    });
    encoder.stdin.on('error', error => { encoderError ||= error; });
    console.log(`${quality}: ${width}x${height} ${fps}fps, ${frameCount} frames, CRF ${crf}`);
    for (let f = 0; f < frameCount; f++) {
      if (encoderError) throw encoderError;
      const png = await frame(f / fps);
      if (framesDir) await fsp.writeFile(path.join(framesDir, `f${String(f).padStart(6, '0')}.png`), png);
      // Await each write: bounded memory and encoding overlaps browser capture.
      await new Promise((resolve, reject) => encoder.stdin.write(png, error => error ? reject(error) : resolve()));
      if (f % Math.max(1, Math.round(fps)) === 0) console.log(`${(f / fps).toFixed(1)}s / ${duration.toFixed(1)}s`);
    }
    encoder.stdin.end();
    await encoderDone;
    if (encoderError) throw encoderError;
    const probe = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-show_entries',
      'format=duration:stream=codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,nb_read_frames',
      '-of', 'json', stagedVideo], { encoding: 'utf8' });
    if (probe.status !== 0) throw new Error(`ffprobe failed: ${probe.stderr}`);
    const verified = verifyMedia(JSON.parse(probe.stdout), { ...options, frameCount, hasAudio });
    const report = {
      status: 'TECHNICALLY_VERIFIED', playback_review: 'PENDING', output: outVideo,
      quality, requested: { width, height, fps }, source_duration: duration,
      frame_count: frameCount, ...verified,
      audio_sources: { final_mix: finalAudio, voiceover, sfx, ambience },
      pipeline: 'png-pipe-ffmpeg', encode_threads: encodeThreads, elapsed_seconds: (performance.now() - started) / 1000,
      frames_directory: framesDir || null
    };
    await fsp.writeFile(path.join(workDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  });
  await fsp.rename(stagedVideo, outVideo);
  await fsp.rename(path.join(workDir, 'report.json'), outVideo.replace(/\.mp4$/i, '.verify.json'));
  console.log(`TECHNICALLY_VERIFIED: ${outVideo}\nPlayback review required before FINAL_VERIFIED.`);
} finally {
  if (encoder && encoder.exitCode === null && encoder.signalCode === null) encoder.kill('SIGKILL');
  if (encoderDone) await encoderDone;
  await fsp.rm(workDir, { recursive: true, force: true });
  if (framesDir) console.log(`Frames retained: ${framesDir}`);
}
