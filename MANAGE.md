# Repository management

This file defines the safe maintenance rules for AMHFXMOTIONRENDER.

## Version status

- **Active production skill:** Motion Designer v3.8 Full Runtime.
- **Active source:** `skill-source/part-01.md` through `skill-source/part-21.md`.
- **Active integrity manifest:** `skill-source/manifest.json`.
- **Active router:** `SKILL.md`.
- **Staged next-version source:** `skill-source-v3.9.1/`.
- The staged v3.9.1 tree is **not active** and must not replace v3.8 until the source package is complete, internally consistent, and has its own integrity/build path.

At the time this management file was added, the staged v3.9.1 tree contains only `part-01.md` and `part-02.md`. Treat it as an import/staging area, not as the renderer's production rulebook.

## Source-management rules

1. Do not mix files from `skill-source/` and `skill-source-v3.9.1/` into one reconstructed skill.
2. Keep `skill-source/manifest.json` synchronized with the active v3.8 source. Any active-source byte change requires matching manifest hashes and byte counts.
3. Keep `SKILL.md`, `AGENTS.md`, `README.md`, `package.json`, and the build/check workflow aligned with the version that is actually active.
4. A staged version may be promoted only after all required source parts/references are present and an integrity check can reconstruct the intended rulebook deterministically.
5. Do not claim `FINAL_VERIFIED` for rendered media based only on source integrity or syntax checks.

## Promotion checklist for a new skill version

Before changing the active version:

- complete the staged source inventory;
- add or update an integrity manifest for that version;
- make the build script target the intended active source explicitly;
- update `SKILL.md` routing and version language;
- update `AGENTS.md`, `README.md`, `package.json`, changelog/version notes, and `RESOURCE-MANIFEST.json` as applicable;
- run `npm run check`;
- render representative output and perform the required visual/audio QA before calling the renderer production-ready.

## Render-file ownership

- `index.html` is the repository's root scene.
- `motra-output/index.html` is the Motra Studio handoff scene used by `npm run render:motra`.
- `dist/`, `output/`, and `frames/` are generated working/output directories and are intentionally ignored by Git.
- Rendered media such as MP4, MOV, WebM, WAV, MP3, M4A, and AAC files are ignored by Git and should be treated as generated deliverables unless there is an explicit reason to version them elsewhere.
- Preserve `motra-output/README.md`; do not treat the whole `motra-output/` directory as disposable.

## Safe cleanup policy

A cleanup should remove generated artifacts and caches, not authored source. Safe cleanup targets are the ignored generated directories/files listed above plus ordinary local caches such as `node_modules/`, Python bytecode, and OS metadata.

Do **not** delete or rewrite these during routine cleanup:

- `skill-source/`;
- `skill-source-v3.9.1/`;
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
