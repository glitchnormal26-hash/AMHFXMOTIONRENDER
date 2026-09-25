#!/usr/bin/env node
/**
 * Deterministic browser -> FFmpeg MP4 exporter.
 *
 * Default transport is streaming: Chromium screenshots are piped directly to FFmpeg
 * and are not persisted to disk. Use KEEP_FRAMES=1 to retain frame evidence, or
 * FRAME_TRANSPORT=files as a compatibility fallback for debugging unusual hosts.
 *
 * Common overrides:
 *   INDEX=assets/starter.html
 *   OUT_VIDEO=output/final.mp4
 *   QUALITY=fast|final
 *   FPS=30 WIDTH=1920 HEIGHT=1080 CRF=18 PRESET=veryfast
 *   BITRATE=6000k (target video bitrate; replaces CRF when set)
 *   MAXRATE=6000k BUFSIZE=12000k (rate-control ceiling; defaults derived from BITRATE)
 *   FRAME_TRANSPORT=stream|files
 *   KEEP_FRAMES=1 FRAMES_DIR=output/frames
 *   AUDIO=audio/final-mix.wav
 *   VOICEOVER=audio/voiceover.wav
 *   SFX=audio/sfx-mix.wav
 *   AMBIENCE=audio/ambience.wav
 *   REQUIRE_AUDIO=1 REQUIRE_VO=1
 *   FFMPEG_PATH / FFPROBE_PATH (absolute binaries, used when ffmpeg is not on PATH)
 *   CHROME_PATH (browser executable for hosts without a Puppeteer-managed download)
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { once } from "node:events";
import { spawn, spawnSync } from "node:child_process";
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
const ffmpegBin = process.env.FFMPEG_PATH || "ffmpeg";
const ffprobeBin = process.env.FFPROBE_PATH || "ffprobe";
const chromePath = process.env.CHROME_PATH || null;

/**
 * OFFLINE_ASSETS points at a JSON map for hosts where public CDNs are unreachable:
 *   { "cdn.jsdelivr.net/npm/gsap@": "/abs/path/node_modules/gsap/dist/",
 *     "fonts.googleapis.com/css2": "/abs/path/vendor/fonts.css" }
 * A key that ends with "/" is treated as a path prefix, otherwise it matches a URL
 * suffix. Values may be a local directory/file path or a file:// URL.
 */
// Slow hosts (software GL, 2-core CI) need headroom before the page signals ready.
const navTimeout = Number(process.env.NAV_TIMEOUT || 180000);
const offlineAssetsPath = process.env.OFFLINE_ASSETS || null;
const offlineAssets = offlineAssetsPath
  ? JSON.parse(await fsp.readFile(path.resolve(offlineAssetsPath), "utf8"))
  : null;
const offlineHits = [];

function offlineTargetFor(rawUrl) {
  if (!offlineAssets) return null;
  let localPath = null;
  let matchedKey = null;
  for (const [key, value] of Object.entries(offlineAssets)) {
    const at = rawUrl.indexOf(key);
    if (at === -1) continue;
    matchedKey = key;
    if (key.endsWith("/")) {
      // Prefix rule: everything after the matched prefix is a path relative to the
      // local directory in `value`, e.g. ".../npm/gsap@" + "3.13.0/dist/gsap.min.js".
      const remainder = rawUrl.slice(at + key.length).split("?")[0].split("#")[0];
      const segments = remainder.split("/").filter(Boolean).map(decodeURIComponent);
      localPath = path.resolve(String(value), ...segments);
    } else {
      localPath = path.resolve(String(value));
    }
    break;
  }
  if (!localPath) return null;
  let local = pathToFileURL(localPath).href;
  // npm three@0.161 ships bare "three" specifiers in examples/jsm; jsdelivr serves
  // those already rewritten to the versioned build path, so do the same locally.
  // Match the CDN URL (not the local file) so a remapped root still behaves.
  let rewriteThreeRoot = null;
  const jsmAt = rawUrl.indexOf("/examples/jsm/");
  if (jsmAt !== -1 && /\.m?js$/.test(rawUrl.split("?")[0])) {
    const buildUrl = rawUrl.slice(0, jsmAt) + "/build/three.module.js";
    const mappedBuild = offlineTargetFor(buildUrl);
    rewriteThreeRoot = mappedBuild ? mappedBuild.url : buildUrl;
  }
  return { url: local, key: matchedKey, rewriteThreeRoot };
}

