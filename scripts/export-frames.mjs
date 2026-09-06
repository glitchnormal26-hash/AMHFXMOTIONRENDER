#!/usr/bin/env node
/**
 * Deterministic frame-by-frame export for an OPENER-compatible browser motion.
 *
 * Requirements:
 *   npm i puppeteer
 * Optional encode:
 *   ffmpeg available on PATH
 *
 * Usage:
 *   FPS=60 node scripts/export-frames.mjs
 *   FPS=60 ENCODE=1 OUT_VIDEO=out.mp4 node scripts/export-frames.mjs
 *
 * Environment:
 *   URL=file:///absolute/path/index.html?clean=1
 *   FRAMES_DIR=frames
 *   FPS=60
 *   WIDTH=1920
 *   HEIGHT=1080
 *   ENCODE=0|1
 *   OUT_VIDEO=out.mp4
 *   AUDIO=audio/final-mix.wav         // preferred: already mixed VO + SFX
 *   VOICEOVER=audio/voiceover.wav    // used when AUDIO is not supplied
 *   SFX=audio/sfx-mix.wav            // optional, mixed with VOICEOVER
 *   VO_GAIN=1.0
 *   SFX_GAIN=0.45
 *
 * IMPORTANT: Puppeteer screenshot capture contains no audio. Supplying AUDIO or
 * VOICEOVER is required for narrated final-video export.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const cwd = process.cwd();
const framesDir = path.resolve(process.env.FRAMES_DIR || "frames");
fs.mkdirSync(framesDir, {recursive:true});

const fps = Number(process.env.FPS || 60);
const width = Number(process.env.WIDTH || 1920);
const height = Number(process.env.HEIGHT || 1080);
const url = process.env.URL || (pathToFileURL(path.join(cwd,"index.html")).href + "?clean=1");

const browser = await puppeteer.launch({
  headless:"new",
  args:["--allow-file-access-from-files","--autoplay-policy=no-user-gesture-required"]
});
const page = await browser.newPage();
await page.setViewport({width,height,deviceScaleFactor:1});
await page.goto(url,{waitUntil:"networkidle0"});
await page.waitForFunction(() => window.OPENER && window.OPENER.ready === true,{timeout:30000});

const duration = await page.evaluate(() => Number(window.OPENER.DURATION));
if (!Number.isFinite(duration) || duration <= 0) throw new Error("Invalid window.OPENER.DURATION");
const frameCount = Math.ceil(duration * fps);

for (let f=0; f<frameCount; f++) {
  const t = f / fps;
  await page.evaluate((time) => {
    window.OPENER.seek(time);
    if (window.gsap?.ticker?.tick) window.gsap.ticker.tick();
  }, t);
  // Two animation frames allow style/render state to settle in mixed DOM/WebGL projects.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const name = `f${String(f).padStart(6,"0")}.png`;
  await page.screenshot({path:path.join(framesDir,name),fullPage:false});
  if (f % fps === 0) console.log(`${t.toFixed(1)}s / ${duration.toFixed(1)}s`);
}

await browser.close();

if (process.env.ENCODE === "1") {
  const outVideo = path.resolve(process.env.OUT_VIDEO || "out.mp4");
  const finalAudio = process.env.AUDIO ? path.resolve(process.env.AUDIO) : null;
  const voiceover = process.env.VOICEOVER ? path.resolve(process.env.VOICEOVER) : null;
  const sfx = process.env.SFX ? path.resolve(process.env.SFX) : null;
  const voGain = Number(process.env.VO_GAIN || 1.0);
  const sfxGain = Number(process.env.SFX_GAIN || 0.45);

  const args = [
    "-y",
    "-framerate", String(fps),
    "-i", path.join(framesDir,"f%06d.png")
  ];

  if (finalAudio) {
    args.push("-i", finalAudio);
    args.push(
      "-map","0:v:0","-map","1:a:0",
      "-c:v","libx264","-pix_fmt","yuv420p","-crf","16",
      "-c:a","aac","-b:a","192k",
      "-af","apad",
      "-t", String(duration),
      outVideo
    );
  } else if (voiceover && sfx) {
    args.push("-i", voiceover, "-i", sfx);
    args.push(
      "-filter_complex",
      `[1:a]volume=${voGain}[vo];[2:a]volume=${sfxGain}[sfx];[vo][sfx]amix=inputs=2:duration=longest:dropout_transition=0,apad[a]`,
      "-map","0:v:0","-map","[a]",
      "-c:v","libx264","-pix_fmt","yuv420p","-crf","16",
      "-c:a","aac","-b:a","192k",
      "-t", String(duration),
      outVideo
    );
  } else if (voiceover) {
    args.push("-i", voiceover);
    args.push(
      "-map","0:v:0","-map","1:a:0",
      "-c:v","libx264","-pix_fmt","yuv420p","-crf","16",
      "-c:a","aac","-b:a","192k",
      "-af",`volume=${voGain},apad`,
      "-t", String(duration),
      outVideo
    );
  } else {
    console.warn("WARNING: ENCODE=1 but no AUDIO or VOICEOVER was supplied.");
    console.warn("The exported video will be silent and must not be treated as a final narrated explainer.");
    args.push(
      "-c:v","libx264","-pix_fmt","yuv420p","-crf","16",
      outVideo
    );
  }

  const r = spawnSync("ffmpeg", args, {stdio:"inherit"});
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log("video:", outVideo);
}
