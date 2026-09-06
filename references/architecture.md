# Architecture — Deterministic Browser Motion

> 
This architecture is intended for HTML/CSS/GSAP/Three.js browser motion where
scrubbing, replay, screenshot verification, and frame-accurate export matter.

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

## Stage

For fixed-composition video output, author at a known stage size and fit the
stage to the window without changing composition.

```css
#stage {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 1920px;
  height: 1080px;
  transform: translate(-50%, -50%) scale(var(--fit));
  transform-origin: center;
  overflow: hidden;
}
```

```js
const fit = () => {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.setProperty("--fit", s);
};
```

## World / camera rig

A useful DOM architecture:

```text
#stage
├── #world          ← camera-equivalent transform owner
│   ├── canvas      ← Three.js / WebGL when needed
│   ├── .background
│   └── .content
├── .lens-fx        ← optional foreground lens-space effects
└── .debug-ui       ← hidden unless ?debug=1
```

If the shot direction describes camera travel, animate the actual render camera
or the rig that owns the rendered world. Do not animate only the subject and
describe it as camera movement.

## Initial-state rule

Critical hidden states should exist in CSS or deterministic setup before
playback starts.

```css
.motion-in { opacity: 0; }
```

Use `immediateRender:false` for GSAP `fromTo()` when appropriate so a future
tween does not corrupt frame zero.

## Active camera contract

For every substantial spatial shot declare one mode:

- `MOVING`
- `TRACKING`
- `REFRAME`
- `LOCKED_INTENTIONAL`

For non-locked modes define:
- start camera state;
- landing camera state;
- timing;
- easing / damping;
- visible screen-space consequence.

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
- `?debug=1` — show scrub UI and developer clock.
- `?clean=1` — disable autoplay and UI for deterministic capture.

Default deliverable should not show a player unless the user asks for one.

## Verification versus export

Verification:
- capture 6–20 key moments;
- inspect composition, continuity, clipping, hierarchy, and anti-PPT failures;
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


## Engine selection note

The main `SKILL.md` now owns the engine-selection contract.

Architecture defaults:

- GSAP for deterministic DOM/SVG timeline motion;
- DOM/SVG world rig for 2.5D before escalating to real 3D;
- Three.js/R3F only when true geometry/camera/light materially improves the idea;
- Puppeteer/browser snapshots for deterministic visual QA;
- ffmpeg or another verified encoder/muxer for final frame+audio assembly.

Never claim an engine/provider was used unless the current environment actually
executed it.


## Direct MP4 exporter

For final MP4 delivery, prefer `scripts/export-mp4.mjs`.

It wraps the deterministic browser-render path into one command:

**OPENER timeline → frame seek/capture → H.264 encode → VO/SFX/ambience mix →
audio mux → ffprobe verification → `FINAL_VERIFIED`**

Use `QUALITY=fast` for a 30 fps fast path and `QUALITY=final` for a 60 fps
higher-quality path.

For narrated explainers, set `REQUIRE_VO=1` so the exporter fails instead of
silently producing a final-looking mute video.


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

For anything that appears to flow, tween a distance/state value and derive
positions from that value. This keeps pause, seek, snapshots and frame export
reproducible.

Use the no-cache server for local ES-module development. A final direct-open
HTML can still be consolidated later if portability is required.