async function serveOfflineAsset(request, target) {
  const filePath = decodeURIComponent(new URL(target.url.split("#")[0]).pathname);
  let body = await fsp.readFile(filePath);
  if (target.rewriteThreeRoot) {
    // jsdelivr rewrites the bare "three" specifier in examples/jsm files to the
    // matching versioned build path, so the same module instance is reused.
    const rewritten = body
      .toString("utf8")
      .replace(/from\s*(['"])three\1/g, `from '${target.rewriteThreeRoot}'`);
    body = Buffer.from(rewritten, "utf8");
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === ".js" || ext === ".mjs" ? "application/javascript; charset=utf-8"
    : ext === ".css" ? "text/css; charset=utf-8"
    : ext === ".json" ? "application/json; charset=utf-8"
    : ext === ".woff2" ? "font/woff2"
    : ext === ".woff" ? "font/woff"
    : ext === ".png" ? "image/png"
    : ext === ".svg" ? "image/svg+xml"
    : "application/octet-stream";
  offlineHits.push(`${target.key} -> ${filePath}`);
  await request.respond({
    status: 200,
    contentType,
    // ES modules are fetched in CORS mode even from a file:// page, so a local
    // stand-in still has to carry a CORS header or the import is rejected.
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Cache-Control": "no-store"
    },
    body
  });
}
const frameTransport = (process.env.FRAME_TRANSPORT || "stream").toLowerCase();
const keepFrames = process.env.KEEP_FRAMES === "1";
const explicitFramesDir = process.env.FRAMES_DIR ? path.resolve(process.env.FRAMES_DIR) : null;

if (!["stream", "files"].includes(frameTransport)) {
  throw new Error(`Invalid FRAME_TRANSPORT=${frameTransport}; expected stream or files`);
}
if (!Number.isFinite(fps) || fps <= 0) throw new Error("Invalid FPS");
if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
  throw new Error("Invalid WIDTH/HEIGHT");
}

/**
 * Accepts "6000", "6000k", "6M", or "6000000" and normalises to a bit-per-second
 * number. A bare number is read the way delivery bitrates are usually quoted:
 * values from 1000 up to just under 100 million mean kbps, larger values mean bps.
 */
function normalizeBitrate(raw, name) {
  const text = String(raw).trim().toLowerCase();
  const match = /^(\d+(?:\.\d+)?)\s*(k|m|kbps|mbps|bps)?$/.exec(text);
  if (!match) throw new Error(`Invalid ${name}=${raw}; expected e.g. 6000k, 6M, or 6000000`);
  const value = Number(match[1]);
  const unit = match[2] || (value >= 1000 && value < 1e8 ? "k" : "bps");
  const bps = unit === "m" || unit === "mbps" ? value * 1_000_000
    : unit === "k" || unit === "kbps" ? value * 1000
    : value;
  if (!Number.isFinite(bps) || bps <= 0) throw new Error(`Invalid ${name}=${raw}`);
  return Math.round(bps);
}

const bitrate = process.env.BITRATE || process.env.VIDEO_BITRATE || null;
const targetBps = bitrate ? normalizeBitrate(bitrate, "BITRATE") : null;
// MAXRATE/BUFSIZE default to the target rate and one second of that rate, both
// already in bits per second, so they are not run through the kbps heuristic again.
const maxrateBps = targetBps
  ? (process.env.MAXRATE ? normalizeBitrate(process.env.MAXRATE, "MAXRATE") : targetBps)
  : null;
const bufsizeBps = targetBps
  ? (process.env.BUFSIZE ? normalizeBitrate(process.env.BUFSIZE, "BUFSIZE") : maxrateBps * 2)
  : null;
if (targetBps && (maxrateBps > 2_147_483_647 || bufsizeBps > 2_147_483_647)) {
  throw new Error(`BITRATE/MAXRATE/BUFSIZE too large for x264 (max ~2.1e9 bps): ${targetBps}/${maxrateBps}/${bufsizeBps}`);
}

function rateControlArgs() {
  if (targetBps) {
    return [
      "-b:v", String(targetBps),
      "-maxrate", String(maxrateBps),
      "-bufsize", String(bufsizeBps)
    ];
  }
  return ["-crf", crf];
}

const outVideo = path.resolve(process.env.OUT_VIDEO || "output/final.mp4");
await fsp.mkdir(path.dirname(outVideo), { recursive: true });

let framesDir = explicitFramesDir;
let tempFramesDir = false;
if (keepFrames || frameTransport === "files") {
  if (!framesDir) {
    framesDir = await fsp.mkdtemp(path.join(os.tmpdir(), "motion-mp4-"));
    tempFramesDir = true;
  } else {
    await fsp.mkdir(framesDir, { recursive: true });
  }
}

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
if (!commandExists(ffmpegBin)) {
  console.error(`ERROR: ffmpeg is required but was not found (${ffmpegBin}). Set FFMPEG_PATH or add it to PATH.`);
  process.exit(2);
}
if (!commandExists(ffprobeBin)) {
  console.error(`ERROR: ffprobe is required but was not found (${ffprobeBin}). Set FFPROBE_PATH or add it to PATH.`);
  process.exit(2);
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
  process.exit(3);
}
if (requireAudio && !finalAudio && !voiceover && !sfx && !ambience) {
  console.error("ERROR: REQUIRE_AUDIO=1 but no audio source was found.");
  process.exit(3);
}

function buildFfmpegArgs(videoInput, duration) {
  const ff = ["-y", ...videoInput];

  if (finalAudio) {
    ff.push("-i", finalAudio);
    ff.push(
      "-map", "0:v:0", "-map", "1:a:0",
      "-c:v", "libx264", "-preset", encodePreset, ...rateControlArgs(),
      "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "192k",
      "-af", "apad",
      "-t", String(duration),
      "-movflags", "+faststart",
      outVideo
    );
    return ff;
  }

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
      "-c:v", "libx264", "-preset", encodePreset, ...rateControlArgs(),
      "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "192k",
      "-t", String(duration),
      "-movflags", "+faststart",
      outVideo
    );
  } else {
    ff.push(
      "-c:v", "libx264", "-preset", encodePreset, ...rateControlArgs(),
      "-pix_fmt", "yuv420p",
      "-t", String(duration),
      "-movflags", "+faststart",
      outVideo
    );
  }
  return ff;
}

