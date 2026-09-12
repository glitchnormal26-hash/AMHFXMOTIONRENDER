# Full Runtime Architecture — Motion Designer v3.9.2

This document describes the complete reusable browser-motion runtime bundled with
the skill. It is architecture, not a default visual skin.

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
6. Viewport-fit transforms and authored camera transforms must be separate owners.
7. CSS holds hidden initial state; future `from()` tweens should use
   `immediateRender:false`.
8. The `#world` rig contains DOM/WebGL world content when a move is intended to feel
   like real camera travel.
9. Lens-space overlays such as light leaks remain outside the authored camera/world.
10. Fast-paced substantial work defaults to active camera choreography; static
    framing is only valid when explicitly authored as `LOCKED_INTENTIONAL`.

## Recommended nesting

```text
#viewport-fit      ← fit 1920×1080 to preview/output viewport
└── #camera        ← authored x/y/scale/rotation
    └── #world     ← rendered world content

.lens-space        ← effects that should not move with the camera
.debug-ui          ← camera/safe-area diagnostics only
```

Never animate only the subject and label that motion as a camera move.

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

- `home()`
- `look()`
- `trackPoint()`
- `followPoints()`
- `speedRampTo()`
- `rampToPoint()`
- `into()`
- `settle()`
- `pushThrough()`
- `lock()`
- `panSentence3D()`

The rig is a narrative camera, not decoration. Use movement when it changes what
the viewer understands: approach, inspection, reveal, traversal, handoff, subject
follow, cursor chase, product entry, or spatial continuity.

### Anti-static camera runtime rule

For substantial cinematic, kinetic, SaaS, or explainer work, create an explicit
camera plan with semantic beats using:

```text
MOVING | TRACKING | REFRAME | LOCKED_INTENTIONAL
```

A sequence fails the camera gate when all semantic change comes from object motion
inside a materially fixed world framing and no intentional camera lock is declared.

### Subject follow

Use `trackPoint()` for one deterministic attention target and `followPoints()` for a
series of authored target positions. Use offsets to create lead framing rather than
centering every target mechanically.

For drag/drop, cursor journeys, extracted objects, or moving characters, the camera
should usually follow, lead, catch up, or hand off during the important part of the
movement, then settle on the destination.

### Deterministic speed ramp

`speedRampTo()` and `rampToPoint()` implement an authored three-phase move:

```text
attack → fast travel → settle
```

The output frame rate stays fixed. Only camera velocity changes.

Do not fake a speed ramp by changing capture FPS, skipping frames, or globally
warping timeline time in a way that desynchronizes VO/SFX.

The default runtime proportions are starting values only and may be tuned per beat.
Use asymmetric timing so every transition does not feel identical.

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

`drawDash()` uses clipping for dashed lines so the dashes are revealed rather than
visibly marching because of dash-offset animation.

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

The WebGL scene has no independent clock. Call `render(t)` with master-timeline time.

`flow` is a tweened distance. Particle/tunnel positions are recomputed from seed +
flow rather than incremented frame-by-frame.

When a 3D brief claims camera travel, animate the real camera or its parent rig. A
moving mesh in a static render camera does not satisfy the active-camera contract.

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

For narrated explainers, no-BGM remains the default. Voiceover is not optional unless
the user explicitly requests narration-free output.

Camera speed ramps do not alter audio playback time. Reinforce ramps with authored
SFX, impacts, tails, or silence while preserving the master clock.

## Starter selection

Use:

`assets/starter.html`

for small/lite DOM motion.

Use:

`assets/starter-full-runtime.html`

when the job needs state-driven WebGL, bloom, active spatial camera behavior, subject
tracking, deterministic speed ramps, richer continuous-world choreography, or runtime
helpers.

The full starter requires serving the package because it imports local ES modules.
Use:

```bash
python scripts/serve.py
```

The final delivery can still be consolidated or exported to MP4.

## MP4 pipeline

Preferred direct path:

```text
authoritative timeline
→ frame-accurate seek
→ camera/world state resolve
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

when higher-quality/heavier motion is justified.

## Visual QA

Code correctness is not visual correctness.

Capture and inspect:

- first readable frame;
- hero impact;
- first camera focus transfer;
- fastest speed-ramp midpoint;
- camera landing after the ramp;
- one subject-follow/handoff frame when applicable;
- pre-transition;
- transition midpoint;
- landing;
- final frame.

Check:

- contrast;
- clipping;
- hierarchy;
- camera consequence;
- whether the frame is accidentally static across multiple semantic beats;
- motion continuity;
- typography safety during the fastest move;
- placeholder leakage;
- repeated transition grammar;
- excessive glow;
- overly presentation-like composition.

For work that triggers `references/camera-motion.md`, do not mark final until:

```text
CAMERA_GATE = PASS
SPEED_RAMP = ACTIVE | NOT_REQUIRED
CAMERA_FOLLOW = USED | NOT_REQUIRED
```

are truthfully resolved.
