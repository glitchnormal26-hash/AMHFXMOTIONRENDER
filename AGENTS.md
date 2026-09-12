# Repository motion workflow

For motion design, animation, narrated explainers, and render/export tasks, resolve
runtime, reference, asset, and script paths relative to this repository root.

The intended motion-skill generation is **Motion Designer v3.9**. Its imported core
source is preserved under `skill-source-v3.9.1/` and must not be deleted during
routine cleanup.

The repository still has a **legacy v3.8 compatibility/build path**: `SKILL.md`,
`skill-source/`, `skill-source/manifest.json`, and `npm run build:skill` currently
reconstruct and integrity-check the older v3.8 rulebook. Treat that as migration
infrastructure, not as evidence that the intended skill version is v3.8.

Do not promote the v3.9 source into the active build until its required reference
modules, source inventory, integrity data, routing, and QA path are complete. Do not
mix v3.8 and v3.9 source fragments into one reconstructed rulebook.

Read `MANAGE.md` before repository cleanup, version migration, or render-file
maintenance.

After changing production source, runtime, or rendering scripts, run `npm run check`.
Do not claim a video is visually or aurally verified based on syntax/integrity checks
alone.
