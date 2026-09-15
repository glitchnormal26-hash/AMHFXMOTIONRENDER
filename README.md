# AMHFXMOTIONRENDER

Production-oriented browser motion renderer using **Motion Designer v3.9.4** as a single integrated rulebook/runtime stack, with task-specific art-direction profiles layered onto the same active skill path.

## Architecture

There is one active skill path:

`SKILL.md` → `skill-source/part-01.md` + `skill-source/part-02.md` → `references/` + `runtime/` + `scripts/`

`SKILL.md` maps the modular motion rules onto the compact reference/runtime modules already present in this repository. Task-specific profiles do not create parallel skills; they refine the shared camera, composition, visual-quality, continuity, runtime, and verification rules.

## SaaS explainer profile

For SaaS/product motion explainers, use:

`references/saas-motion-explainer-direction.md` + `references/explainer.md` + `references/camera-motion.md` + `references/camera-movement.md`

The SaaS direction module governs palette, typography, surface language, scene vocabulary, layout, depth, beat pacing, and anti-template checks. The camera modules govern framing, movement signatures, follow/tracking, `lookAt` behavior, speed ramps, and readable landings.

`assets/starter-saas-explainer.html` demonstrates the integration with a fixed 1920×1080 stage, separate viewport-fit and authored camera transforms, one named palette, fragment typography, layered depth, staggered feature beats, readable holds, and multiple framing states. It is an architecture reference, **not** a reusable finished visual template.

## Generic render entry

`assets/starter.html` is the neutral OPENER-compatible smoke-test/starter scene used for generic renderer QA. The root `index.html` is only a lightweight launcher to that starter so the standard commands work without shipping a sample project.

This repository intentionally keeps project-specific video productions out of `main`. Build one-off scenes on a temporary branch or in a separate project repository and point `INDEX` at that scene when rendering.

## Creative + technical production verification

A technically valid MP4 is not automatically a creatively approved motion piece. Substantial final work now uses two independent verification states:

- `TECHNICAL_VERIFIED` — deterministic capture, requested dimensions/FPS, codec/stream verification, duration, and required audio presence when applicable.
- `CREATIVE_VERIFIED` — styleframes, proof-of-motion, authored camera energy, hero authority, continuity material, anti-PPT, still-frame quality, art direction, payoff, and other creative gates were explicitly reviewed.

Only both passing may produce `FINAL_VERIFIED`.

Before an expensive final render:

1. Create a production manifest from `references/production-manifest.example.json`.
2. Inspect at least five representative styleframes.
3. Prove the hardest 8+ second motion/transition section.
4. Run the creative checker.
5. Use the production renderer, which blocks rendering when creative verification fails.

```bash
MANIFEST=project/production-manifest.json npm run check:creative

MANIFEST=project/production-manifest.json \
INDEX=project/scene.html \
OUT_VIDEO=output/final.mp4 \
QUALITY=final \
npm run render:production
```

The production renderer first runs creative verification, then renders the MP4, normalizes technical verification to `DRAFT + TECHNICAL_VERIFIED`, and finally combines the technical and creative reports. See `references/production-verification.md`.

Direct `render:ffmpeg` / `export:mp4` commands remain useful for smoke tests, previews, and technical diagnostics. A successful direct encode must not be treated as creative approval for substantial final delivery.

## FFmpeg-first renderer

The production render path is browser frame capture followed by **FFmpeg** encoding/muxing and **ffprobe** verification. FFmpeg does not execute HTML/SVG/JavaScript itself, so Puppeteer remains the deterministic rasterization layer while FFmpeg is the only media encoder/muxer.

Render the root starter or set `INDEX` to another OPENER-compatible HTML scene:

```bash
npm ci
npm run render:ffmpeg
QUALITY=final npm run render:ffmpeg
INDEX=assets/starter-full-runtime.html OUT_VIDEO=output/example.mp4 npm run render:ffmpeg
INDEX=assets/starter-saas-explainer.html OUT_VIDEO=output/saas-profile.mp4 npm run render:ffmpeg
```

