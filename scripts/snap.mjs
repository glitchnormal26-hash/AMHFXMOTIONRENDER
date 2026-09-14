#!/usr/bin/env node
/**
 * Capture representative key moments from an OPENER-compatible browser motion.
 *
 * Requirements:
 *   npm i puppeteer
 *
 * Usage:
 *   node scripts/snap.mjs
 *
 * Environment:
 *   URL=file:///absolute/path/index.html?clean=1
 *   TIMES=0,1,2.5,4,6,8
 *   OUT=snapshots
 *   WIDTH=1920
 *   HEIGHT=1080
 */
import fs from "node:fs";
import path from "node:path";
import { captureOptions, withCapture } from './lib/capture.mjs';

const out = path.resolve(process.env.OUT || 'snapshots');
const options = captureOptions();
const times = (process.env.TIMES || '0,1,2.5,4,6,8').split(',').map(Number);
if (!times.length || times.some(t => !Number.isFinite(t) || t < 0)) throw new Error('TIMES must contain nonnegative numbers');
fs.mkdirSync(out, { recursive: true });
await withCapture(options, async ({ duration, frame }) => {
  if (times.some(t => t > duration)) throw new Error('Snapshot time exceeds OPENER.DURATION');
  for (const t of times) {
    const name = `t-${String(t).replaceAll('.', '_')}.png`;
    fs.writeFileSync(path.join(out, name), await frame(t));
    console.log('captured', t, '→', name);
  }
});

// Build a simple HTML contact sheet without additional image dependencies.
const imgs = times.map(t => {
  const name = `t-${String(t).replaceAll(".","_")}.png`;
  return `<figure><img src="${name}"><figcaption>${t.toFixed(2)}s</figcaption></figure>`;
}).join("\n");

fs.writeFileSync(path.join(out, "contact-sheet.html"), `<!doctype html>
<meta charset="utf-8">
<title>Motion QA contact sheet</title>
<style>
body{margin:20px;background:#111;color:#eee;font:14px system-ui}
main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
figure{margin:0;background:#1b1b1b;padding:8px;border-radius:10px}
img{width:100%;display:block;border-radius:6px}
figcaption{padding:8px 2px 2px}
</style><main>${imgs}</main>`);

console.log("done:", out);
