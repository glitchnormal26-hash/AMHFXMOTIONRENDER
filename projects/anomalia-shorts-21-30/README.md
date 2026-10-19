# ANOMALIA Files 021–030 — Cerita Mistis Nusantara

Ten vertical Indonesian analog-horror Shorts inspired by mystical stories, urban legends, and cryptid lore that circulate across regions of Indonesia.

## Editorial treatment

- Every episode is a **fictional dramatization**, not a claim that the depicted event occurred.
- The circulating legend and its associated region are named, while named protagonists, incidents, evidence, dialogue, and endings are original fiction.
- Cultural traditions are treated as folklore inspiration rather than mocked, reenacted as ritual instructions, or presented as verified fact.
- Natural conversational Indonesian with a clear setup → trigger → escalation → reveal → payoff structure.
- Seven story scenes from six dedicated cinematic plates per episode; overlays support the footage instead of replacing it.
- Restrained handheld movement, motivated reframing, crossfade handoffs, evidence labels, analog texture, kinetic captions, and `ANOMALIA` branding.
- Every video is visibly labeled `FIKSI • ANALOG HORROR`.

## Episodes

| File | Story inspiration | Region |
|---|---|---|
| 021 | Orang Pendek | Kerinci, Jambi |
| 022 | Begu Ganjang | Sumatra Utara |
| 023 | Palasik | Sumatra Barat |
| 024 | Lampor | Yogyakarta |
| 025 | Ahool | Gunung Salak, Jawa Barat |
| 026 | Saranjana | Kotabaru, Kalimantan Selatan |
| 027 | Kuyang | Kalimantan Timur |
| 028 | Leak | Bali |
| 029 | Ebu Gogo | Flores, Nusa Tenggara Timur |
| 030 | Parakang | Sulawesi Selatan |

## Render

```bash
npm run render:anomalia-legends
DECODE=1 npm run verify:anomalia-legends
```

Environment controls:

```bash
START_ID=21 END_ID=30 RENDER_CONCURRENCY=2 FORCE=1 npm run render:anomalia-legends
```

Final MP4s are written to `output/anomalia-shorts-21-30/videos/` at 1080×1920, 24 fps, H.264/AAC. Technical verification JSON is written beside each video.