Generated media belongs under `output/` (or another ignored local path) and must not be committed to `main`.

## Main commands

```bash
npm run check
npm run check:creative -- path/to/production-manifest.json
npm run serve
npm run snap
npm run export:frames
npm run export:mp4
npm run export:mp4:final
npm run render:ffmpeg
npm run render:ffmpeg:final
MANIFEST=path/to/production-manifest.json npm run render:production
npm run verify:final -- technical.verify.json creative.verify.json
```

## Main entry points

- `SKILL.md` — Motion Designer v3.9.4 integration/router and hard quality gates
- `skill-source/` — canonical active rule source
- `references/camera-motion.md` — camera choreography, framing, continuity, follow, and speed-ramp gate
- `references/camera-movement.md` — concrete Three.js + GSAP camera move vocabulary, easing/timing, `lookAt` synchronization, follow damping, loop motion, and chroma-key constraints
- `references/saas-motion-explainer-direction.md` — SaaS-specific palette/type/surface/layout/shot/pacing profile and `SAAS_DIRECTION_GATE`
- `references/explainer.md` — continuous visual argument and explainer routing
- `references/visual-quality.md` — global still-frame, material, depth, art-direction, and anti-primitive quality gates
- `references/anti-ppt.md` — continuity / anti-presentation verification
- `references/techniques.md` — kinetic and transition techniques
- `references/failure-gates.md` — playback-first rejection gates
- `references/production-verification.md` — mandatory creative + technical finalization workflow
- `references/production-manifest.example.json` — production-plan/styleframe/proof-of-motion manifest example
- `runtime/` — motion, camera, Three.js, explainer, and audio helpers
- `scripts/check-creative-gates.mjs` — blocking creative-manifest verifier
- `scripts/render-production.mjs` — official substantial/final render entry with creative gate first
- `scripts/finalize-verification.mjs` — combines creative and technical reports into final status
- `scripts/export-mp4.mjs` — deterministic browser-capture + FFmpeg MP4 renderer
- `scripts/snap.mjs` — snapshot QA
- `assets/starter-saas-explainer.html` — SaaS direction + camera integration starter
- `assets/` — neutral starter architectures and allowed SFX assets
- `.github/workflows/qa.yml` — source/runtime/creative-verification QA and repository hygiene
- `.github/workflows/render-e2e.yml` — project-agnostic FFmpeg render QA
- `MANAGE.md` — branch, cleanup, output, and repository ownership rules

## Runtime principles

Use DOM/SVG/GSAP first. Escalate to true 3D only when spatial geometry, camera, lighting, or post-processing materially improves communication.

Substantial motion must pass skill-usage, playback, camera, composition, kinetic, continuity, payoff, anti-PPT, global visual-quality, and applicable audio gates before `CREATIVE_VERIFIED`. Technical capture/stream verification must separately pass before `TECHNICAL_VERIFIED`. Only the combination is `FINAL_VERIFIED`. SaaS-profile work must also pass `SAAS_DIRECTION_GATE`.

The global anti-primitive gate rejects default/tutorial geometry and symbolic primitive shortcuts. The SaaS profile may use simple abstract forms when they are intentionally art-directed graphic elements rather than raw defaults or real-world stand-ins.

There are no voice-over rules. SFX are optional and may only use user-supplied files or repository files already present under `assets/`. If no suitable SFX asset exists, render without SFX.

`FINAL_VERIFIED` is reserved for media that has actually passed both creative and technical verification. Successful encoding alone is not final approval.

## Requirements

- Node.js 22+
- Python 3.12+ for the local server helper
- `ffmpeg` and `ffprobe` on `PATH` for MP4 export

## License

See `THIRD_PARTY_LICENSES.md`.
