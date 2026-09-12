# 10 Cute Autumn Backgrounds — Three.js / AMHFX Motion Render

Ten individual 16:9 Three.js HTML scenes, each authored as a deterministic 30-second loop with intentional copyspace, no text, and no audio.

## Delivery contract

- 1920x1080
- 30 fps
- 30 seconds
- H.264 / yuv420p MP4 export
- deterministic `window.OPENER.seek(t)` entry point
- `window.OPENER.DURATION = 30`
- seeded setup randomness only; no render-time random numbers or accumulating physics

## Scenes

01 Maple Frame; 02 Pumpkin Patch; 03 Fox Nap; 04 Acorn Rain; 05 Cozy Picnic; 06 Leaf Balloon Parade; 07 Tiny Cabin; 08 Squirrel Harvest; 09 Mushroom Garden; 10 Autumn Pond.

## AMHFX export example

```bash
INDEX=delivery/autumn-cute-10/01-maple-frame.html FPS=30 WIDTH=1920 HEIGHT=1080 QUALITY=fast CRF=16 PRESET=medium OUT_VIDEO=output/01-maple-frame.mp4 npm run export:mp4
```

The GitHub Actions delivery workflow renders all ten scenes in parallel, verifies H.264 / 1920x1080 / 30fps / 30s with the AMHFX ffprobe report, and uploads MP4 plus QA snapshots as artifacts.