async function waitForProcess(child, label) {
  const [code, signal] = await once(child, "exit");
  if (code !== 0) {
    throw new Error(`${label} failed with code=${code} signal=${signal || "none"}`);
  }
}

async function writeWithBackpressure(stream, chunk) {
  if (stream.destroyed || stream.writableEnded) {
    throw new Error("FFmpeg stdin closed before all frames were written");
  }
  if (!stream.write(chunk)) await once(stream, "drain");
}

console.log("Motion Designer MP4 export");
console.log(`quality=${quality} ${width}x${height} ${fps}fps ` +
  (targetBps ? `bitrate=${targetBps}bps maxrate=${maxrateBps} bufsize=${bufsizeBps}` : `CRF=${crf}`));
console.log(`transport=${frameTransport}${keepFrames ? " + keep-frames" : ""}`);
console.log(`source=${url}`);
console.log(`output=${outVideo}`);
if (offlineAssets) console.log(`offline assets=${offlineAssetsPath} (${Object.keys(offlineAssets).length} rules)`);
if (finalAudio) console.log(`audio mix=${finalAudio}`);
else {
  if (voiceover) console.log(`voiceover=${voiceover}`);
  if (sfx) console.log(`sfx=${sfx}`);
  if (ambience) console.log(`ambience=${ambience}`);
  if (!voiceover && !sfx && !ambience) console.warn("WARNING: no audio source detected.");
}

// DRY_RUN=1 prints the resolved FFmpeg command and exits before any capture work.
if (process.env.DRY_RUN === "1") {
  const previewArgs = buildFfmpegArgs([
    "-f", "image2pipe", "-framerate", String(fps), "-vcodec", "png", "-i", "pipe:0"
  ], 0);
  console.log(`\nDRY_RUN ffmpeg: ${ffmpegBin} ${previewArgs.join(" ")}`);
  process.exit(0);
}

let browser;
let ffmpeg;
const diagnostics = { page_errors: [], console_errors: [], request_failures: [], offline_errors: [], capture_retries: 0 };

// Software-GL hosts can destabilise after long captures; restarts are safe because
// every frame is captured by deterministic seek, never by realtime playback.
const restartEvery = Number(process.env.CAPTURE_RESTART_EVERY || 0);
let page = null;

