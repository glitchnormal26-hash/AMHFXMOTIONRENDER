# Repository motion workflow

AMHFXMOTIONRENDER uses one active integration: **Motion Designer v3.9.3**.

For every substantial motion-design, animation, explainer, runtime, or render/export task:

1. read `SKILL.md`;
2. load `skill-source/part-01.md` then `skill-source/part-02.md`;
3. always load `references/camera-motion.md`, `references/anti-ppt.md`, and `references/techniques.md`;
4. load task-specific references from the module map in `SKILL.md`;
5. use the existing `runtime/`, `assets/`, and `scripts/` paths relative to the repository root;
6. run `npm run check` after source, runtime, or render-script changes;
7. do not mark substantial motion final unless the skill-usage, camera, composition, kinetic, and anti-PPT gates pass.

SFX are asset-only: use user-supplied files or repository files under `assets/`. Do not generate, search, scrape, synthesize, or download SFX from the skill. There are no voice-over rules.

There is no active v3.8 compatibility path on `main`. Do not reintroduce parallel version trees, duplicate routers, or rebuild-only copies of the same skill source.

For repository cleanup and file-ownership rules, read `MANAGE.md`.

Do not claim rendered media is visually or aurally verified from syntax checks alone.
