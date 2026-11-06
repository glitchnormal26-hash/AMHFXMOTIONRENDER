import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from './config.mjs';

const run = promisify(execFile);
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseSize(size = '832*480') {
  const [w, h] = String(size).split('*').map((n) => parseInt(n, 10));
  return {
    width: Number.isFinite(w) ? w : 832,
    height: Number.isFinite(h) ? h : 480,
  };
}

async function hasFfmpeg() {
  try {
    await run(FFMPEG, ['-version'], { timeout: 10_000 });
    return true;
  } catch {
    return false;
  }
}

function escapeXml(text) {
  return String(text).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]);
}

function wrap(text, perLine = 46, maxLines = 6) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > perLine) {
      if (line) lines.push(line.trim());
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = `${line} ${word}`;
    }
  }
  if (line && lines.length < maxLines) lines.push(line.trim());
  return lines;
}

async function renderWithFfmpeg(job) {
  const { width, height } = parseSize(job.size);
  const duration = Number.isFinite(job.duration) ? job.duration : 5;
  const textFile = path.join(config.videoDir, `${job.id}.txt`);
  const outFile = path.join(config.videoDir, `${job.id}.mp4`);
  const w = Math.min(width, 1280);
  const h = Math.min(height, 1280);

  await fs.writeFile(textFile, wrap(job.prompt).join('\n'), 'utf8');

  const filter = [
    `drawtext=textfile=${textFile}:fontcolor=white:fontsize=${Math.round(h / 18)}`,
    'line_spacing=14',
    'x=(w-text_w)/2',
    'y=(h-text_h)/2',
    'alpha=0.92',
  ].join(':');

  await run(FFMPEG, [
    '-y',
    '-f', 'lavfi',
    '-i', `color=c=0x0b1020:s=${w}x${h}:d=${duration}:r=24`,
    '-vf', filter,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p',
    '-t', String(duration),
    outFile,
  ], { timeout: 120_000 });

  await fs.rm(textFile, { force: true });
  const { size: bytes } = await fs.stat(outFile);
  return { fileName: path.basename(outFile), bytes, demo: false };
}

async function renderSvgStoryboard(job) {
  const { width, height } = parseSize(job.size);
  const lines = wrap(job.prompt, 40, 5);
  const lineHeight = 34;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  const text = lines
    .map((line, index) => `<text x="50%" y="${startY + index * lineHeight}" text-anchor="middle" fill="#f8fafc" font-family="Inter,system-ui,sans-serif" font-size="26">${escapeXml(line)}</text>`)
    .join('\n    ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1020"><animate attributeName="stop-color" values="#0b1020;#1b2a6b;#0b1020" dur="6s" repeatCount="indefinite"/></stop>
      <stop offset="100%" stop-color="#221045"><animate attributeName="stop-color" values="#221045;#6d28d9;#221045" dur="6s" repeatCount="indefinite"/></stop>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <circle cx="${width * 0.8}" cy="${height * 0.25}" r="${Math.min(width, height) * 0.22}" fill="#38bdf8" opacity="0.18">
    <animate attributeName="r" values="${Math.min(width, height) * 0.18};${Math.min(width, height) * 0.26};${Math.min(width, height) * 0.18}" dur="5s" repeatCount="indefinite"/>
  </circle>
  ${text}
  <text x="50%" y="${height - 36}" text-anchor="middle" fill="#94a3b8" font-family="Inter,system-ui,sans-serif" font-size="18">DEMO STORYBOARD — set DASHSCOPE_API_KEY untuk render Wan asli</text>
</svg>`;

  const fileName = `${job.id}.svg`;
  await fs.writeFile(path.join(config.videoDir, fileName), svg, 'utf8');
  const { size: bytes } = await fs.stat(path.join(config.videoDir, fileName));
  return { fileName, bytes, demo: true };
}

/**
 * Mode demo: meniru alur task Wan (queued -> running -> succeeded) tanpa API key.
 * Hasilnya placeholder MP4 (kalau ffmpeg ada) atau storyboard SVG beranimasi.
 */
export async function startMockJob(store, job) {
  const startedAt = Date.now();
  const totalMs = Number(process.env.MOCK_DURATION_MS || 5000);

  store.update(job.id, { state: 'queued', progress: 4, demo: true });

  const progressTimer = setInterval(() => {
    const current = store.get(job.id);
    if (!current || current.state === 'succeeded' || current.state === 'failed') {
      clearInterval(progressTimer);
      return;
    }
    const ratio = Math.min(0.92, (Date.now() - startedAt) / totalMs);
    store.update(job.id, { state: 'running', progress: Math.round(ratio * 100) });
  }, 700);

  try {
    await fs.mkdir(config.videoDir, { recursive: true });
    await sleep(totalMs);

    const result = (await hasFfmpeg())
      ? await renderWithFfmpeg(job).catch(() => renderSvgStoryboard(job))
      : await renderSvgStoryboard(job);

    clearInterval(progressTimer);
    store.update(job.id, {
      state: 'succeeded',
      progress: 100,
      fileName: result.fileName,
      bytes: result.bytes,
      demo: true,
      videoUrl: `/videos/${result.fileName}`,
      remoteUrl: null,
    });
  } catch (error) {
    clearInterval(progressTimer);
    store.update(job.id, { state: 'failed', progress: 0, error: error.message });
  }
}
