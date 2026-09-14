# AMHFXMOTIONRENDER

Production-oriented browser motion renderer using **Motion Designer v3.9.4** as a single integrated rulebook/runtime stack.

## Architecture

There is one active skill path:

`SKILL.md` → `skill-source/part-01.md` + `skill-source/part-02.md` → `references/` + `runtime/` + `scripts/`

`SKILL.md` maps the modular motion rules onto the compact reference/runtime modules already present in this repository.

## Generic render entry

`assets/starter.html` is the neutral OPENER-compatible smoke-test/starter scene used for generic renderer QA. The root `index.html` is only a lightweight launcher to that starter so the standard commands work without shipping a sample project.

## FFmpeg-first renderer

The production render path is browser frame capture followed by **FFmpeg** encoding/muxing and **ffprobe** verification. FFmpeg does not execute HTML/SVG/JavaScript itself, so Puppeteer remains the deterministic rasterization layer while FFmpeg is the only media encoder/muxer.

Render the root starter or set `INDEX` to any OPENER-compatible HTML scene:

```bash
npm ci
npm run render:ffmpeg
QUALITY=final npm run render:ffmpeg
INDEX=delivery/example/index.html OUT_VIDEO=output/example.mp4 npm run render:ffmpeg
```

Generated media belongs under `output/` (or another ignored local path) and must not be committed to `main`.

## Main commands

```bash
npm run check
npm run serve
npm run snap
npm run export:frames
npm run export:mp4
npm run export:mp4:final
npm run render:ffmpeg
npm run render:ffmpeg:final
```

## Main entry points

- `SKILL.md` — Motion Designer v3.9.4 integration/router and hard quality gates
- `skill-source/` — canonical active rule source
- `references/camera-motion.md` — camera choreography and framing gate
- `references/anti-ppt.md` — continuity / anti-presentation verification
- `references/techniques.md` — kinetic and transition techniques
- `references/failure-gates.md` — playback-first rejection gates
- `references/` — additional compact production guidance
- `runtime/` — motion, camera, Three.js, explainer, and audio helpers
- `scripts/export-mp4.mjs` — deterministic browser-capture + FFmpeg MP4 renderer
- `scripts/snap.mjs` — snapshot QA
- `assets/` — neutral starter architectures and allowed SFX assets
- `.github/workflows/qa.yml` — fast source/runtime QA
- `.github/workflows/render-e2e.yml` — project-agnostic FFmpeg render QA
- `MANAGE.md` — branch, cleanup, output, and repository ownership rules

## Runtime principles

Use DOM/SVG/GSAP first. Escalate to true 3D only when spatial geometry, camera, lighting, or post-processing materially improves communication.

Substantial motion must pass skill-usage, playback, camera, composition, kinetic, continuity, payoff, anti-PPT, and applicable audio gates before `FINAL_VERIFIED`.

There are no voice-over rules. SFX are optional and may only use user-supplied files or repository files already present under `assets/`. If no suitable SFX asset exists, render without SFX.

`FINAL_VERIFIED` is reserved for media that has actually passed the relevant visual, timing, stream, composition, camera, kinetic, continuity, and audio checks.

## Requirements

- Node.js 22+
- Python 3.12+ for the local server helper
- `ffmpeg` and `ffprobe` on `PATH` for MP4 export

## License

See `THIRD_PARTY_LICENSES.md`.
