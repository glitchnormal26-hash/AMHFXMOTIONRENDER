# Anomali Files — 10 YouTube Shorts

A deterministic Canvas motion series for vertical 9:16 analog-horror shorts. Each film uses a distinct procedural scene, an authored camera path, a persistent dossier overlay, TikTok-style captions, and Indonesian voice-over.

## Stories

1. Lorong 03:13
2. Tombol Lantai 0
3. Voice Note dari Besok
4. Frekuensi Merah
5. Bayangan Terlambat
6. Kamar 404
7. Stasiun Tanpa Nama
8. Bulan Berkedip
9. Foto Kontak Ibu
10. Kamu Sudah Dilihat

All stories are original fiction. Every render visibly carries `FIKSI • ANALOG HORROR`.

## Render

Voice-over files are expected at `output/anomali-shorts/audio/NN-slug.mp3`.

```bash
# Preview
RENDER_MODE=preview START_ID=1 END_ID=1 node projects/anomali-shorts/render-all.mjs

# Final 1080×1920, 24 fps
RENDER_MODE=final RENDER_CONCURRENCY=2 node projects/anomali-shorts/render-all.mjs
```

The batch runner evaluates the same seekable Canvas scene with `@napi-rs/canvas`, streams deterministic JPEG frames into FFmpeg, and muxes the Indonesian voice-over. Browser snapshots use Puppeteer for visual QA. Final files are written to `output/anomali-shorts/videos/` with a technical verification report beside every MP4.

## Art direction

- charcoal surveillance / analog dossier world;
- one accent hue per file;
- high-contrast caption safe lane;
- organic custom silhouettes and layered device materials;
- camera push, tracking, reframe, and settle states;
- visual escalation from evidence → anomaly → reveal → retention CTA;
- no stock footage, no scraped imagery, no copyrighted music, no generated SFX.

## Delivery metadata

`UPLOAD-GUIDE.csv` contains the title, description, hashtag set, and suggested WIB schedule for each film. `README-FIRST.txt` is the audience-facing handoff note placed beside the videos in Drive.
