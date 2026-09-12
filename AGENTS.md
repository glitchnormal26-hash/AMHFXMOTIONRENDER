# Repository motion workflow

For motion design, animation, narrated explainers, and render/export tasks, read
`SKILL.md` and follow its ordered source-loading instructions. Resolve runtime,
reference, asset, and script paths relative to this repository root.

The active production rulebook is Motion Designer v3.8. Use
`skill-source/manifest.json` as the active source inventory and run
`npm run build:skill` to reconstruct and verify the complete rulebook at
`dist/SKILL.md`.

Read `MANAGE.md` before repository cleanup, source-version promotion, or render-file
maintenance. Keep incomplete future-version imports off `main`; stage them on a
separate branch until the full source, integrity data, build path, and QA are ready.

After changing active source parts or rendering scripts, run `npm run check`. Keep
source hashes and byte counts in sync with the intended source document. Do not
claim a video is visually or aurally verified based on syntax/integrity checks alone.
