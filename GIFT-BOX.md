# Gift Box Greenscreen Motion

A deterministic chroma-key motion graphic built for the Motion Designer v3.8 browser renderer in this repository.

## Delivery spec

- Duration: 10.0 seconds
- Canvas: 3840 × 2160 (UHD 4K, 16:9)
- Frame rate: 30 fps
- Output: H.264 MP4, yuv420p
- Quality: CRF 14, medium preset
- Background: pure chroma green `#00FF00`
- Audio: silent asset (no audio stream required)
- Hero palette: magenta / gold / blue / white; no green is used on the animated subject

## Motion idea

1. Gift box drops from above with weight and a short squash/bounce.
2. Bow reacts after impact and creates anticipation.
3. Lid trembles, dips, then opens with a fast upward handoff.
4. Gold reveal energy and deterministic stars/confetti burst from the box.
5. Open-box pose breathes briefly so the effect remains readable.
6. Lid anticipates and snaps closed; the body reacts to contact.
7. Box performs one compact celebration tilt/bounce.
8. Box compresses and pops away, leaving a clean green plate at the end.

## Preview

```bash
npm install
python scripts/serve.py
```

Open the root `index.html` through the local server. Add `?debug=1` for scrub controls.

## Render locally

Requires `ffmpeg` and `ffprobe` on `PATH`.

```bash
npm install
npm run render:gift-box
```

Output:

- `output/gift-box-greenscreen-4k.mp4`
- `output/gift-box-greenscreen-4k.verify.json`

## GitHub Actions

Workflow: **Render Gift Box 4K Greenscreen**

It renders automatically when the animation/render files change and can also be run manually with `workflow_dispatch`.

Artifact name: `gift-box-greenscreen-4k`
