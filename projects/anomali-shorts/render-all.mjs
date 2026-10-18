#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const root = path.resolve(import.meta.dirname, '../..');
const outDir = path.join(root, 'output/anomali-shorts/videos');
const audioDir = path.join(root, 'output/anomali-shorts/audio');
const logsDir = path.join(root, 'output/anomali-shorts/logs');
const stories = [
  ['01', 'cctv-0313'], ['02', 'lantai-nol'], ['03', 'voice-note-besok'],
  ['04', 'frekuensi-merah'], ['05', 'bayangan-delay'], ['06', 'kamar-404'],
  ['07', 'stasiun-terakhir'], ['08', 'bulan-berkedip'], ['09', 'foto-kontak'],
  ['10', 'sudah-dilihat']
];

const mode = (process.env.RENDER_MODE || 'final').toLowerCase();
const finalMode = mode === 'final';
const fps = Number(process.env.FPS || (finalMode ? 24 : 15));
const concurrency = Math.max(1, Number(process.env.RENDER_CONCURRENCY || 2));
const startId = Math.max(1, Number(process.env.START_ID || 1));
const endId = Math.min(10, Number(process.env.END_ID || 10));
const force = process.env.FORCE === '1';

await fsp.mkdir(outDir, { recursive: true });
await fsp.mkdir(logsDir, { recursive: true });
const queue = stories
  .map(([n, slug], index) => ({ id: index + 1, n, slug }))
  .filter(s => s.id >= startId && s.id <= endId)
  .filter(s => force || !fs.existsSync(path.join(outDir, `${s.n}-${s.slug}.mp4`)));

console.log(`Anomali batch render: ${queue.length} video(s), 1080x1920, ${fps}fps, concurrency=${concurrency}`);
console.log('Backend: deterministic @napi-rs/canvas → JPEG image2pipe → H.264/AAC');

async function render(story) {
  const audio = path.join(audioDir, `${story.n}-${story.slug}.mp3`);
  const output = path.join(outDir, `${story.n}-${story.slug}.mp4`);
  const logPath = path.join(logsDir, `${story.n}-${story.slug}.log`);
  if (!fs.existsSync(audio)) throw new Error(`Missing voiceover: ${audio}`);
  const env = {
    ...process.env,
    STORY_ID: String(story.id),
    OUT_VIDEO: output,
    VOICEOVER: audio,
    FPS: String(fps),
    CRF: finalMode ? '18' : '22',
    PRESET: finalMode ? 'veryfast' : 'ultrafast',
    CAPTURE_QUALITY: finalMode ? '94' : '88'
  };
  const log = fs.createWriteStream(logPath, { flags: 'w' });
  console.log(`[${story.n}] START ${story.slug}`);
  const child = spawn(process.execPath, [path.join(import.meta.dirname, 'render-node.mjs')], {
    cwd: root, env, stdio: ['ignore','pipe','pipe']
  });
  let outputTail = '';
  child.stdout.on('data', chunk => { log.write(chunk); outputTail = (outputTail + String(chunk)).slice(-8000); });
  child.stderr.on('data', chunk => log.write(chunk));
  const [code, signal] = await once(child, 'exit');
  log.end();
  if (code !== 0) throw new Error(`[${story.n}] render failed code=${code} signal=${signal || 'none'}; see ${logPath}`);
  const verifiedLine = outputTail.split(/\r?\n|\r/).find(line => line.includes('TECHNICAL_VERIFIED'));
  if (verifiedLine) console.log(`[${story.n}] ${verifiedLine}`);
  const size = (await fsp.stat(output)).size / 1024 / 1024;
  console.log(`[${story.n}] DONE ${size.toFixed(1)} MB → ${path.basename(output)}`);
  return output;
}

const running = new Set();
const completed = [];
for (const story of queue) {
  const task = render(story).then(file => completed.push(file));
  running.add(task);
  task.then(() => running.delete(task), () => running.delete(task));
  if (running.size >= concurrency) await Promise.race(running);
}
await Promise.all(running);
console.log(`BATCH_COMPLETE ${completed.length}/${queue.length}`);
