# AMHFXMOTIONRENDER

Production-oriented browser motion renderer using **Motion Designer v3.9** as a single integrated rulebook/runtime stack.

## Architecture

There is one active skill path:

`SKILL.md` → `skill-source/part-01.md` + `skill-source/part-02.md` → `references/` + `runtime/` + `scripts/`

The repository carries no parallel legacy skill tree and no project-specific render source on `main`. Older versions and retired project examples remain available through Git history.

`SKILL.md` maps the upstream v3.9 modular reference names onto the compact reference/runtime modules already present in this repository, avoiding duplicate compatibility files.

## Generic render entry

`assets/starter.html` is the neutral OPENER-compatible smoke-test/starter scene used for generic renderer QA. The root `index.html` is only a lightweight launcher to that starter so the standard commands work without shipping a sample project.

`assets/starter-saas-glass.html` is a generic SaaS architecture example for modern product-launch work. It demonstrates deterministic shader-style gradient motion, selective frosted glass, an original local liquid/chrome SVG logo treatment, and camera-led product traversal without adding hard third-party dependencies.

## Local clip planning

Use the deterministic local matcher when a brief needs a starting architecture:

```bash
npm run clip:plan -- --brief "SaaS launch with aurora gradient, frosted glass and liquid logo"
```

The planner selects a local starter, recommends optional visual capabilities when relevant, and prints the prepare/preview/render handoff. It does not claim hosted template availability.

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
npm run clip:plan -- --brief "..."
npm run serve
npm run snap
npm run export:frames
npm run export:mp4
npm run export:mp4:final
npm run render:motra
```

## Main entry points

- `SKILL.md` — Motion Designer v3.9 integration/router and module map
- `skill-source/` — canonical v3.9 source
- `references/clip-workflow.md` — local find → customize → preview/render workflow
- `references/external-visuals.md` — optional gradient, glass, and liquid-logo integration boundaries
- `runtime/` — motion, camera, Three.js, explainer, and audio helpers
- `scripts/clip-plan.mjs` — deterministic local starter/effect matcher
- `scripts/export-mp4.mjs` — deterministic MP4 exporter
- `scripts/render-motra.mjs` — Motra Studio bridge
- `scripts/snap.mjs` — snapshot QA
- `assets/` — neutral and reusable starter architectures
- `.github/workflows/render-e2e.yml` — project-agnostic render QA, including SaaS starter smoke coverage
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
