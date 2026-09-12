#!/usr/bin/env node
/**
 * One-command deterministic MP4 exporter for Motion Designer.
 *
 * Usage:
 *   node scripts/export-mp4.mjs
 *
 * Quality presets:
 *   QUALITY=fast  node scripts/export-mp4.mjs   # default: 30 fps, CRF 18
 *   QUALITY=final node scripts/export-mp4.mjs   # 60 fps, CRF 16
 *
 * Common overrides:
 *   URL=file:///absolute/path/index.html?clean=1
 *   OUT_VIDEO=output/final.mp4
 *   FPS=30
 *   WIDTH=1920
 *   HEIGHT=1080
 *   CRF=16
 *   PRESET=medium
 *   KEEP_FRAMES=1
 *
 * Audio inputs (auto-detected when omitted):
 *   AUDIO=audio/final-mix.wav
 *   VOICEOVER=audio/voiceover.wav
 *   SFX=audio/sfx-mix.wav
 *   AMBIENCE=audio/ambience.wav
 *
 * Finalization guards:
 *   REQUIRE_AUDIO=1   fail if no usable audio source exists
 *   REQUIRE_VO=1      fail unless AUDIO/final-mix or VOICEOVER exists
 *
 * Notes:
 * - Browser screenshot capture contains no audio.
 * - This script renders frames, encodes H.264, mixes/muxes audio, then verifies
 *   the final streams with ffprobe.
 * - Requires: Node.js, puppeteer, ffmpeg, ffprobe.
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const cwd = process.cwd();
const quality = (process.env.QUALITY || "fast").toLowerCase();
const presetDefaults = quality === "final"
  ? { fps: 60, crf: 16, preset: "medium" }
  : { fps: 30, crf: 18, preset: "veryfast" };

const fps = Number(process.env.FPS || presetDefaults.fps);
const width = Number(process.env.WIDTH || 1920);
const height = Number(process.env.HEIGHT || 1080);
const crf = String(process.env.CRF || presetDefaults.crf);
const encodePreset = process.env.PRESET || presetDefaults.preset;

const outVideo = path.resolve(process.env.OUT_VIDEO || "output/final.mp4");
await fsp.mkdir(path.dirname(outVideo), { recursive: true });

const keepFrames = process.env.KEEP_FRAMES === "1";
const explicitFramesDir = process.env.FRAMES_DIR ? path.resolve(process.env.FRAMES_DIR) : null;
const framesDir = explicitFramesDir || await fsp.mkdtemp(path.join(os.tmpdir(), "motion-mp4-"));

const indexFile = path.resolve(process.env.INDEX || "index.html");
const url = process.env.URL || (pathToFileURL(indexFile).href + "?clean=1");

const requireAudio = process.env.REQUIRE_AUDIO === "1";
const requireVO = process.env.REQUIRE_VO === "1";

const voGain = Number(process.env.VO_GAIN || 1.0);
const sfxGain = Number(process.env.SFX_GAIN || 0.42);
const ambienceGain = Number(process.env.AMBIENCE_GAIN || 0.20);

function commandExists(cmd) {
  const r = spawnSync(cmd, ["-version"], { stdio: "ignore" });
  return r.status === 0;
}
if (!commandExists("ffmpeg")) {
  console.error("ERROR: ffmpeg is required but was not found on PATH.");
  process.exit(2);
}
if (!commandExists("ffprobe")) {
  console.error("ERROR: ffprobe is required but was not found on PATH.");
  process.exit(2);
}
if (!Number.isFinite(fps) || fps <= 0) throw new Error("Invalid FPS");
if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
  throw new Error("Invalid WIDTH/HEIGHT");
}

function firstExisting(candidates) {
  for (const p of candidates) {
    if (!p) continue;
    const abs = path.resolve(p);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  }
  return null;
}
function candidates(base) {
  return [".wav", ".mp3", ".m4a", ".aac", ".flac", ".ogg"].map(ext => base + ext);
}

const finalAudio = firstExisting([
  process.env.AUDIO,
  ...candidates("audio/final-mix"),
  ...candidates("audio/final"),
]);
const voiceover = firstExisting([
  process.env.VOICEOVER,
  ...candidates("audio/voiceover"),
  ...candidates("audio/vo"),
]);
const sfx = firstExisting([
  process.env.SFX,
  ...candidates("audio/sfx-mix"),
  ...candidates("audio/sfx"),
]);
const ambience = firstExisting([
  process.env.AMBIENCE,
  ...candidates("audio/ambience"),
  ...candidates("audio/tech-ambience"),
]);

if (requireVO && !finalAudio && !voiceover) {
  console.error("ERROR: REQUIRE_VO=1 but no AUDIO/final-mix or VOICEOVER file was found.");
  console.error("Expected e.g. audio/final-mix.wav or audio/voiceover.wav");
  process.exit(3);
}
if (requireAudio && !finalAudio && !voiceover && !sfx && !ambience) {
  console.error("ERROR: REQUIRE_AUDIO=1 but no audio source was found.");
  process.exit(3);
}

console.log("Motion Designer direct MP4 export");
console.log(`quality=${quality}  ${width}x${height}  ${fps}fps  CRF=${crf}`);
console.log(`source=${url}`);
console.log(`output=${outVideo}`);
if (finalAudio) console.log(`audio mix=${finalAudio}`);
else {
  if (voiceover) console.log(`voiceover=${voiceover}`);
  if (sfx) console.log(`sfx=${sfx}`);
  if (ambience) console.log(`ambience=${ambience}`);
  if (!voiceover && !sfx && !ambience) console.warn("WARNING: no audio source detected.");
}

let browser;
try {
  browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--allow-file-access-from-files",
      "--autoplay-policy=no-user-gesture-required",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist"
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
  await page.waitForFunction(
    () => window.OPENER && window.OPENER.ready === true,
    { timeout: 120000 }
  );
  await page.evaluate(() => document.fonts?.ready);

  const duration = await page.evaluate(() => Number(window.OPENER.DURATION));
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("Invalid window.OPENER.DURATION");
  }

  const frameCount = Math.ceil(duration * fps);
  console.log(`rendering ${frameCount} frames (${duration.toFixed(3)}s)`);

  for (let f = 0; f < frameCount; f++) {
    const t = f / fps;
    await page.evaluate(async (time) => {
      if (window.OPENER.seek) window.OPENER.seek(time);
      else window.OPENER.tl.pause().time(time, false);
      if (window.gsap?.ticker?.tick) window.gsap.ticker.tick();
      await new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
    }, t);

    const name = `f${String(f).padStart(6, "0")}.png`;
    await page.screenshot({
      path: path.join(framesDir, name),
      clip: { x: 0, y: 0, width, height },
      optimizeForSpeed: true
    });

    if (f % Math.max(1, fps) === 0) {
      process.stdout.write(`\r${t.toFixed(1)}s / ${duration.toFixed(1)}s`);
    }
  }
  process.stdout.write("\n");
  await browser.close();
  browser = null;

  const ff = [
    "-y",
    "-framerate", String(fps),
    "-i", path.join(framesDir, "f%06d.png")
  ];

  if (finalAudio) {
    ff.push("-i", finalAudio);
    ff.push(
      "-map", "0:v:0", "-map", "1:a:0",
      "-c:v", "libx264", "-preset", encodePreset, "-crf", crf,
      "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "192k",
      "-af", "apad",
      "-t", String(duration),
      "-movflags", "+faststart",
      outVideo
    );
  } else {
    const audioInputs = [];
    if (voiceover) audioInputs.push({ path: voiceover, gain: voGain, tag: "vo" });
    if (sfx) audioInputs.push({ path: sfx, gain: sfxGain, tag: "sfx" });
    if (ambience) audioInputs.push({ path: ambience, gain: ambienceGain, tag: "amb" });

    for (const a of audioInputs) ff.push("-i", a.path);

    if (audioInputs.length) {
      const filterParts = [];
      const mixTags = [];
      audioInputs.forEach((a, i) => {
        const inIndex = i + 1;
        filterParts.push(`[${inIndex}:a]volume=${a.gain},apad[${a.tag}]`);
        mixTags.push(`[${a.tag}]`);
      });
      filterParts.push(
        `${mixTags.join("")}amix=inputs=${audioInputs.length}:duration=longest:dropout_transition=0,alimiter=limit=0.95[aout]`
      );

      ff.push(
        "-filter_complex", filterParts.join(";"),
        "-map", "0:v:0", "-map", "[aout]",
        "-c:v", "libx264", "-preset", encodePreset, "-crf", crf,
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", String(duration),
        "-movflags", "+faststart",
        outVideo
      );
    } else {
      ff.push(
        "-c:v", "libx264", "-preset", encodePreset, "-crf", crf,
        "-pix_fmt", "yuv420p",
        "-t", String(duration),
        "-movflags", "+faststart",
        outVideo
      );
    }
  }

  console.log("encoding/muxing MP4...");
  const enc = spawnSync("ffmpeg", ff, { stdio: "inherit" });
  if (enc.status !== 0) process.exit(enc.status ?? 4);

  const probe = spawnSync(
    "ffprobe",
    [
      "-v", "error",
      "-show_entries", "format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate",
      "-of", "json",
      outVideo
    ],
    { encoding: "utf-8" }
  );
  if (probe.status !== 0) {
    console.error("ERROR: ffprobe could not verify the final MP4.");
    process.exit(5);
  }

  const meta = JSON.parse(probe.stdout);
  const streams = meta.streams || [];
  const videoStream = streams.find(s => s.codec_type === "video");
  const audioStream = streams.find(s => s.codec_type === "audio");

  if (!videoStream) {
    console.error("ERROR: final MP4 has no video stream.");
    process.exit(6);
  }
  if ((requireAudio || requireVO) && !audioStream) {
    console.error("ERROR: final MP4 requires audio but no audio stream was found.");
    process.exit(6);
  }

  const report = {
    status: "FINAL_VERIFIED",
    output: outVideo,
    quality,
    requested: { width, height, fps },
    duration: Number(meta.format?.duration || 0),
    video: videoStream,
    audio: audioStream || null,
    audio_sources: {
      final_mix: finalAudio,
      voiceover,
      sfx,
      ambience
    }
  };

  const reportPath = outVideo.replace(/\.mp4$/i, ".verify.json");
  await fsp.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log("\nFINAL_VERIFIED");
  console.log(`MP4: ${outVideo}`);
  console.log(`verify: ${reportPath}`);
  console.log(`video=${videoStream.codec_name || "unknown"} ${videoStream.width}x${videoStream.height}`);
  console.log(`audio=${audioStream ? audioStream.codec_name : "none"}`);

} finally {
  if (browser) {
    try { await browser.close(); } catch {}
  }
  if (!keepFrames && !explicitFramesDir) {
    try { await fsp.rm(framesDir, { recursive: true, force: true }); } catch {}
  } else {
    console.log(`frames kept at ${framesDir}`);
  }
}
