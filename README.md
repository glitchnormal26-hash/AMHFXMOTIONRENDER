# AMHFXMOTIONRENDER

Production-oriented browser motion renderer using **Motion Designer v3.9** as a single integrated rulebook/runtime stack.

## Motra Studio Web — idea to motion

This repository now includes a browser studio that sits on top of the existing deterministic renderer.

The workflow is:

`idea / creative brief → motion language → generated OPENER scene → live preview → save → fast/final MP4 render`

Start it locally:

```bash
npm ci
npm run studio
```

Then open:

```text
http://127.0.0.1:4173/studio/
```

The first web version deliberately keeps idea generation local and deterministic: it extracts a title, supporting copy, and visual keywords from the brief, then builds an editable GSAP scene that exposes the same `window.OPENER` contract used by the renderer. No external AI key is required. The generator can later be replaced by an AI provider without changing the preview/render contract.

Studio features:

- creative brief → motion concept generation
- Kinetic, Editorial, Neon, and Minimal motion languages
- 16:9, 9:16, and 1:1 outputs
- editable generated HTML source
- live browser preview
- save to `motra-output/index.html`
- asynchronous fast/final MP4 render jobs
- render log and MP4 download link
- remote write/render protection by default

For safety, the Studio server binds to `127.0.0.1` by default. If you intentionally expose it on a network, write/render APIs stay disabled unless `ALLOW_REMOTE_WRITE=1` is set. Public deployment should add authentication and process/container isolation before enabling remote rendering.

Optional server configuration:

```bash
PORT=4173 HOST=127.0.0.1 npm run studio
```

## Architecture

There is one active skill path:

`SKILL.md` → `skill-source/part-01.md` + `skill-source/part-02.md` → `references/` + `runtime/` + `scripts/`

The repository carries no parallel legacy skill tree and no project-specific render source on `main`. Older versions and retired project examples remain available through Git history.

`SKILL.md` maps the upstream v3.9 modular reference names onto the compact reference/runtime modules already present in this repository, avoiding duplicate compatibility files.

The Studio web layer is intentionally additive:

- `studio/index.html` — Motra Studio browser interface and deterministic idea-to-scene generator
- `scripts/studio-server.mjs` — local static/API server and render-job bridge
- `scripts/check-studio.mjs` — CI syntax validation for Studio inline JavaScript
- `scripts/export-mp4.mjs` — unchanged deterministic frame/MP4 engine used by Studio jobs

## Generic render entry

`assets/starter.html` is the neutral OPENER-compatible smoke-test/starter scene used for generic renderer QA. The root `index.html` remains a lightweight launcher to that starter so the standard renderer commands continue to work without shipping a sample project.

## Motra Studio bridge

The original file bridge remains supported. Motra Studio or another tool can hand standalone HTML/SVG/CSS/JavaScript scenes to this renderer without replacing repository source.

Save exported HTML as `motra-output/index.html`, then run:

```bash
npm ci
npm run render:motra
```

Use `QUALITY=fast npm run render:motra` for iteration or the default final-quality path for delivery.

## Main commands

```bash
npm run check
npm run studio
npm run serve
npm run snap
npm run export:frames
npm run export:mp4
npm run export:mp4:final
npm run render:motra
```

## Main entry points

- `studio/index.html` — idea-to-motion Studio UI
- `scripts/studio-server.mjs` — Studio web/render server
- `SKILL.md` — Motion Designer v3.9 integration/router and module map
- `skill-source/` — canonical v3.9 source
- `references/` — compact production guidance
- `runtime/` — motion, camera, Three.js, explainer, and audio helpers
- `scripts/export-mp4.mjs` — deterministic MP4 exporter
- `scripts/render-motra.mjs` — file-based Motra Studio bridge
- `scripts/snap.mjs` — snapshot QA
- `assets/` — neutral starter architectures
- `.github/workflows/render-e2e.yml` — project-agnostic render QA
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
