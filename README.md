# AMHFXMOTIONRENDER

Production-oriented browser motion renderer using **Motion Designer v3.9.4** as a single integrated rulebook/runtime stack.

## Architecture

There is one active skill path:

`SKILL.md` → `skill-source/part-01.md` + `skill-source/part-02.md` → `references/` + `runtime/` + `scripts/`

`SKILL.md` maps the modular motion rules onto the compact reference/runtime modules already present in this repository.

## Generic render entry

`assets/starter.html` is the neutral OPENER-compatible smoke-test/starter scene used for generic renderer QA. The root `index.html` is only a lightweight launcher to that starter so the standard commands work without shipping a sample project.

This repository intentionally keeps project-specific video productions out of `main`. Build one-off scenes on a temporary branch or in a separate project repository and point `INDEX` at that scene when rendering.

## FFmpeg-first renderer

The production render path is browser frame capture followed by **FFmpeg** encoding/muxing and **ffprobe** verification. FFmpeg does not execute HTML/SVG/JavaScript itself, so Puppeteer remains the deterministic rasterization layer while FFmpeg is the only media encoder/muxer.

Render the root starter or set `INDEX` to another OPENER-compatible HTML scene:

```bash
npm ci
npm run render:ffmpeg
QUALITY=final npm run render:ffmpeg
# Serve module-based scenes with npm run serve in a separate terminal
URL=http://localhost:8000/assets/starter-full-runtime.html?clean=1 OUT_VIDEO=output/example.mp4 npm run render:ffmpeg
```

Generated media belongs under `output/` (or another ignored local path) and must not be committed to `main`.

## Main commands

```bash
npm run check
npm run serve
npm run snap
npm run export:frames
npm run export:mp4
npm run export:mp4:final
npm run render:ffmpeg
npm run render:ffmpeg:final
```

## Main entry points

- `SKILL.md` — Motion Designer v3.9.4 integration/router and hard quality gates
- `skill-source/` — canonical active rule source
- `references/camera-motion.md` — camera choreography and framing gate
- `references/anti-ppt.md` — continuity / anti-presentation verification
- `references/techniques.md` — kinetic and transition techniques
- `references/failure-gates.md` — playback-first rejection gates
- `references/` — additional compact production guidance
- `runtime/` — motion, camera, Three.js, explainer, and audio helpers
- `scripts/export-mp4.mjs` — deterministic browser-capture + FFmpeg MP4 renderer
- `scripts/snap.mjs` — snapshot QA
- `assets/` — neutral starter architectures and allowed SFX assets
- `.github/workflows/qa.yml` — fast source/runtime QA and repository hygiene
- `.github/workflows/render-e2e.yml` — project-agnostic FFmpeg render QA
- `MANAGE.md` — branch, cleanup, output, and repository ownership rules

## Runtime principles

Use DOM/SVG/GSAP first. Escalate to true 3D only when spatial geometry, camera, lighting, or post-processing materially improves communication.

Substantial motion must pass skill-usage, playback, camera, composition, kinetic, continuity, payoff, anti-PPT, and applicable audio gates before `FINAL_VERIFIED`.

There are no voice-over rules. SFX are optional and may only use user-supplied files or repository files already present under `assets/`. If no suitable SFX asset exists, render without SFX.

`FINAL_VERIFIED` is reserved for media that has actually passed the relevant visual, timing, stream, composition, camera, kinetic, continuity, and audio checks.

## Requirements

- Node.js 22+
- Python 3.12+ for the local server helper
- `ffmpeg` and `ffprobe` on `PATH` for MP4 export

## License

See `THIRD_PARTY_LICENSES.md`.

## Efficient capture and verification

Remotion is not a dependency or render path. The pipeline uses one shared browser
capture module for snapshots, PNG export and MP4, and one FFmpeg encoder.
Lossless PNGs stream directly into FFmpeg with bounded writes while capture runs;
normal exports need no intermediate frame directory. This saves PNG disk writes and
reads without adding a lossy capture step. Actual speed depends on scene and hardware.

- `QUALITY=fast`: 30 FPS, CRF 18, veryfast encoding for iteration.
- `QUALITY=final`: 60 FPS, CRF 16, medium encoding for delivery review.
- `ENCODE_THREADS` defaults to at most four workers, leaving CPU capacity for
  Chromium. Increase only after benchmarking the target machine.
- Override `FPS`, even `WIDTH`/`HEIGHT`, `CRF` (0–51), and `PRESET` for the brief.
- `KEEP_FRAMES=1` or `FRAMES_DIR=frames` retains PNGs in a unique `render-*`
  subdirectory. `export:frames` uses the same directory layout to prevent stale-frame
  contamination. `ENCODE=1 npm run export:frames` delegates to the MP4 exporter.
- Explicit `AUDIO`, `VOICEOVER`, `SFX`, or `AMBIENCE` paths must exist. Audio is
  preflighted before capture; missing audio is allowed unless a require flag is set.
- Failed capture, encoding or verification leaves the previous MP4 untouched and
  removes private staging files. Retained debugging frames are kept intentionally.

The `.verify.json` report records `TECHNICALLY_VERIFIED` after checking H.264,
yuv420p, dimensions, FPS, decoded frame count, timeline duration, and expected AAC
presence. `playback_review` remains `PENDING`: watch the encoded video and apply the
creative/audio gates before declaring `FINAL_VERIFIED`.

Run `npm run check` for syntax, source integrity and render-contract tests. Render
E2E CI exercises the real Chromium/FFmpeg path and stores review artifacts.

## Chromium startup

Removing Remotion does not remove Chromium: HTML, SVG, GSAP and WebGL still need a
browser to produce pixels. FFmpeg performs media encoding, not browser rendering.

Use `npm ci` to install the locked dependency versions, then
`npx puppeteer browsers install chrome` if the browser download was skipped.
For a preinstalled compatible Chrome, set `PUPPETEER_EXECUTABLE_PATH` to its absolute
executable path. In restricted environments, point `TMPDIR` and
`PUPPETEER_CACHE_DIR` at writable directories. Linux hosts also need Chrome's system
libraries and a working sandbox. Do not disable the sandbox as a default fix.

The exporter fails explicitly when Chromium cannot launch; it does not silently
produce a placeholder video. Existing output remains intact. CI runs the browser
smoke test before expensive renders so environment failures surface early.

## Measured acceptance checks

PR CI verifies shared capture, exact snapshot/frame agreement, separate frame
folders, 4K encoding, audio mixing/padding, the legacy ENCODE entry point, failure
cleanup, and preservation of existing output. A short 4K fixture keeps PR checks
small; full-duration 4K regression remains on main/manual dispatch. Chromium is
cached by OS, architecture and lockfile to reuse the matching installed browser.

`benchmark-pr.txt` records wall time and peak process memory for the 720p starter.
The JSON report records renderer elapsed time and frame count. Compare identical
scenes, FPS, quality and runner hardware before claiming a speedup. These technical
checks do not replace encoded playback inspection or creative quality review.
