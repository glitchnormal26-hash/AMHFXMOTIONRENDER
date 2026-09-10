#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const input = path.resolve(process.env.INDEX || 'motra-output/index.html');
if (!fs.existsSync(input)) {
  console.error(`Motra Studio export not found: ${input}`);
  console.error('Download index.html from Motra Studio and save it as motra-output/index.html, or set INDEX=/path/to/file.html.');
  process.exit(2);
}

const quality = process.env.QUALITY || 'final';
const result = spawnSync(process.execPath, ['scripts/export-mp4.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, INDEX: input, QUALITY: quality },
});

process.exit(result.status ?? 1);
