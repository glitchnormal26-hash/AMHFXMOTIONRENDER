# Repository motion workflow

AMHFXMOTIONRENDER uses one active integration: **Motion Designer v3.9**.

For motion design, animation, explainers, runtime work, or render/export tasks:

1. read `SKILL.md`;
2. load `skill-source/part-01.md` then `skill-source/part-02.md` when the full rulebook is needed;
3. resolve specialized upstream module names through the repository module map in `SKILL.md`;
4. use the existing `references/`, `runtime/`, `assets/`, and `scripts/` paths relative to the repository root;
5. run `npm run check` after source, runtime, or render-script changes.

There is no active v3.8 compatibility path on `main`. Do not reintroduce parallel version trees, duplicate routers, or rebuild-only copies of the same skill source.

For repository cleanup and file-ownership rules, read `MANAGE.md`.

Do not claim rendered media is visually or aurally verified from syntax checks alone.
