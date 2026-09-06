# Roadmap — Motion Runtime Layer


This file tracks maintenance of the bundled implementation layer, not the main
Motion Designer direction.

## Preserve

- one evolving world rather than slide switching;
- deterministic timeline control;
- explicit camera/world ownership;
- directional motion blur when useful;
- key-frame screenshot verification;
- direct-open browser deliverables when requested;
- starter files as architecture, not style;
- reference deconstruction rather than visual cloning.

## Useful future improvements

1. Offline audio analysis cache for deterministic VO/SFX workflows.
2. More transition examples based on semantic material transformation.
3. Multi-file and single-file starter variants.
4. Contact-sheet generation after snapshot capture.
5. WebCodecs export path in addition to PNG+ffmpeg.
6. More examples for R3F camera contracts and subject tracking.
7. More anti-PPT rejected→corrected pairs.
8. Vertical 9:16 starter presets that preserve safe areas.
9. Automated contrast / overflow / clipping checks.
10. Deterministic shader-gradient parameter capture.

## Maintenance rule

New effects should only enter the bundle when they solve a recurring design or
production failure. Do not turn the bundle into an effect catalog.

The main `SKILL.md` is authoritative for taste, hierarchy, retention,
sound policy, cinematic intensity, and 2D/2.5D/3D choice.
