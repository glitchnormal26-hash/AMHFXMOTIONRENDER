# 4K Green-Screen Analytics Motion Pack

Five individual 10-second analytics dashboard animations with a Three.js presentation path and deterministic Canvas fallback.

- 01 Growth Command Center
- 02 Conversion Funnel
- 03 Revenue Matrix
- 04 Cohort Retention
- 05 Live Operations Pulse

Chroma background: `#00FF00`. Dashboard accents intentionally avoid green hues.

Example export:

```bash
INDEX=assets/analytics-green/01-growth-command-center.html OUT_VIDEO=output/01-growth-command-center-4k.mp4 WIDTH=3840 HEIGHT=2160 FPS=30 CRF=16 PRESET=medium node scripts/export-mp4.mjs
```

Each entry exposes `window.OPENER.DURATION=10` and deterministic `window.OPENER.seek(t)`.
