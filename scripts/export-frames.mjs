#!/usr/bin/env node
import fsp from 'node:fs/promises';
import path from 'node:path';
import { captureOptions, withCapture } from './lib/capture.mjs';

// ENCODE uses the canonical MP4 path, retaining lossless frames for inspection.
if (process.env.ENCODE === '1') {
  process.env.KEEP_FRAMES = '1';
  process.env.FPS ??= '60';
  process.env.CRF ??= '16';
  process.env.OUT_VIDEO ||= 'out.mp4';
  await import('./export-mp4.mjs');
} else {
  const options = captureOptions();
  const base = path.resolve(process.env.FRAMES_DIR || 'frames');
  await fsp.mkdir(base, { recursive: true });
  const directory = await fsp.mkdtemp(path.join(base, 'render-'));
  await withCapture(options, async ({ duration, frame }) => {
    const count = Math.ceil(duration * options.fps);
    for (let f = 0; f < count; f++) {
      await fsp.writeFile(path.join(directory, `f${String(f).padStart(6, '0')}.png`), await frame(f / options.fps));
    }
    await fsp.writeFile(path.join(directory, 'capture.json'), JSON.stringify({ ...options, duration, frame_count: count }, null, 2));
  });
  console.log(`Frames: ${directory}`);
}
