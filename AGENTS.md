# Repository motion workflow

For motion design, animation, narrated explainers, and render/export tasks, read
`SKILL.md` and follow its ordered source-loading instructions. Resolve runtime,
reference, asset, and script paths relative to this repository root.

Use `skill-source/manifest.json` as the source inventory. Run `npm run build:skill`
to reconstruct and verify the complete rulebook at `dist/SKILL.md`.

After changing source parts or rendering scripts, run `npm run check`. Keep source
hashes and byte counts in sync with the intended source document. Do not claim a
video is visually or aurally verified based on syntax/integrity checks alone.
