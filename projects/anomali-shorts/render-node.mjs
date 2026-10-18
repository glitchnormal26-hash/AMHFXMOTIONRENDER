#!/usr/bin/env node
/** Fast deterministic Canvas renderer for the Anomali Shorts series. */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { once } from 'node:events';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createCanvas } from '@napi-rs/canvas';

const require = createRequire(import.meta.url);
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const ffprobe = require('@ffprobe-installer/ffprobe').path;
const id = Math.max(1, Math.min(10, Number(process.env.STORY_ID || 1)));
const fps = Number(process.env.FPS || 24);
const width = 1080;
const height = 1920;
const quality = Number(process.env.CAPTURE_QUALITY || 94);
const audio = path.resolve(process.env.VOICEOVER || '');
const output = path.resolve(process.env.OUT_VIDEO || `output/anomali-shorts/videos/${String(id).padStart(2,'0')}.mp4`);

if (!fs.existsSync(audio)) throw new Error(`Missing VOICEOVER: ${audio}`);
await fsp.mkdir(path.dirname(output), { recursive: true });

const canvas = createCanvas(width, height);
globalThis.document = { querySelector: () => canvas };
globalThis.location = { search: `?id=${id}` };
globalThis.window = {};
await import(`./scene.js?story=${id}&pid=${process.pid}`);
const opener = globalThis.window.OPENER;
const duration = Number(opener?.DURATION || 0);
if (!Number.isFinite(duration) || duration <= 0) throw new Error('Invalid scene duration');
const frameCount = Math.ceil(duration * fps);

const args = [
  '-y',
  '-f','image2pipe','-framerate',String(fps),'-vcodec','mjpeg','-i','pipe:0',
  '-i',audio,
  '-filter_complex','[1:a]volume=1,apad[vo];[vo]amix=inputs=1:duration=longest:dropout_transition=0,alimiter=limit=0.95[aout]',
  '-map','0:v:0','-map','[aout]',
  '-c:v','libx264','-preset',process.env.PRESET || 'veryfast','-crf',process.env.CRF || '18',
  '-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-t',String(duration),
  '-movflags','+faststart',output
];
const child = spawn(ffmpeg, args, { stdio: ['pipe','ignore','pipe'] });
let stderr = '';
child.stderr.on('data', chunk => { stderr = (stderr + String(chunk)).slice(-24000); });
const exitPromise = once(child, 'exit');

async function write(chunk) {
  if (!child.stdin.write(chunk)) await once(child.stdin, 'drain');
}

console.log(`NODE_RENDER story=${id} frames=${frameCount} duration=${duration.toFixed(3)}s`);
const started = Date.now();
for (let f = 0; f < frameCount; f++) {
  opener.seek(f / fps);
  await write(canvas.toBuffer('image/jpeg', quality));
  if (f % fps === 0) process.stdout.write(`\r${String(id).padStart(2,'0')} ${f}/${frameCount}`);
}
child.stdin.end();
const [code, signal] = await exitPromise;
process.stdout.write('\n');
if (code !== 0) throw new Error(`FFmpeg failed code=${code} signal=${signal || 'none'}\n${stderr}`);

const probe = spawnSync(ffprobe, [
  '-v','error','-show_entries','format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate',
  '-of','json',output
], { encoding: 'utf8' });
if (probe.status !== 0) throw new Error(`ffprobe failed: ${probe.stderr}`);
const meta = JSON.parse(probe.stdout);
const video = meta.streams?.find(s => s.codec_type === 'video');
const audioStream = meta.streams?.find(s => s.codec_type === 'audio');
if (!video || !audioStream || video.width !== width || video.height !== height) {
  throw new Error('Encoded stream verification failed');
}
const report = {
  status: 'TECHNICAL_VERIFIED',
  technical_status: 'TECHNICAL_VERIFIED',
  renderer: '@napi-rs/canvas image2pipe',
  output,
  requested: { width, height, fps },
  frame_format: 'jpeg',
  capture_quality: quality,
  duration: Number(meta.format?.duration || 0),
  video,
  audio: audioStream,
  voiceover: audio,
  render_seconds: Number(((Date.now()-started)/1000).toFixed(3))
};
await fsp.writeFile(output.replace(/\.mp4$/i,'.verify.json'),JSON.stringify(report,null,2));
console.log(`TECHNICAL_VERIFIED ${path.basename(output)} in ${report.render_seconds}s`);
