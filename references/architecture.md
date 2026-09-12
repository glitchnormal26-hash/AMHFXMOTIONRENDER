# Architecture — Deterministic Browser Motion

This architecture is intended for HTML/CSS/GSAP/Three.js browser motion where
scrubbing, replay, screenshot verification, camera choreography, speed ramps, and
frame-accurate export matter.

## Core model

Use one authoritative time source.

```text
MASTER TIME / FRAME
        ↓
 GSAP / authored timeline state
        ↓
 DOM + camera/world rig + WebGL/R3F state + audio sync
        ↓
 render
        ↓
 screenshot / capture
```

Do not let independent clocks drift.

Avoid render-path dependence on:
- `Date.now()`
- `performance.now()`
- uncontrolled `setInterval`
- unseeded per-frame `Math.random()`
- accumulated `position += velocity * dt` when seeking must be reproducible

Prefer:
- explicit absolute times / frames;
- seeded setup randomness;
- sinusoidal or keyed deterministic secondary motion;
- position as a function of master time / authored state;
- one exposed `seek(t)` / `seekFrame(frame)` API.

## Stage, viewport fit, and camera must be separate

For fixed-composition video output, author at a known stage size and fit the
composition to the window without changing authored camera state.

Do **not** use the same transform owner for viewport fitting and narrative camera
movement. That makes camera travel fragile and often collapses back into a static
frame.

Recommended hierarchy:

```text
#viewport-fit        ← fixed composition fit only
└── #camera          ← authored x/y/scale/rotation
    └── #world       ← DOM / SVG / WebGL visual world
        ├── background
        ├── product / UI / objects
        └── world-space typography

.lens-fx             ← outside camera when intended to stay lens-space
.debug-ui            ← outside camera, hidden unless debugging
```

Example fit wrapper:

```css
#viewport-fit {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 1920px;
  height: 1080px;
  transform: translate(-50%, -50%) scale(var(--fit));
  transform-origin: center;
  overflow: hidden;
}

#camera,
#world {
  position: absolute;
  inset: 0;
  transform-origin: 0 0;
}
```

```js
const fit = () => {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  viewportFit.style.setProperty("--fit", s);
};
```

## World / camera rig

If the shot direction describes camera travel, animate the actual render camera or
the rig that owns the rendered world. Do not animate only the subject and describe
it as camera movement.

For DOM/SVG/2.5D, `runtime/camera-rig.js` is the preferred deterministic camera
helper. For Three.js/R3F, animate the real camera or a dedicated camera parent rig.

## Anti-static camera hard gate

For every substantial semantic beat declare one mode:

- `MOVING`
- `TRACKING`
- `REFRAME`
- `LOCKED_INTENTIONAL`

A substantial sequence fails camera QA when:

1. world framing stays materially unchanged across multiple semantic beats;
2. all energy comes from subjects/cards/UI animating inside that fixed frame; and
3. no explicit authored reason exists for the locked shot.

`LOCKED_INTENTIONAL` is a contrast state for readability, suspense, inspection, or
clean typographic landing. It is not the default shortcut.

For fast-paced explainers, product films, and kinetic ads, framing should normally
change every 2–4 seconds or enter a short intentional lock.

## Subject follow and attention handoff

When a cursor, dragged asset, character, hero object, or extracted UI element owns
attention, the camera should normally respond with one of:

- follow;
- lead;
- catch-up;
- reframe;
- handoff;
- push-through;
- pull-back reveal.

A long drag observed from a permanently fixed wide shot should be treated as a
camera-design failure unless the wide shot itself carries meaning.

Use `trackPoint()`, `followPoints()`, `rampToPoint()`, or `speedRampTo()` from
`runtime/camera-rig.js` for deterministic 2.5D implementations.

## Speed-ramp architecture

A speed ramp changes authored velocity while output cadence remains fixed.

Do not create a speed ramp by:

- changing capture FPS;
- dropping/skipping frames;
- globally changing timeline `timeScale()` in a way that desynchronizes VO/SFX;
- using realtime velocity integration that cannot be reconstructed by `seek(t)`.

Preferred pattern:

```text
attack → fast travel → settle
```

Typical starting proportions:

```text
attack  12–25%
travel  45–68%
settle  18–35%
```

Implement with explicit timeline keyframes, piecewise interpolation, or the camera
rig's deterministic `speedRampTo()` / `rampToPoint()` helpers.

