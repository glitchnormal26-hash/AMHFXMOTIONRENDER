---
name: amhfxmotionrender
description: Motion Designer v3.9.3 unified browser-motion skill for authored animation, kinetic typography, explainers, safe camera choreography, deterministic speed ramps, frame-accurate capture, and MP4 export.
---

# Motion Designer v3.9.3 — Safe Camera Framing Patch

This repository has one active motion-skill integration: **Motion Designer v3.9.3**.

The v3.9 modular source remains the canonical creative rulebook. v3.9.3 keeps the
anti-static camera system from v3.9.2 and adds a hard production patch for **camera
containment, safe framing, non-overlapping camera cuts, and automated frame audits**.

## Canonical source

Load these files in order as one continuous rulebook:

1. `skill-source/part-01.md`
2. `skill-source/part-02.md`
3. `references/camera-motion.md` whenever the brief contains cinematic motion,
   camera travel, tracking, follow shots, drag/drop journeys, spatial explainers,
   product traversal, 2.5D/3D, fast-paced kinetic transitions, or a portrait/vertical
   composition where camera cropping can remove important content.

Do not load or reconstruct any retired v3.8 rulebook. Git history preserves retired
versions if they are ever needed for archaeology.

## Repository module map

The imported v3.9 source names upstream modular references. This compact repository
maps those concepts onto the active production modules instead of duplicating files:

- camera / spatial / 3D → `references/camera-motion.md`, `references/full-runtime.md`, `references/architecture.md`, `runtime/camera-rig.js`, `runtime/three-scene.js`
- kinetic typography / anti-PPT → `references/techniques.md`, `references/anti-ppt.md`
- audio / VO → `references/explainer.md`, `runtime/audio-runtime.js`
- visual transitions → `references/techniques.md`, `references/architecture.md`
- SaaS / composition / brand → `references/architecture.md`, `references/anti-ppt.md`
- browser runtime → `references/full-runtime.md`, `runtime/`, `scripts/`
- explainer → `references/explainer.md`, `runtime/explainer-helpers.js`
- QA / export → `scripts/snap.mjs`, `scripts/audit-framing.mjs`, `scripts/export-frames.mjs`, `scripts/export-mp4.mjs`

When an upstream reference filename appears in the v3.9 source but is not present
locally, use this mapping rather than creating a duplicate compatibility file.

## Production contract

- one evolving visual world; avoid slide/presentation choreography;
- use the simplest capable runtime: DOM/SVG/GSAP first, true 3D only when it adds meaning;
- **anti-static camera is the default for substantial motion:** every semantic beat
  must declare `MOVING`, `TRACKING`, `REFRAME`, or `LOCKED_INTENTIONAL`;
- a sequence fails the camera gate if only subjects move while the world framing stays
  materially unchanged across multiple beats and no intentional lock is declared;
- camera intent must produce a visible render consequence through a real camera or a
  camera-equivalent world rig; moving only the subject is not camera movement;
- fast-paced explainers/product films should normally change framing every 2–4 seconds
  or explicitly enter a short `LOCKED_INTENTIONAL` comprehension hold;
- moving attention owners such as cursors, dragged assets, hero objects, characters,
  or extracted UI elements should normally receive follow, lead, catch-up, handoff,
  push-through, or reframe behavior rather than being watched from a permanently fixed wide shot;
- viewport fitting and authored camera transforms must be separated; never overload the
  fixed composition-fit transform with camera animation;
- **camera movement may not sacrifice required content:** each readable beat must name
  its attention-owner rectangle and keep that rectangle inside the composition safe frame;
- for 9:16 work, default safe margins are approximately 7% left/right, 5% top, and
  8% bottom unless the platform/brief specifies stricter UI-safe zones;
- camera zoom must be derived from the target bounds when a whole card, word, UI panel,
  product, CTA, or character must remain visible. Do not choose scale first and discover
  clipping later;
- intentional edge clipping is allowed only as a transient transition device. A readable
  landing, CTA, proof frame, product inspection, or comprehension hold must not rely on
  accidental crop;
