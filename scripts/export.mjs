#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';

const env = process.env;
const requested = (env.RENDER_ENGINE || 'auto').toLowerCase();
if (!['auto', 'remotion', 'ffmpeg'].includes(requested)) {
  throw new Error('RENDER_ENGINE must be auto, remotion, or ffmpeg');
}

const remotionPackage = path.resolve('remotion/node_modules/@remotion/renderer/package.json');
const remotionReady = fs.existsSync(remotionPackage);
const engine = requested === 'auto' ? (remotionReady ? 'remotion' : 'ffmpeg') : requested;

if (engine === 'remotion' && !remotionReady) {
  throw new Error(
    'Remotion engine is not installed. Run `npm run remotion:setup` once, ' +
    'or use RENDER_ENGINE=ffmpeg.'
  );
}

const script = engine === 'remotion' ? 'scripts/export-remotion.mjs' : 'scripts/export-mp4.mjs';
console.log(`Render engine: ${engine}${requested === 'auto' ? ' (auto)' : ''}`);

const child = spawn(process.execPath, [script], {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.on('close', (code, signal) => {
  if (signal) {
    console.error(`Renderer terminated by ${signal}`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