Use ramps to transfer energy between semantic beats: pickup→drag→drop,
kinetic-type→product, push-through→detail, detail→pull-back, or hold→next burst.

## Initial-state rule

Critical hidden states should exist in CSS or deterministic setup before playback
starts.

```css
.motion-in { opacity: 0; }
```

Use `immediateRender:false` for GSAP `fromTo()` when appropriate so a future tween
does not corrupt frame zero.

## Active camera contract

For every non-locked camera beat define:
- start camera state;
- landing camera state;
- timing;
- easing / damping;
- visible screen-space consequence;
- attention owner or narrative reason.

For speed-ramped beats also define:
- attack duration/ratio;
- travel duration/ratio;
- settle duration/ratio;
- fastest midpoint to inspect in QA.

## Public control API

Expose a stable controller for verification/export:

```js
window.OPENER = {
  DURATION,
  ready: false,
  tl,
  seek(t) {
    tl.pause();
    tl.time(t, false);
    // apply camera state and render immediately
  },
  play() { tl.play(); }
};
```

Set `ready=true` only after critical fonts/assets are loaded.

## Debug and clean modes

Recommended query modes:
- `?debug=1` — show scrub UI, camera mode/state, safe lanes, and developer clock.
- `?clean=1` — disable autoplay and UI for deterministic capture.

Default deliverable should not show a player unless the user asks for one.

## Verification versus export

Verification:
- capture 6–20 key moments;
- inspect composition, continuity, clipping, hierarchy, and anti-PPT failures;
- for active-camera work include opening frame, first framing transfer, fastest ramp
  midpoint, ramp landing, one follow/handoff moment, and final framing;
- inspect typography collisions during the fastest camera move, not only at landings;
- iterate.

Export:
- only when requested;
- seek the authoritative timeline to each frame;
- capture exact frame images;
- assemble to video with ffmpeg or another deterministic encoder.

Do not render thousands of frames just to “check” a draft.

## Direct-open delivery

When the user wants a single `index.html`:
- keep CSS and project JS inline;
- CDN imports may remain online dependencies;
- avoid local `fetch()` / XHR when opened with `file://`;
- use relative `<img>` paths for local images;
- keep dev server optional, not a viewing requirement.

## Audio sync

VO / SFX timing should follow the master time. On seek:
- update audio position;
- avoid hidden realtime clocks;
- pause audio when timeline is paused;
- preserve deterministic visual state even when audio playback is unavailable.

Camera speed ramps must not alter the audio clock. If a ramp needs stronger sonic
energy, author additional SFX or timing accents rather than warping playback time.

## Engine selection note

The main `SKILL.md` owns the engine-selection contract.

Architecture defaults:
- GSAP for deterministic DOM/SVG timeline motion;
- DOM/SVG camera/world rig for 2.5D before escalating to true 3D;
- Three.js/R3F only when geometry/camera/light materially improves the idea;
- Puppeteer/browser snapshots for deterministic visual QA;
- ffmpeg or another verified encoder/muxer for final frame+audio assembly.

Never claim an engine/provider was used unless the current environment actually
executed it.

## Direct MP4 exporter

For final MP4 delivery, prefer `scripts/export-mp4.mjs`.

It wraps the deterministic browser-render path into one command:

**OPENER timeline → frame seek/capture → H.264 encode → VO/SFX/ambience mix →
audio mux → ffprobe verification → `FINAL_VERIFIED`**

Use `QUALITY=fast` for a 30 fps fast path and `QUALITY=final` for a higher-quality
path when justified.

For narrated explainers, set `REQUIRE_VO=1` so the exporter fails instead of silently
producing a final-looking mute video.

## Full runtime file structure

For projects with more than a few scenes or meaningful WebGL, prefer:

```text
project/
├── index.html
├── runtime/
│   ├── motion-utils.js
│   ├── camera-rig.js
│   ├── explainer-helpers.js
│   ├── three-scene.js
│   └── audio-runtime.js
├── audio/
│   ├── voiceover.*
│   ├── sfx-mix.*
│   └── ambience.*
└── scripts/
    ├── snap.mjs
    └── export-mp4.mjs
```

The timeline is the only place where authored time should originate.

The Three.js scene receives timeline time through `render(t)`.

For anything that appears to flow, tween a distance/state value and derive positions
from that value. This keeps pause, seek, snapshots, camera ramps, and frame export
reproducible.

Use the no-cache server for local ES-module development. A final direct-open HTML can
still be consolidated later if portability is required.
