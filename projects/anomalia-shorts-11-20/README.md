# ANOMALIA Files 011–020

Ten vertical Indonesian analog-horror Shorts built around clearer, conversational storytelling and scene-specific visual progression.

## Creative direction

- Natural spoken Indonesian instead of report-like fragments.
- Every episode follows a legible setup → trigger → escalation → reveal → payoff structure.
- Seven distinct scene states per video, with relevant generated raster plates and story-specific evidence/reveal compositions.
- Handheld camera motion, reframing, surveillance UI, analog texture, transitions, kinetic captions, and `ANOMALIA` branding.
- Every story is original fiction and visibly labeled `FIKSI • ANALOG HORROR`.

## Render

```bash
npm run render:anomalia-next
DECODE=1 npm run verify:anomalia-next
```

Environment controls:

```bash
START_ID=11 END_ID=20 RENDER_CONCURRENCY=2 FORCE=1 npm run render:anomalia-next
```

Final MP4s are written to `output/anomalia-shorts-11-20/videos/` at 1080×1920, 24 fps, H.264/AAC. Technical verification JSON is written beside each video.
