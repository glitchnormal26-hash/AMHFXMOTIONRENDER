# Repository motion workflow

AMHFXMOTIONRENDER uses one active integration: **Motion Designer v3.9.4**.

For every substantial motion-design, animation, explainer, runtime, or render/export task:

1. read `SKILL.md`;
2. load `skill-source/part-01.md` then `skill-source/part-02.md`;
3. always load `references/camera-motion.md`, `references/camera-movement.md`, `references/anti-ppt.md`, `references/techniques.md`, `references/failure-gates.md`, and `references/visual-quality.md`;
4. treat `references/visual-quality.md` as a **global mandatory visual gate** for every visible scene, regardless of theme, including Three.js, DOM/SVG, Canvas, WebGL, R3F, backgrounds, particles, decorations, product visuals, environments, and still frames;
5. use `references/camera-movement.md` whenever camera choreography involves Three.js + GSAP, including push/pull, pan/tilt, capped orbit, truck/pedestal, parallax, crane, whip-pan transitions, micro-drift, follow/tracking, `lookAt` synchronization, or chroma-key-aware camera motion;
6. for SaaS-style motion explainers, product explainers, or SaaS microstock concepts, also load `references/saas-motion-explainer-direction.md` together with `references/explainer.md`; use the SaaS module for palette/type/surface/layout/shot/pacing decisions and the camera modules for movement/framing decisions;
7. task-specific visual profiles refine the global quality rules but do not excuse raw/default developer geometry. In the SaaS profile, simple abstract forms are allowed when they are intentionally art-directed graphic language; raw tutorial primitives, generic flying-object filler, and primitive stand-ins for real-world objects still fail;
8. load other task-specific references from the module map in `SKILL.md`;
9. use the existing `runtime/`, `assets/`, and `scripts/` paths relative to the repository root;
10. run `npm run check` after source, runtime, reference, starter, or render-script changes;
11. inspect representative still frames at full size and thumbnail size before export; reject recognizable default primitives, symbolic geometry shortcuts, generic particle-demo visuals, weak materials, flat fake shadows, or scenes that read as developer art;
12. for SaaS-profile work, also verify one named palette, fragment typography, authored hierarchy, appropriate depth layering, one hero motion per shot, staggered secondary motion, readable holds, and deliberate camera pairing;
13. watch the actual encoded video at normal speed before final approval; contact sheets alone are insufficient;
14. do not mark substantial motion final unless all applicable skill-usage, playback, camera, camera-energy, hero-authority, composition, kinetic, kinetic-causality, continuity-material, screen-swap, payoff, anti-PPT, audio-mix, **anti-primitive, still-frame, hero-visual, material, depth, art-direction, thumbnail, copyspace, and SaaS-direction** gates pass.

Global visible-visual verification must truthfully include:

```text
ANTI_PRIMITIVE_GATE=PASS
STILL_FRAME_GATE=PASS
HERO_VISUAL_GATE=PASS
MATERIAL_GATE=PASS
DEPTH_GATE=PASS
ART_DIRECTION_GATE=PASS
THUMBNAIL_GATE=PASS
COPYSPACE_GATE=PASS|NOT_REQUIRED
SAAS_DIRECTION_GATE=PASS|NOT_REQUIRED
```

`looks like a Three.js demo`, recognizable raw primitive geometry, or a real-world object represented by an obvious primitive shortcut is an automatic visual rejection condition. Animation quality does not override weak still-frame art direction.

For SaaS-profile work, `SAAS_DIRECTION_GATE=PASS` is not earned by importing a starter or copying a palette. The final piece must visibly use the profile's hierarchy, fragment type, coherent surfaces/icon language, depth strategy, hero-motion focus, stagger/hold rhythm, and camera pairing. `assets/starter-saas-explainer.html` is architecture reference only.

SFX are asset-only: use user-supplied files or repository files under `assets/`. Do not generate, search, scrape, synthesize, or download SFX from the skill. There are no voice-over rules.

There is no active v3.8 compatibility path on `main`. Do not reintroduce parallel version trees, duplicate routers, or rebuild-only copies of the same skill source.

For repository cleanup and file-ownership rules, read `MANAGE.md`.

Do not claim rendered media is visually or aurally verified from syntax checks, intended choreography, or contact sheets alone. The encoded playback is the authority for motion, while the still-frame visual-quality gates remain independently mandatory.
