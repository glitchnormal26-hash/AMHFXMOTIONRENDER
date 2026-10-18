# ANOMALIA Hybrid Found-Footage Remaster

Remake of Anomali Files 003–010 using a six-shot hybrid pipeline:

1. cinematic raster hook;
2. establishing handheld shot;
3. macro evidence inspection;
4. escalation insert;
5. anomaly reveal;
6. payoff / CTA.

AI-generated 9:16 raster plates are combined with deterministic Canvas camera moves, analog texture, kinetic captions, surveillance UI, and story-specific procedural effects. The videos keep the existing Indonesian voice-over and are branded `ANOMALIA` / `@ANOMALIA`.

## Render

```bash
START_ID=3 END_ID=10 RENDER_CONCURRENCY=2 node projects/anomali-shorts-v2/render-all.mjs
DECODE=1 node projects/anomali-shorts-v2/verify-delivery.mjs
```

Outputs are written to `output/anomali-shorts-v2/videos/`. Every file includes a technical verification JSON beside the MP4.

All stories are original fiction and carry an on-screen `FIKSI • ANALOG HORROR` label.
