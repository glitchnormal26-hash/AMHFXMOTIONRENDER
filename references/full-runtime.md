# Full Runtime Architecture — Motion Designer v3.8

This document describes the complete reusable browser-motion runtime bundled
with the skill. It is architecture, not a default visual skin.

## Runtime map

```text
runtime/
├── index.js
├── motion-utils.js
├── camera-rig.js
├── explainer-helpers.js
├── three-scene.js
└── audio-runtime.js
```

## Core invariants

1. One authoritative GSAP master timeline owns time.
2. DOM, SVG, WebGL, camera state, deterministic counters and audio all seek from
   the same authored time.
3. Render-time behavior must be a pure function of current timeline state/time.
4. Never use `Date.now()`, `performance.now()`, per-frame `Math.random()`,
   accumulating `pos += velocity * dt`, or independent timers for final-render
   critical motion.
5. Fixed composition stage: 1920×1080 by default, scaled to preview windows.
6. CSS holds hidden initial state; future `from()` tweens should use
   `immediateRender:false`.
7. The `#world` rig contains both DOM and WebGL when a move is intended to feel
   like a real camera move.
8. Lens-space overlays such as light leaks remain outside `#world`.

## motion-utils.js

Includes:

- `splitChars()`
- `splitWords()`
- `makeDirectionalBlur()`
- `blurTween()`
- `createTextMotion()`
- `markHighlight()`
- `popPunctuation()`
- deterministic type-on
- deterministic number counters
- fixed-stage fitting
- deterministic sine-wave helper

Directional motion blur uses separate X/Y SVG Gaussian deviation rather than
isotropic CSS blur. Release the filter after the movement to avoid continuous
rasterization.

## camera-rig.js

Includes:

- `look()`
- `home()`
- `into()`
- `settle()`
- `pushThrough()`
- `lock()`
- `panSentence3D()`

The rig is a narrative camera, not decoration. Use movement when it changes
what the viewer understands: approach, inspection, reveal, traversal, handoff,
or spatial continuity.

## explainer-helpers.js

Includes:

- `say()`
- `unsay()`
- `draw()`
- `drawDash()`
- `label()`
- `extract()`
- `morphProxy()`
- camera proxy helpers
- scene registry/cut helpers

`drawDash()` uses clipping for dashed lines so the dashes are revealed rather
than visibly marching because of dash-offset animation.

## three-scene.js

State-driven WebGL runtime with:

```text
grid
dust
nebula
stars
tunnel
flow
camX / camY / camZ / camRoll
bloom
shake
heroO / heroS
heroX / heroY / heroZ
heroRotX / heroRotY / heroRotZ
```

It includes:

- Three.js scene/camera/renderer;
- ACES filmic tone mapping;
- hemisphere/key/rim lighting;
- deterministic dust and stars;
- grid;
- additive nebula planes;
- tunnel rings;
- generic hero geometry;
- EffectComposer;
- RenderPass;
- UnrealBloomPass;
- OutputPass.

The WebGL scene has no independent clock. Call `render(t)` with master-timeline
time.

`flow` is a tweened distance. Particle/tunnel positions are recomputed from
seed + flow rather than incremented frame-by-frame.

## audio-runtime.js

Synchronizes:

- voiceover;
- hi-tech SFX;
- controlled ambience;

to the same GSAP timeline.

It provides:

- audio unlock;
- play;
- pause;
- seek;
- drift correction.

For narrated explainers, no-BGM remains the default. Voiceover is not optional
unless the user explicitly requests narration-free output.

## Starter selection

Use:

`assets/starter.html`

for small/lite DOM motion.

Use:

`assets/starter-full-runtime.html`

when the job needs state-driven WebGL, bloom, spatial camera behavior, richer
continuous-world choreography, or runtime helpers.

The full starter requires serving the package because it imports local ES
modules. Use:

```bash
python scripts/serve.py
```

The final delivery can still be consolidated or exported to MP4.

## MP4 pipeline

Preferred direct path:

```text
authoritative timeline
→ frame-accurate seek
→ Puppeteer frame capture
→ H.264 encode
→ VO/SFX/ambience mix
→ mux
→ ffprobe verification
→ FINAL_VERIFIED
```

Use:

```bash
REQUIRE_VO=1 QUALITY=fast node scripts/export-mp4.mjs
```

for a normal narrated explainer, or:

```bash
REQUIRE_VO=1 QUALITY=final node scripts/export-mp4.mjs
```

when 60 fps / heavier motion is justified.

## Visual QA

Code correctness is not visual correctness.

Capture and inspect:

- first readable frame;
- hero impact;
- pre-transition;
- transition midpoint;
- landing;
- final frame.

Check:

- contrast;
- clipping;
- hierarchy;
- camera consequence;
- motion continuity;
- placeholder leakage;
- repeated transition grammar;
- excessive glow;
- overly presentation-like composition.
