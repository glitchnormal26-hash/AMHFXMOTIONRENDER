---
name: amhfxmotionrender
description: Motion Designer v3.9 unified browser-motion skill for authored animation, kinetic typography, explainers, deterministic capture, and MP4 export.
---

# Motion Designer v3.9 — Unified Integration

This repository has one active motion-skill integration: **Motion Designer v3.9**.

## Canonical source

Load these files in order as one continuous rulebook:

1. `skill-source/part-01.md`
2. `skill-source/part-02.md`

Do not load or reconstruct any v3.8 rulebook. Git history preserves retired versions if they are ever needed for archaeology.

## Repository module map

The imported v3.9 source names upstream modular references. This compact repository intentionally maps those concepts onto the existing production modules instead of duplicating files:

- camera / spatial / 3D → `references/full-runtime.md`, `references/architecture.md`, `runtime/camera-rig.js`, `runtime/three-scene.js`
- kinetic typography / anti-PPT → `references/techniques.md`, `references/anti-ppt.md`
- audio / VO → `references/explainer.md`, `runtime/audio-runtime.js`
- visual transitions → `references/techniques.md`, `references/architecture.md`
- SaaS / composition / brand → `references/architecture.md`, `references/anti-ppt.md`
- browser runtime → `references/full-runtime.md`, `runtime/`, `scripts/`
- explainer → `references/explainer.md`, `runtime/explainer-helpers.js`
- QA / export → `scripts/snap.mjs`, `scripts/export-frames.mjs`, `scripts/export-mp4.mjs`

When an upstream reference filename appears in the v3.9 source but is not present locally, use this mapping rather than creating a duplicate compatibility file.

## Production contract

- one evolving visual world; avoid slide/presentation choreography;
- use the simplest capable runtime: DOM/SVG/GSAP first, true 3D only when it adds meaning;
- camera intent must produce visible framing/world transforms or be explicitly locked for a reason;
- explainers default to VO + purposeful SFX + controlled ambience + silence, with no BGM unless requested;
- user-supplied VO is timing authority; otherwise measure generated VO before timing lock;
- use `scripts/export-mp4.mjs` for deterministic H.264 export and ffprobe verification;
- `FINAL_VERIFIED` requires actual visual/audio QA, not syntax checks alone;
- starters are architecture references, never visual templates.

## Verification

Run:

```bash
npm run check
```

The check validates the canonical v3.9 source files plus all active JavaScript runtime/render entry points.