async function openScene() {
  browser = await puppeteer.launch({
    headless: "new",
    ...(chromePath ? { executablePath: chromePath } : {}),
    args: [
      "--allow-file-access-from-files",
      "--autoplay-policy=no-user-gesture-required",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist",
      "--font-render-hinting=none",
      "--disable-dev-shm-usage",
      ...(process.env.NO_SANDBOX === "1" ? ["--no-sandbox", "--disable-setuid-sandbox"] : [])
    ]
  });
  page = await browser.newPage();
  page.on("pageerror", err => diagnostics.page_errors.push(String(err?.stack || err)));
  page.on("console", msg => {
    if (msg.type() === "error") diagnostics.console_errors.push(msg.text());
  });
  page.on("requestfailed", req => {
    diagnostics.request_failures.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText || "failed"}`);
  });

  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  if (offlineAssets) {
    await page.setRequestInterception(true);
    page.on("request", request => {
      const requestUrl = request.url();
      if (process.env.DEBUG_NET === "1") {
        console.error(`[req] ${request.resourceType()} ${requestUrl.slice(0, 150)}`);
      }
      const serve = async () => {
        try {
          if (!/^https?:/i.test(requestUrl)) {
            await request.continue();
            return;
          }
          const target = offlineTargetFor(requestUrl);
          if (process.env.DEBUG_NET === "1") {
            console.error(`[net] ${request.resourceType()} ${requestUrl} -> ${target ? target.url : "continue"}`);
          }
          if (target) {
            try {
              await serveOfflineAsset(request, target);
            } catch (err) {
              diagnostics.offline_errors.push(`${requestUrl} :: ${err.message}`);
              await request.respond({
                status: 404,
                contentType: "text/plain; charset=utf-8",
                body: Buffer.from(`offline asset unavailable: ${err.message}`)
              });
            }
          } else {
            await request.continue();
          }
        } catch (err) {
          if (process.env.DEBUG_NET === "1") {
            console.error(`[handler-throw] ${requestUrl.slice(0, 120)} :: ${err && err.message}`);
          }
        }
      };
      void serve();
    });
  }

  await page.goto(url, { waitUntil: "networkidle0", timeout: navTimeout });
  await page.waitForFunction(
    () => window.OPENER && window.OPENER.ready === true,
    { timeout: navTimeout }
  ).catch(async err => {
    // Report why the scene never signalled readiness instead of only the timeout.
    const state = await page.evaluate(() => {
      const probe = document.createElement("canvas");
      let gl = null;
      try { gl = probe.getContext("webgl2") || probe.getContext("webgl"); } catch {}
      return {
        has_opener: Boolean(window.OPENER),
        opener_ready: window.OPENER ? window.OPENER.ready === true : null,
        ready_state: document.readyState,
        fonts_status: document.fonts ? document.fonts.status : null,
        has_gsap: typeof window.gsap !== "undefined",
        webgl: gl ? String(gl.getParameter(gl.VERSION)) : null
      };
    }).catch(() => ({}));
    console.error("OPENER never became ready:", JSON.stringify(state));
    for (const line of [
      ...diagnostics.page_errors.slice(0, 3),
      ...diagnostics.console_errors.slice(0, 5),
      ...diagnostics.request_failures.slice(0, 5),
      ...diagnostics.offline_errors.slice(0, 5)
    ]) {
      console.error(`  ${String(line).slice(0, 300)}`);
    }
    throw err;
  });
  await page.evaluate(() => document.fonts?.ready);
}

async function closeScene() {
  if (browser) {
    try { await browser.close(); } catch {}
    browser = null;
  }
  page = null;
}

try {
  await openScene();

  if (diagnostics.page_errors.length) {
    throw new Error(`Page runtime error before capture: ${diagnostics.page_errors[0]}`);
  }

  const duration = await page.evaluate(() => Number(window.OPENER.DURATION));
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("Invalid window.OPENER.DURATION");
  const frameCount = Math.ceil(duration * fps);
  console.log(`rendering ${frameCount} frames (${duration.toFixed(3)}s)`);

  let encodePromise = null;
  if (frameTransport === "stream") {
    const ffArgs = buildFfmpegArgs([
      "-f", "image2pipe",
      "-framerate", String(fps),
      "-vcodec", "png",
      "-i", "pipe:0"
    ], duration);
    ffmpeg = spawn(ffmpegBin, ffArgs, { stdio: ["pipe", "inherit", "inherit"] });
    ffmpeg.on("error", err => {
      diagnostics.console_errors.push(`ffmpeg spawn error: ${err.message}`);
    });
    encodePromise = waitForProcess(ffmpeg, "ffmpeg");
  }

  for (let f = 0; f < frameCount; f++) {
    const t = f / fps;
    let frame = null;
    for (let attempt = 1; attempt <= 2 && frame === null; attempt++) {
      try {
        await page.evaluate(async time => {
          if (window.OPENER.seek) window.OPENER.seek(time);
          else window.OPENER.tl.pause().time(time, false);
          if (window.gsap?.ticker?.tick) window.gsap.ticker.tick();
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }, t);

        if (diagnostics.page_errors.length) {
          throw new Error(`Page runtime error during capture: ${diagnostics.page_errors.at(-1)}`);
        }

        frame = Buffer.from(await page.screenshot({
          type: "png",
          clip: { x: 0, y: 0, width, height },
          optimizeForSpeed: true
        }));
      } catch (err) {
        diagnostics.capture_retries += 1;
        console.warn(`capture failure at frame ${f} (attempt ${attempt}): ${String(err && err.message).slice(0, 160)}`);
        diagnostics.page_errors.length = 0;
        await closeScene();
        await openScene();
      }
    }
    if (frame === null) throw new Error(`Frame ${f} could not be captured after retry`);

    if (keepFrames || frameTransport === "files") {
      const name = `f${String(f).padStart(6, "0")}.png`;
      await fsp.writeFile(path.join(framesDir, name), frame);
    }
    if (frameTransport === "stream") {
      await writeWithBackpressure(ffmpeg.stdin, frame);
    }

    if (f % Math.max(1, fps) === 0) {
      process.stdout.write(`\r${t.toFixed(1)}s / ${duration.toFixed(1)}s`);
    }
    if (restartEvery > 0 && (f + 1) % restartEvery === 0 && f + 1 < frameCount) {
      await closeScene();
      await openScene();
    }
  }
  process.stdout.write("\n");

  await closeScene();

  if (frameTransport === "stream") {
    ffmpeg.stdin.end();
    await encodePromise;
    ffmpeg = null;
  } else {
    const ffArgs = buildFfmpegArgs([
      "-framerate", String(fps),
      "-i", path.join(framesDir, "f%06d.png")
    ], duration);
    const enc = spawnSync(ffmpegBin, ffArgs, { stdio: "inherit" });
    if (enc.status !== 0) throw new Error(`ffmpeg failed with status ${enc.status}`);
  }

  const probe = spawnSync(
    ffprobeBin,
    [
      "-v", "error",
      "-show_entries", "format=duration,bit_rate,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,bit_rate",
      "-of", "json",
      outVideo
    ],
    { encoding: "utf-8" }
  );
  if (probe.status !== 0) throw new Error("ffprobe could not verify the final MP4");

  const meta = JSON.parse(probe.stdout);
  const streams = meta.streams || [];
  const videoStream = streams.find(s => s.codec_type === "video");
  const audioStream = streams.find(s => s.codec_type === "audio");
  if (!videoStream) throw new Error("Final MP4 has no video stream");
  if ((requireAudio || requireVO) && !audioStream) {
    throw new Error("Final MP4 requires audio but no audio stream was found");
  }

  const report = {
    status: "TECHNICAL_VERIFIED",
    technical_status: "TECHNICAL_VERIFIED",
    output: outVideo,
    quality,
    frame_transport: frameTransport,
    retained_frames: Boolean(keepFrames || explicitFramesDir),
    requested: {
      width,
      height,
      fps,
      video_bitrate_bps: targetBps,
      maxrate_bps: maxrateBps,
      bufsize_bps: bufsizeBps,
      crf: targetBps ? null : Number(crf)
    },
    duration: Number(meta.format?.duration || 0),
    video: videoStream,
    audio: audioStream || null,
    audio_sources: {
      final_mix: finalAudio,
      voiceover,
      sfx,
      ambience
    },
    offline_assets: offlineAssetsPath ? { map: offlineAssetsPath, served: offlineHits } : null,
    diagnostics
  };

  const reportPath = outVideo.replace(/\.mp4$/i, ".verify.json");
  await fsp.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log("\nTECHNICAL_VERIFIED");
  console.log(`MP4: ${outVideo}`);
  console.log(`verify: ${reportPath}`);
  console.log(`video=${videoStream.codec_name || "unknown"} ${videoStream.width}x${videoStream.height}`);
  console.log(`audio=${audioStream ? audioStream.codec_name : "none"}`);
  if (diagnostics.console_errors.length || diagnostics.request_failures.length || diagnostics.offline_errors.length) {
    console.warn(`diagnostics: console_errors=${diagnostics.console_errors.length} request_failures=${diagnostics.request_failures.length} offline_errors=${diagnostics.offline_errors.length}`);
  }
  if (diagnostics.offline_errors.length) {
    console.warn(`offline asset errors:\n  ${diagnostics.offline_errors.slice(0, 5).join("\n  ")}`);
  }
} finally {
  if (browser) {
    try { await browser.close(); } catch {}
  }
  if (ffmpeg) {
    try { ffmpeg.stdin?.destroy(); } catch {}
    try { ffmpeg.kill("SIGTERM"); } catch {}
  }
  if (tempFramesDir && framesDir && !keepFrames) {
    try { await fsp.rm(framesDir, { recursive: true, force: true }); } catch {}
  } else if (framesDir && (keepFrames || explicitFramesDir)) {
    console.log(`frames kept at ${framesDir}`);
  }
}
