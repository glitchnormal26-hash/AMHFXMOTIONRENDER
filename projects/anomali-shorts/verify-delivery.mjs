#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const ffprobe = require('@ffprobe-installer/ffprobe').path;
const root = path.resolve(import.meta.dirname, '../..');
const videosDir = path.join(root, 'output/anomali-shorts/videos');
const reportPath = path.join(root, 'output/anomali-shorts/delivery-report.json');
const expected = [
  '01-cctv-0313.mp4', '02-lantai-nol.mp4', '03-voice-note-besok.mp4',
  '04-frekuensi-merah.mp4', '05-bayangan-delay.mp4', '06-kamar-404.mp4',
  '07-stasiun-terakhir.mp4', '08-bulan-berkedip.mp4', '09-foto-kontak.mp4',
  '10-sudah-dilihat.mp4'
];

const results = [];
let pass = true;
for (const name of expected) {
  const file = path.join(videosDir, name);
  const item = { name, status: 'FAIL', errors: [] };
  if (!fs.existsSync(file)) {
    item.errors.push('missing file');
    results.push(item); pass = false; continue;
  }
  const probe = spawnSync(ffprobe, [
    '-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate',
    '-of','json',file
  ], { encoding: 'utf8' });
  if (probe.status !== 0) item.errors.push('ffprobe failed');
  else {
    const meta = JSON.parse(probe.stdout);
    const video = meta.streams?.find(s => s.codec_type === 'video');
    const audio = meta.streams?.find(s => s.codec_type === 'audio');
    const duration = Number(meta.format?.duration || 0);
    const size = Number(meta.format?.size || 0);
    Object.assign(item, { duration, size, video, audio });
    if (!video) item.errors.push('missing video stream');
    if (!audio) item.errors.push('missing audio stream');
    if (video && (video.width !== 1080 || video.height !== 1920)) item.errors.push(`unexpected dimensions ${video.width}x${video.height}`);
    if (video && video.codec_name !== 'h264') item.errors.push(`unexpected video codec ${video.codec_name}`);
    if (audio && audio.codec_name !== 'aac') item.errors.push(`unexpected audio codec ${audio.codec_name}`);
    if (duration < 30 || duration > 60) item.errors.push(`duration outside Shorts target: ${duration}`);
    if (size > 100 * 1024 * 1024) item.errors.push('file exceeds Drive connector upload limit');
  }
  if (process.env.DECODE === '1' && !item.errors.length) {
    const decode = spawnSync(ffmpeg, ['-v','error','-i',file,'-f','null','-'], { encoding: 'utf8' });
    if (decode.status !== 0) item.errors.push(`decode failed: ${decode.stderr.trim()}`);
    else item.decode = 'PASS';
  }
  item.status = item.errors.length ? 'FAIL' : 'PASS';
  if (item.errors.length) pass = false;
  results.push(item);
  console.log(`${item.status} ${name}${item.duration ? ` ${item.duration.toFixed(2)}s` : ''}`);
}

const report = {
  status: pass ? 'DELIVERY_TECHNICAL_PASS' : 'DELIVERY_TECHNICAL_FAIL',
  checked_at: new Date().toISOString(),
  expected_count: expected.length,
  passed_count: results.filter(r => r.status === 'PASS').length,
  requirements: { width: 1080, height: 1920, duration_seconds: [30,60], video_codec: 'h264', audio_codec: 'aac' },
  results
};
await fsp.writeFile(reportPath, JSON.stringify(report, null, 2));
console.log(`${report.status} → ${reportPath}`);
if (!pass) process.exitCode = 1;
