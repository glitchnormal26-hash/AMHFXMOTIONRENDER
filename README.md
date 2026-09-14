# AMHFXMOTIONRENDER

Production-oriented browser motion renderer using **Motion Designer v3.9.4** as a single integrated rulebook/runtime stack.

## Architecture

The scene contract remains `window.OPENER`: a scene exposes `ready`, `DURATION`, and deterministic `seek(time)`. Rendering can now use either of two engines without changing the scene:

- **FFmpeg engine** — one deterministic Puppeteer capture stream piped directly into `libx264`.
- **Remotion engine** — an OPENER bridge rendered concurrently by Remotion, then verified by the same AMHFX ffprobe contract.

The verifier remains engine-independent. Successful encoding is reported as `TECHNICALLY_VERIFIED`; playback review is still required before any creative deliverable is considered `FINAL_VERIFIED`.

## Generic render entry

`assets/starter.html` is the neutral OPENER-compatible smoke-test/starter scene. The root `index.html` is a lightweight launcher to that starter.

Project-specific productions should stay on temporary branches or separate project repositories. Point `INDEX` at the desired OPENER-compatible scene when rendering.

## Install

Base renderer:

```bash
npm ci
```

Optional Remotion engine, installed separately so normal `npm ci` stays small and deterministic:

```bash
npm run remotion:setup
```

Remotion is pinned in `remotion/package.json`. Its packages are intentionally not added to the root `package-lock.json`.

## Rendering

Automatic engine selection:

```bash
npm run export:mp4
QUALITY=final npm run export:mp4
```

`RENDER_ENGINE=auto` is the default. It uses Remotion when `remotion/node_modules/@remotion/renderer` is installed; otherwise it falls back to the existing FFmpeg/Puppeteer renderer.

Choose an engine explicitly:

```bash
RENDER_ENGINE=ffmpeg npm run export:mp4
RENDER_ENGINE=remotion npm run export:mp4

npm run render:ffmpeg
npm run render:remotion
```

Final-quality aliases:

```bash
npm run render:ffmpeg:final
npm run render:remotion:final
```

For module-based scenes, run `npm run serve` separately and use the legacy FFmpeg path with `URL=...` if the scene cannot be represented as a repository-local static entry. The Remotion bridge is optimized for repository-local `INDEX` files and their `assets/` / `runtime/` dependencies.

## Remotion performance controls

The Remotion engine preserves the OPENER timeline but lets multiple Chromium render workers capture different frames concurrently.

Defaults:

- `REMOTION_CONCURRENCY=75%` — uses 75% of logical CPU threads.
- `QUALITY=fast` — JPEG intermediate frames at quality 92, CRF 18, `veryfast`.
- `QUALITY=final` — lossless PNG intermediate frames, CRF 16, `medium`.
- `REMOTION_HARDWARE_ACCELERATION=disabled` — deterministic software x264 by default.
- `REMOTION_HARDWARE_ACCELERATION=if-possible` — use supported hardware encoding when present. CRF is then replaced by `VIDEO_BITRATE`.
- `VIDEO_BITRATE=45M` is the default hardware target for 4K and `16M` below 4K.
- `REMOTION_IMAGE_FORMAT=jpeg|png` and `REMOTION_JPEG_QUALITY=0..100` override intermediate capture quality.
- `REMOTION_SCENE_TIMEOUT_MS=30000` controls how long a worker waits for `OPENER.ready`.

Examples:

```bash
REMOTION_CONCURRENCY=50% npm run render:remotion
REMOTION_IMAGE_FORMAT=png QUALITY=fast npm run render:remotion
REMOTION_HARDWARE_ACCELERATION=if-possible VIDEO_BITRATE=45M npm run render:remotion
```

The bridge reuses Puppeteer's installed Chrome through `browserExecutable`, so CI does not need a second Chromium download.

## FFmpeg renderer

The original production path remains available and unchanged in behavior: Puppeteer seeks each frame deterministically, lossless PNG frames stream directly to FFmpeg, writes are back-pressured, and encoding overlaps capture.

- `QUALITY=fast`: 30 FPS, CRF 18, `veryfast`.
- `QUALITY=final`: 60 FPS, CRF 16, `medium`.
- `ENCODE_THREADS` defaults to at most four workers so Chromium retains CPU capacity.
- `KEEP_FRAMES=1` or `FRAMES_DIR=frames` retains PNGs in unique `render-*` directories.

This path is the compatibility fallback and remains useful for scenes served through `URL=` or environments where the optional Remotion engine is not installed.

## Audio and output safety

Both engines support `AUDIO`, `VOICEOVER`, `SFX`, and `AMBIENCE`. Sources are preflighted before expensive rendering. `REQUIRE_AUDIO=1` and `REQUIRE_VO=1` convert missing audio into hard failures.

The Remotion engine renders video first, then performs audio mix/mux with `-c:v copy`, so audio processing does **not** re-encode the rendered video.

Failed capture, render, mux, or verification leaves an existing output untouched and removes private staging directories.

## Verification

Every MP4 is checked with ffprobe for:

- H.264 / `yuv420p`
- requested dimensions and FPS
- decoded frame count and timeline duration
- expected AAC audio presence

The `.verify.json` report also records the active pipeline, elapsed time, and Remotion settings when applicable.

## CI strategy

PR CI performs an apples-to-apples short benchmark of the legacy and Remotion engines on the same scene, resolution, FPS, CRF, and preset, then runs an SSIM visual-similarity gate. This gives measured timing evidence instead of assuming Remotion is faster.

Main/manual full regression exercises the Remotion 4K path and audio mux. The existing real-browser E2E suite continues to exercise the legacy capture path, including a short 4K fixture, frame/snapshot agreement, audio padding, failure cleanup, and output preservation.

Chromium and the isolated Remotion installation are cached independently.

## Main commands

```bash
npm run check
npm run test:e2e
npm run serve
npm run snap
npm run export:frames
npm run export:mp4
npm run render:ffmpeg
npm run render:remotion
npm run remotion:setup
```

## Main entry points

- `SKILL.md` — Motion Designer v3.9.4 integration/router and hard quality gates
- `runtime/` — motion, camera, Three.js, explainer, and audio helpers
- `scripts/export.mjs` — engine dispatcher
- `scripts/export-mp4.mjs` — deterministic Puppeteer → FFmpeg renderer
- `scripts/export-remotion.mjs` — concurrent Remotion OPENER bridge + audio mux + verification
- `remotion/src/index.js` — React/Remotion bridge around the existing OPENER scene
- `scripts/lib/verify.mjs` — shared media verification contract
- `.github/workflows/render-e2e.yml` — cross-engine benchmark and render QA

## Requirements

- Node.js 22+
- Python 3.12+ for the local server helper
- `ffmpeg` and `ffprobe` on `PATH`
- Chrome installed through Puppeteer or `PUPPETEER_EXECUTABLE_PATH`
- Optional Remotion engine: `npm run remotion:setup`

## License

See `THIRD_PARTY_LICENSES.md`. Remotion has its own license and eligibility requirements; review them before enabling the optional engine in organizational/commercial use.
