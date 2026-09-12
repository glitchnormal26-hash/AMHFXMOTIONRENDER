# AMHFXMOTIONRENDER

Production-oriented browser motion renderer using **Motion Designer v3.9** as a single integrated rulebook/runtime stack.

## Architecture

There is one active skill path:

`SKILL.md` → `skill-source/part-01.md` + `skill-source/part-02.md` → `references/` + `runtime/` + `scripts/`

The repository no longer carries a parallel v3.8 source tree, manifest, or build-only reconstruction path. Older versions remain available through Git history.

`SKILL.md` also maps the upstream v3.9 modular reference names onto the compact reference/runtime modules already present in this repository, avoiding duplicate compatibility files.

## Motra Studio bridge

Motra Studio can hand standalone HTML/SVG/CSS/JavaScript scenes to this renderer without replacing the root scene.

Save exported HTML as `motra-output/index.html`, then run:

```bash
npm install
npm run render:motra
```

Use `QUALITY=fast npm run render:motra` for iteration or the default final-quality path for delivery.

## Main commands

```bash
npm run check
npm run serve
npm run snap
npm run export:frames
npm run export:mp4
npm run export:mp4:final
npm run render:motra
```

A dedicated gift-box example remains available through `npm run render:gift-box`.

## Main entry points

- `SKILL.md` — Motion Designer v3.9 integration/router and module map
- `skill-source/` — canonical v3.9 source
- `references/` — compact production guidance
- `runtime/` — motion, camera, Three.js, explainer, and audio helpers
- `scripts/export-mp4.mjs` — deterministic MP4 exporter
- `scripts/render-motra.mjs` — Motra Studio bridge
- `scripts/snap.mjs` — snapshot QA
- `assets/` — starter architectures
- `MANAGE.md` — cleanup and repository ownership rules

## Runtime principles

Use DOM/SVG/GSAP first. Escalate to true 3D only when spatial geometry, camera, lighting, or post-processing materially improves communication.

Explainers default to **VOICEOVER + purposeful SFX + controlled ambience + silence — NO BGM** unless the brief explicitly requests music.

`FINAL_VERIFIED` is reserved for media that has actually passed the relevant visual, timing, stream, and audio checks.

## Requirements

- Node.js 22+
- Python 3.12+ for the local server helper
- `ffmpeg` and `ffprobe` on `PATH` for MP4 export

## License

See `THIRD_PARTY_LICENSES.md`.
