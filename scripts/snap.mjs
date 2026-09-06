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
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const cwd = process.cwd();
const out = path.resolve(process.env.OUT || "snapshots");
fs.mkdirSync(out, {recursive:true});

const width = Number(process.env.WIDTH || 1920);
const height = Number(process.env.HEIGHT || 1080);
const times = (process.env.TIMES || "0,1,2.5,4,6,8")
  .split(",").map(Number).filter(Number.isFinite);

const defaultFile = path.join(cwd, "index.html");
const defaultUrl = pathToFileURL(defaultFile).href + "?clean=1";
const url = process.env.URL || defaultUrl;

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--allow-file-access-from-files", "--autoplay-policy=no-user-gesture-required"]
});
const page = await browser.newPage();
await page.setViewport({width, height, deviceScaleFactor:1});
await page.goto(url, {waitUntil:"networkidle0"});
await page.waitForFunction(() => window.OPENER && window.OPENER.ready === true, {timeout:30000});

for (const t of times) {
  await page.evaluate((time) => {
    window.OPENER.seek(time);
    if (window.gsap?.ticker?.tick) window.gsap.ticker.tick();
  }, t);
  await new Promise(r => setTimeout(r, 60));
  const name = `t-${String(t).replaceAll(".","_")}.png`;
  await page.screenshot({path:path.join(out,name), fullPage:false});
  console.log("captured", t, "→", name);
}

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

await browser.close();
console.log("done:", out);
