# Repository motion workflow

For motion design, animation, narrated explainers, and render/export tasks, read
`SKILL.md` and follow its ordered source-loading instructions. Resolve runtime,
reference, asset, and script paths relative to this repository root.

The active production rulebook remains Motion Designer v3.8. Use
`skill-source/manifest.json` as the active source inventory and run
`npm run build:skill` to reconstruct and verify the complete rulebook at
`dist/SKILL.md`.

`skill-source-v3.9.1/` is a staging area only. Do not mix it with the active
`skill-source/` tree or route production work to it until the staged version has
been completed, integrity-checked, and explicitly promoted.

Read `MANAGE.md` before repository cleanup, source-version promotion, or render-file
maintenance.

After changing active source parts or rendering scripts, run `npm run check`. Keep
source hashes and byte counts in sync with the intended source document. Do not
claim a video is visually or aurally verified based on syntax/integrity checks alone.
