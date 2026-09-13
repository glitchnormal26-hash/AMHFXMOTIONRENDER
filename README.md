# AMHFXMOTIONRENDER

Production-oriented browser motion renderer using **Motion Designer v3.9.3** as a single integrated rulebook/runtime stack.

## Architecture

There is one active skill path:

`SKILL.md` → `skill-source/part-01.md` + `skill-source/part-02.md` → `references/` + `runtime/` + `scripts/`

The repository carries no parallel legacy skill tree and no project-specific render source on `main`. Older versions and retired project examples remain available through Git history.

`SKILL.md` maps the modular motion rules onto the compact reference/runtime modules already present in this repository.

## Generic render entry

`assets/starter.html` is the neutral OPENER-compatible smoke-test/starter scene used for generic renderer QA. The root `index.html` is only a lightweight launcher to that starter so the standard commands work without shipping a sample project.

## Motra Studio bridge

Motra Studio can hand standalone HTML/SVG/CSS/JavaScript scenes to this renderer without replacing repository source.

Save exported HTML as `motra-output/index.html`, then run:

```bash
npm ci
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

## Main entry points

- `SKILL.md` — Motion Designer v3.9.3 integration/router and hard quality gates
- `skill-source/` — canonical active rule source
- `references/camera-motion.md` — camera choreography and framing gate
- `references/anti-ppt.md` — continuity / anti-presentation verification
- `references/techniques.md` — kinetic and transition techniques
- `references/` — additional compact production guidance
- `runtime/` — motion, camera, Three.js, explainer, and audio helpers
- `scripts/export-mp4.mjs` — deterministic MP4 exporter
- `scripts/render-motra.mjs` — Motra Studio bridge
- `scripts/snap.mjs` — snapshot QA
- `assets/` — neutral starter architectures and allowed SFX assets
- `.github/workflows/render-e2e.yml` — project-agnostic render QA
- `MANAGE.md` — cleanup and repository ownership rules

## Runtime principles

Use DOM/SVG/GSAP first. Escalate to true 3D only when spatial geometry, camera, lighting, or post-processing materially improves communication.

Substantial motion must pass skill-usage, camera, composition, kinetic, and anti-PPT gates before `FINAL_VERIFIED`.

There are no voice-over rules. SFX are optional and may only use user-supplied files or repository files already present under `assets/`. If no suitable SFX asset exists, render without SFX.

`FINAL_VERIFIED` is reserved for media that has actually passed the relevant visual, timing, stream, composition, camera, kinetic, continuity, and audio checks.

## Requirements

- Node.js 22+
- Python 3.12+ for the local server helper
- `ffmpeg` and `ffprobe` on `PATH` for MP4 export

## License

See `THIRD_PARTY_LICENSES.md`.
