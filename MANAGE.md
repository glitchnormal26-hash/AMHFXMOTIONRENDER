# Repository management

This file defines the safe maintenance rules for AMHFXMOTIONRENDER.

## Version status

- **Intended motion skill:** Motion Designer v3.9.
- **Imported v3.9 core source:** `skill-source-v3.9.1/`.
- **Legacy compatibility source:** `skill-source/part-01.md` through `skill-source/part-21.md`.
- **Legacy integrity manifest:** `skill-source/manifest.json`.
- **Legacy compatibility router:** `SKILL.md`.

The v3.8 tree remains connected because the existing deterministic integrity/build path still targets it. It is migration infrastructure, not the intended skill generation.

The v3.9 source must be preserved while migration is completed. Its source currently references specialized modules such as camera/spatial, kinetic typography, audio/VO, transitions, SaaS/composition, browser runtime, explainer, and QA/export guidance; do not claim the v3.9 production migration is complete until those required modules and integrity wiring are present.

## Source-management rules

1. Do not delete `skill-source-v3.9.1/` during routine cleanup.
2. Do not mix v3.8 and v3.9 source fragments into one reconstructed rulebook.
3. Keep the legacy `skill-source/manifest.json` synchronized with v3.8 for as long as the compatibility build remains enabled.
4. Keep `SKILL.md`, `AGENTS.md`, `README.md`, `package.json`, and build/check workflows explicit about whether they refer to the v3.9 target or the v3.8 compatibility path.
5. Promote v3.9 into the active deterministic build only after its required source/references, integrity metadata, routing, and QA are complete.
6. Do not claim `FINAL_VERIFIED` for rendered media based only on source integrity or syntax checks.

## v3.9 migration checklist

Before removing the v3.8 compatibility path:

- complete the v3.9 source inventory;
- add all reference modules required by the v3.9 router;
- add a v3.9 integrity manifest or equivalent deterministic source check;
- update the build script to target v3.9 explicitly;
- replace or update `SKILL.md` routing for v3.9;
- update `AGENTS.md`, `README.md`, `package.json`, changelog/version notes, and `RESOURCE-MANIFEST.json` as applicable;
- run `npm run check`;
- render representative output and perform visual/audio QA;
- only then remove obsolete v3.8 compatibility files.

## Render-file ownership

- `index.html` is the repository's root scene.
- `motra-output/index.html` is the Motra Studio handoff scene used by `npm run render:motra`.
- `dist/`, `output/`, and `frames/` are generated working/output directories and are intentionally ignored by Git.
- Rendered media such as MP4, MOV, WebM, WAV, MP3, M4A, and AAC files are ignored by Git and should be treated as generated deliverables unless there is an explicit reason to version them elsewhere.
- Preserve `motra-output/README.md`; do not treat the whole `motra-output/` directory as disposable.

## Safe cleanup policy

A cleanup should remove generated artifacts and caches, not authored source. Safe cleanup targets are the ignored generated directories/files listed above plus ordinary local caches such as `node_modules/`, Python bytecode, and OS metadata.

Do **not** delete or rewrite these during routine cleanup:

- `skill-source-v3.9.1/`;
- `skill-source/` while the v3.8 compatibility build remains enabled;
- `runtime/`;
- `scripts/`;
- `assets/`;
- `references/`;
- `.github/workflows/`;
- `index.html`;
- `motra-output/README.md`;
- any user-provided `motra-output/index.html` that is still needed for a render.

## Required verification after maintenance

For source, runtime, script, or routing changes, run:

```bash
npm run check
```

For render/export changes, also run the relevant render path and inspect the resulting media. Syntax and integrity checks alone do not verify visual or audio quality.
