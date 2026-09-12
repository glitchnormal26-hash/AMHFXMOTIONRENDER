# Gift Box Deluxe Greenscreen Motion

A deterministic 2.5D chroma-key motion graphic built for the Motion Designer v3.9 browser renderer in this repository.

## Delivery spec

- Duration: 10.0 seconds
- Canvas: 3840 × 2160 (UHD 4K, 16:9)
- Frame rate: 30 fps
- Output: H.264 MP4, yuv420p
- Quality: CRF 14, medium preset
- Background: pure chroma green `#00FF00`
- Audio: silent asset (no audio stream required)
- Hero palette: berry-magenta / gold / blue / cyan / white; no green is used on the animated subject

## Motion idea

1. Gift box drops from above with weight, camera-equivalent settle, squash, and contact reaction.
2. Ribbon and bow pull outward with elastic anticipation while the lid trembles.
3. The box compresses, then the lid becomes the transition object and launches upward.
4. A key-safe graphic reveal disc, radial rays, stars, diamonds, confetti, and streamers burst from the box using authored deterministic trajectories.
5. The camera settles into a readable open-box pose while lid and bow complete their follow-through.
6. The lid anticipates upward and snaps closed; the body, bow, floor mark, and impact ring react to contact.
7. The box performs one compact asymmetric celebration tilt/bounce with spark punctuation.
8. The box compresses and pops away, leaving a clean green plate at the end.

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

Workflow: **Render E2E QA**

It renders automatically when the animation/render files change and can also be run manually with `workflow_dispatch`.

Artifact name: `motion-v3.9-e2e-qa`
