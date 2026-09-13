# Repository motion workflow

AMHFXMOTIONRENDER uses one active integration: **Motion Designer v3.9.4**.

For every substantial motion-design, animation, explainer, runtime, or render/export task:

1. read `SKILL.md`;
2. load `skill-source/part-01.md` then `skill-source/part-02.md`;
3. always load `references/camera-motion.md`, `references/anti-ppt.md`, `references/techniques.md`, and `references/failure-gates.md`;
4. load task-specific references from the module map in `SKILL.md`;
5. use the existing `runtime/`, `assets/`, and `scripts/` paths relative to the repository root;
6. run `npm run check` after source, runtime, or render-script changes;
7. watch the actual encoded video at normal speed before final approval; contact sheets alone are insufficient;
8. do not mark substantial motion final unless all applicable skill-usage, playback, camera, camera-energy, hero-authority, composition, kinetic, kinetic-causality, continuity-material, screen-swap, payoff, anti-PPT, and audio-mix gates pass.

SFX are asset-only: use user-supplied files or repository files under `assets/`. Do not generate, search, scrape, synthesize, or download SFX from the skill. There are no voice-over rules.

There is no active v3.8 compatibility path on `main`. Do not reintroduce parallel version trees, duplicate routers, or rebuild-only copies of the same skill source.

For repository cleanup and file-ownership rules, read `MANAGE.md`.

Do not claim rendered media is visually or aurally verified from syntax checks, intended choreography, or contact sheets alone. The encoded playback is the authority.
