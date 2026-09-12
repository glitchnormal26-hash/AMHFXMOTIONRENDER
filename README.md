# AMHFXMOTIONRENDER

Production-oriented motion rendering runtime targeting **Motion Designer v3.9**.

## Version status

**Motion Designer v3.9 is the intended motion skill.** The imported v3.9 core source is preserved under `skill-source-v3.9.1/`.

The repository still carries a legacy v3.8 compatibility/build path in `SKILL.md`, `skill-source/`, `skill-source/manifest.json`, and `npm run build:skill`. That path remains useful for deterministic integrity checks while the v3.9 source package, reference modules, routing, integrity metadata, and QA wiring are completed. It should not be interpreted as the intended skill generation.

See `MANAGE.md` for cleanup and version-migration rules.

## Motra Studio bridge

Prompt-to-motion web studio: https://motra-studio-d13ehp.v2.appdeploy.ai/

Motra Studio generates standalone HTML/SVG/CSS/JavaScript scenes and hands them to this repository for deterministic MP4 rendering without replacing the repository's existing root scene.

```bash
# Save the HTML downloaded from Motra Studio as:
# motra-output/index.html
npm install
npm run render:motra
```

`render:motra` defaults to final quality and passes `motra-output/index.html` to the existing exporter through its `INDEX` input. Override either value when needed, for example `QUALITY=fast npm run render:motra` or `INDEX=/absolute/path/custom.html npm run render:motra`.

## Capabilities

- deterministic GSAP timeline motion;
- DOM / SVG / 2.5D continuous-world animation;
- selective Three.js full runtime with bloom/post-processing;
- natural voiceover workflow;
- hi-tech explainer SFX with no-BGM default;
- browser snapshot QA;
- direct deterministic MP4 export with Puppeteer + ffmpeg + ffprobe;
- `LITE_RUNTIME` and `FULL_RUNTIME` engine selection.

## Main entry points

- `skill-source-v3.9.1/` — imported Motion Designer v3.9 core source being wired into production
- `SKILL.md` — current legacy v3.8 compatibility router
- `MANAGE.md` — cleanup, version migration, and render-file ownership rules
- `assets/starter.html` — lightweight starter
- `assets/starter-full-runtime.html` — full runtime starter
- `runtime/` — reusable motion, camera, Three.js, explainer and audio modules
- `scripts/export-mp4.mjs` — one-command direct MP4 exporter
- `scripts/render-motra.mjs` — Motra Studio HTML bridge
- `scripts/snap.mjs` — deterministic snapshot QA
- `scripts/serve.py` — local no-cache server
- `references/` — detailed production guidance

## Skill connection and integrity

The current integrity builder still reconstructs the legacy v3.8 source:

```bash
npm run build:skill
```

The output is `dist/SKILL.md`. `npm run check` runs syntax checks plus this legacy integrity gate. The v3.9 migration is complete only after its own source inventory, required reference modules, integrity metadata, routing, and QA path are connected.

## Setup

```bash
npm install
```

`ffmpeg` and `ffprobe` must also be available on `PATH` for final MP4 export.

## Preview

```bash
python scripts/serve.py
```

## Export MP4

Fast path:

```bash
QUALITY=fast node scripts/export-mp4.mjs
```

Final-quality path:

```bash
QUALITY=final node scripts/export-mp4.mjs
```

Narrated explainer guard:

```bash
REQUIRE_VO=1 QUALITY=fast node scripts/export-mp4.mjs
```

## Explainer audio default

**VOICEOVER + HI-TECH SFX + CONTROLLED TECH AMBIENCE + SILENCE — NO BGM**

A narrated explainer is not `FINAL_VERIFIED` unless the actual MP4 contains the required audio stream.

## Runtime selection

Use `LITE_RUNTIME` when DOM/SVG/GSAP is sufficient.

Escalate to `FULL_RUNTIME` only when true 3D, state-driven WebGL, post-processing,
or the full continuous-world helper stack materially improves the result.

## License

See `THIRD_PARTY_LICENSES.md` for required third-party notices.