- **hard camera resets and camera tweens must not overlap on the same transform properties.**
  If a shot cuts/reframes at time `t`, every prior x/y/scale/rotation tween must end no
  later than `t`, or be authored as a single continuous move. Do not place a `.set()`
  inside a still-running camera tween and assume it cancels the tween;
- use `runtime/camera-rig.js` helpers such as `frameRect()` for bounded framing and
  `cutSafe()` for non-overlapping hard cuts when possible;
- **speed ramps are authored velocity changes, not capture tricks:** accelerate,
  traverse, and settle on the master timeline while output FPS remains fixed;
- speed ramps must preserve deterministic seeking and audio sync; do not use uncontrolled
  realtime springs, global `timeScale()` hacks, frame skipping, or capture-FPS changes;
- during fast ramps, typography remains protected by camera-space safe lanes and must be
  checked at the ramp midpoint as well as the landing frame;
- explainers default to VO + purposeful SFX + controlled ambience + silence, with no BGM unless requested;
- user-supplied VO is timing authority; otherwise measure generated VO before timing lock;
- use `scripts/export-mp4.mjs` for deterministic H.264 export and ffprobe verification;
- use `scripts/audit-framing.mjs` when the scene exposes `window.OPENER.FRAME_AUDIT`;
- `FINAL_VERIFIED` requires actual visual/audio QA, not syntax checks alone;
- when `references/camera-motion.md` is triggered, `FINAL_VERIFIED` also requires
  `CAMERA_GATE=PASS`, `CAMERA_FRAME_GATE=PASS`, and `CAMERA_OVERLAP_GATE=PASS`;
  use `SPEED_RAMP=ACTIVE|NOT_REQUIRED` and `CAMERA_FOLLOW=USED|NOT_REQUIRED` truthfully;
- starters are architecture references, never visual templates.

## Camera implementation default

For DOM/SVG/2.5D work, prefer this hierarchy:

```text
#viewport-fit  ← fixed composition fit only
└── #camera    ← authored x/y/scale/rotation and speed-ramp motion
    └── #world ← UI, objects, type, background layers
```

Use `runtime/camera-rig.js` for deterministic camera operations including look,
tracking, safe rectangle framing, follow-point moves, push-throughs, settles,
non-overlapping cuts, and speed-ramped transfers.

For Three.js/R3F, animate the real render camera or a dedicated camera parent rig.

## Frame-safety rule

For every shot that must be readable, reason in camera space before rendering:

```text
safeLeft   = stageWidth  * 0.07
safeRight  = stageWidth  * 0.07
safeTop    = stageHeight * 0.05
safeBottom = stageHeight * 0.08
```

A required target passes only when its rendered bounding rectangle stays inside those
limits at the inspected time. Use stricter margins when a platform reserves caption,
button, notch, or navigation space.

For a target rectangle `(x, y, width, height)`, choose camera scale no larger than the
available safe width/height divided by the target dimensions, then translate the camera
so the target center lands inside the safe-frame center. Prefer `frameRect()` instead of
hand-tuned x/y/scale values for important readable landings.

## Verification

Run:

```bash
npm run check
```

The check validates the canonical v3.9 source files plus all active JavaScript
runtime/render entry points.

For a scene exposing framing audit metadata, also run:

```bash
INDEX=assets/your-scene.html WIDTH=1080 HEIGHT=1920 npm run audit:framing
```

For any cinematic / tracking / fast-paced sequence, visually inspect:

- opening camera state;
- first framing transfer;
- fastest speed-ramp midpoint;
- ramp landing;
- one hero follow/handoff moment when applicable;
- proof/comprehension frame;
- final CTA/product framing;
- typography/object collision during the fastest move;
- left/right/top/bottom safe-frame containment on every readable landing.

Reject `FINAL_VERIFIED` when a required target is cut by the viewport, when a hard
camera reset is overlapped by a still-running tween, or when the final CTA/proof frame
requires the viewer to infer cropped text.
