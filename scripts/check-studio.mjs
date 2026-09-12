#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const sourcePath = path.resolve('studio/v2.html');
const source = fs.readFileSync(sourcePath, 'utf8');
const scripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(Boolean);

if (!scripts.length) {
  console.error('No inline Studio v2 script found.');
  process.exit(2);
}

const tempPath = path.join(os.tmpdir(), `motra-studio-v2-check-${process.pid}.mjs`);
try {
  fs.writeFileSync(tempPath, scripts[0], 'utf8');
  const result = spawnSync(process.execPath, ['--check', tempPath], {stdio: 'inherit'});
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log('Motra Studio v2 inline JavaScript syntax OK.');
} finally {
  try { fs.unlinkSync(tempPath); } catch {}
}
