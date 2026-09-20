# Ten cybersecurity chroma-key loops

Original SVG + GSAP scenes for AMHFXMOTIONRENDER. Each clip uses a distinct illustration and internal animation. The user explicitly requested micro-motion and negative space: the camera is intentionally locked and all typography/branding is absent.

Preview `scene.html?clip=1` through `?clip=10`. Use `OPENER.seek(seconds)` for deterministic inspection. The artwork is rasterized at native 3840×2160 during final capture.

## Render

Use Node 22+, FFmpeg and ffprobe. Install the repository dependencies with `npm ci`. The portable browser adapter additionally requires `npm install --no-save --package-lock=false @sparticuz/chromium`. On hosts with Chrome already installed, use the repository exporter directly and omit the adapter.

```bash
mkdir -p tmp output/cybersecurity
TMPDIR="$PWD/tmp" node project/cybersecurity/inspect.mjs
TMPDIR="$PWD/tmp" node project/cybersecurity/render-batch.mjs
```

The batch invokes the repository's `scripts/export-mp4.mjs` with three bounded workers. Rendering uses 30 fps, 300 frames, 4K, medium x264 preset, 16 Mbps target VBR and 20 Mbps ceiling. Sparse graphics can encode below the target bitrate without reduced dimensions or duplicated frames. Final files contain no audio stream.

The branch-local exporter adds optional VIDEO_BITRATE, VIDEO_MAXRATE, VIDEO_BUFSIZE and ENCODE_THREADS variables. With those variables unset, the repository's existing CRF behavior remains unchanged.

## Checks and limitations

`npm run check` passes. All ten compositions have five representative styleframes. Check actual exported files with `verify.py` for stream dimensions, duration, frame count, decoding errors, stationary green copyspace and non-identical output hashes.

Styleframe inspection and technical decoding are separate from normal-speed visual playback. The delivery manifest explicitly records whether that latter review has occurred. Technical reports do not constitute `FINAL_VERIFIED` creative approval.

All generated media and QA files stay under ignored `output/`. This project belongs on its render branch, not on `main`.
