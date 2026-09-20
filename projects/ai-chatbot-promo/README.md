# Ten AI chatbot dashboard promos

Ten distinct brand-free 12-second UI motion concepts. Authoring coordinates: 1920×1080. Final native vector capture: 3840×2160 at 30 fps. English functional UI copy except the multilingual demonstration. Silent, with no stock or synthesized audio.

See DIRECTION.md for the concept list, reference principles, and action/camera choreography.

## Render

Install the repository's locked dependencies with `npm ci`. The canonical renderer is `scripts/export-mp4.mjs`. Render a single concept:

```bash
URL="file://$PWD/projects/ai-chatbot-promo/scene.html?concept=1" \
WIDTH=3840 HEIGHT=2160 FPS=30 QUALITY=final CRF=18 PRESET=medium \
VIDEO_BITRATE=12M VIDEO_MAXRATE=18M VIDEO_BUFSIZE=24M \
OUT_VIDEO=output/chatbot/01-instant-support.mp4 \
node scripts/export-mp4.mjs
```

Concept ids are 1–10. `render-batch.mjs` renders two concepts concurrently through the host Chromium adapter. It requires a prepared `TMPDIR` and @sparticuz/chromium, installed as a development dependency on this production branch.

`qa.mjs` captures five representative times per composition. `?play=1` plays the source at normal speed in a browser; `OPENER.seek(seconds)` is the deterministic capture contract. Authored camera and viewport fit are separate transforms.

The bounded VBR settings use CRF 18, nominal 12 Mbps and maximum 18 Mbps, with a 24 Mbit buffer. Simple UI footage may encode below the nominal rate. Every video has 360 frames and no audio stream. Metrics and people are fictional demonstration content.

## Verification scope

Source checks, representative rendered-frame inspection, native 4K encoded-frame inspection, and stream/decode checks are recorded with the deliverables. Actual continuous human playback review is not implied by contact sheets or technical verification. The renderer reports TECHNICAL_VERIFIED; FINAL_VERIFIED is reserved for both creative playback approval and technical verification under the repository policy.

Generated media and review images remain in ignored output paths, not Git history. This one-off production is intentionally kept on a render branch and does not change main.
