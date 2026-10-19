#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { stories } from './story-data.mjs';

const require = createRequire(import.meta.url);
const ffprobe = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const root = path.resolve(import.meta.dirname, '../..');
const dir = path.join(root, 'output/anomalia-remake-07-10/videos');
const decode = process.env.DECODE === '1';
const start = Math.max(7, Number(process.env.START_ID || 7));
const end = Math.min(10, Number(process.env.END_ID || 10));
let failed = 0;

for (const story of stories.filter(item => item.id >= start && item.id <= end)) {
  const file = path.join(dir, `${String(story.id).padStart(2, '0')}-${story.slug}.mp4`);
  if (!fs.existsSync(file)) {
    console.error(`MISSING ${path.basename(file)}`);
    failed++;
    continue;
  }

  const probe = spawnSync(ffprobe, [
    '-v', 'error',
    '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate',
    '-of', 'json',
    file,
  ], { encoding: 'utf8' });

  if (probe.status !== 0) {
    console.error(`PROBE_FAIL ${path.basename(file)}`);
    failed++;
    continue;
  }

  const metadata = JSON.parse(probe.stdout);
  const video = metadata.streams.find(item => item.codec_type === 'video');
  const audio = metadata.streams.find(item => item.codec_type === 'audio');
  const duration = Number(metadata.format.duration);
  const valid = video?.codec_name === 'h264'
    && audio?.codec_name === 'aac'
    && video.width === 1080
    && video.height === 1920
    && duration >= 30
    && duration <= 60.5;

  if (!valid) {
    console.error(`INVALID ${path.basename(file)} ${JSON.stringify({ duration, video, audio })}`);
    failed++;
    continue;
  }

  if (decode) {
    const result = spawnSync(ffmpeg, ['-v', 'error', '-i', file, '-f', 'null', '-'], {
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
    });
    if (result.status !== 0) {
      console.error(`DECODE_FAIL ${path.basename(file)} ${result.stderr}`);
      failed++;
      continue;
    }
  }

  console.log(`PASS ${path.basename(file)} ${duration.toFixed(2)}s${decode ? ' FULL_DECODE' : ''}`);
}

if (failed) process.exitCode = 1;
