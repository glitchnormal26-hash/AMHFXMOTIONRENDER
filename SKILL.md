---
name: amhfxmotionrender
description: Motion Designer v3.9.3 unified browser-motion skill for authored camera choreography, composition, kinetic typography, spatial continuity, deterministic speed ramps, frame-accurate capture, and MP4 export.
---

# Motion Designer v3.9.3 — Motion Depth Gate

This repository has one active motion-skill integration: **Motion Designer v3.9.3**.

The v3.9 modular source remains the canonical creative rulebook. v3.9.3 adds hard
production gates for **camera choreography, composition, kinetic depth, actual skill
usage, and asset-only SFX**.

## Canonical source

Load these files in order as one continuous rulebook for every substantial motion job:

1. `skill-source/part-01.md`
2. `skill-source/part-02.md`
3. `references/camera-motion.md`
4. `references/anti-ppt.md`
5. `references/techniques.md`

Then load task-specific modules only when needed:

- `references/architecture.md` for SaaS/product/composition/runtime structure;
- `references/explainer.md` for explainer-specific visual planning;
- `references/full-runtime.md` for browser/runtime implementation details.

Do not load or reconstruct any retired v3.8 rulebook. Git history preserves retired
versions if they are ever needed for archaeology.

## Repository module map

- camera / spatial / 3D → `references/camera-motion.md`, `references/full-runtime.md`, `references/architecture.md`, `runtime/camera-rig.js`, `runtime/three-scene.js`
- kinetic typography / anti-PPT → `references/techniques.md`, `references/anti-ppt.md`
- composition / SaaS / brand → `references/architecture.md`, `references/anti-ppt.md`
- visual transitions → `references/techniques.md`, `references/architecture.md`
- browser runtime → `references/full-runtime.md`, `runtime/`, `scripts/`
- explainer → `references/explainer.md`, `runtime/explainer-helpers.js`
- SFX → repository/user-provided files under `assets/` only
- QA / export → `scripts/snap.mjs`, `scripts/export-frames.mjs`, `scripts/export-mp4.mjs`

When an upstream reference filename appears in the v3.9 source but is not present
locally, use this mapping rather than creating a duplicate compatibility file.

## Non-negotiable production gates

A substantial motion piece is **not final** unless all applicable gates pass.

### 1. Skill usage gate

The implementation must visibly use the loaded motion rules. A render fails when it
could have been produced from a generic starter without meaningful authored changes to
camera, composition, typography choreography, transition logic, timing, and hierarchy.

Required evidence in the final implementation:

- an authored camera/world rig or real camera when spatial motion is applicable;
- at least two distinct transition logics in pieces long enough to require transitions;
- composition changes tied to semantic beats, not one layout with swapped copy;
- kinetic behavior chosen from meaning, hierarchy, and motion role rather than one repeated stagger;
- starter palette/type/motion defaults replaced by project-specific decisions.

Use `SKILL_USAGE_GATE=PASS|FAIL` truthfully.

### 2. Camera gate

Anti-static camera is the default for substantial motion. Every semantic beat must
declare `MOVING`, `TRACKING`, `REFRAME`, or `LOCKED_INTENTIONAL`.

The sequence fails when subjects move energetically while effective world framing
stays materially unchanged across multiple beats.

For short product/social films around 8–20 seconds, target at least **three visibly
different framing states** unless the concept explicitly depends on a locked shot.
Those states must change spatial relationships through position, scale/FOV, crop,
perspective, depth, or camera target—not decorative 1–2 px drift.

Moving only the subject is not camera movement. Viewport fitting and authored camera
transforms must remain separate.

Use `CAMERA_GATE=PASS|FAIL` and `CAMERA_FOLLOW=USED|NOT_REQUIRED` truthfully.

### 3. Composition gate

Every hero frame must have a deliberate attention hierarchy and balanced negative
space. The piece fails when:

- the hero has no clear visual owner;
- type, UI, and decoration compete at similar weight;
- important elements collide with edges or each other without intent;
- the same centered composition is reused across consecutive beats;
- the frame reads like unrelated cards placed on a canvas;
- camera moves expose dead stage regions or destroy the intended reading order.

Before final export, inspect opening, hero impact, mid-transition, landing, and final
frame as still compositions. Use `COMPOSITION_GATE=PASS|FAIL`.

### 4. Kinetic depth gate

Kinetic typography must be authored as a sequence of differentiated micro-events.
A piece fails when kinetic animation is primarily:

- identical word-by-word stagger;
- repeated fade/slide/scale entrances;
- one easing curve applied to every word or character;
- text moving independently from camera, objects, or semantic transitions;
- decorative motion with no anticipation, attack, contact, handoff, or settle.

For a kinetic passage, use at least **three distinct motion roles** where appropriate,
such as attack, replacement, crop reveal, compression, overshoot, foreground invasion,
masking, camera target, occlusion, semantic morph, or type-to-product handoff.

Typography may own the frame, become a spatial landmark, occluder, transition plane,
or cause the next shot. Use `KINETIC_GATE=PASS|FAIL`.

### 5. Continuity / anti-PPT gate

Use one evolving visual world. Avoid slide/presentation choreography, replaceable
full-screen artboards, repeated title cards, or unrelated screens that enter/hold/exit.
Preserve continuity through camera velocity, object identity, geometry, typography,
material, light, screen position, or semantic transformation.

Use `ANTI_PPT_GATE=PASS|FAIL`.

## Motion execution contract

- use the simplest capable runtime: DOM/SVG/GSAP first, true 3D only when it adds meaning;
- moving attention owners such as cursors, dragged assets, hero objects, characters,
  or extracted UI elements should normally receive follow, lead, catch-up, handoff,
  push-through, or reframe behavior rather than being watched from a fixed wide shot;
- fast-paced product films should normally change framing every 2–4 seconds or enter a
  short `LOCKED_INTENTIONAL` comprehension hold;
- speed ramps are authored velocity changes on the master timeline, never capture tricks;
- speed ramps must preserve deterministic seeking and fixed output FPS;
- during fast ramps, protect typography with camera-space safe lanes and inspect the
  ramp midpoint as well as the landing frame;
- transition design should follow `CAUSE → ACTION → RESULT`; if a transition does not
  change meaning, hierarchy, continuity, or anticipation, rebuild or remove it;
- starters are architecture references, never visual templates.

## Audio rule — asset-only SFX

There are **no voice-over rules in this skill**.

SFX may be used only when an actual audio file is already supplied by the user or
exists in the repository under `assets/`. Do not generate, synthesize, scrape, search,
download, or invent SFX as part of the motion skill. Do not use TTS.

If no suitable SFX asset exists, render without SFX. Never block visual production on
missing audio.

When SFX assets are used, place them deterministically on the same master timeline and
verify the exported audio stream.

Use `SFX_MODE=ASSET_ONLY|NONE`.

## Camera implementation default

For DOM/SVG/2.5D work, prefer this hierarchy:

```text
#viewport-fit  ← fixed 1920×1080 fit only
└── #camera    ← authored x/y/scale/rotation and speed-ramp motion
    └── #world ← UI, objects, type, background layers
```

Use `runtime/camera-rig.js` for deterministic camera operations including look,
tracking, follow-point moves, push-throughs, settles, and speed-ramped transfers.

For Three.js/R3F, animate the real render camera or a dedicated camera parent rig.

## Verification

Run:

```bash
npm run check
```

For substantial motion, visually inspect:

- opening composition;
- first camera/framing transfer;
- first kinetic hero event;
- fastest transition midpoint;
- transition landing;
- one hero follow/handoff moment when applicable;
- final framing;
- typography/object collision during the fastest move.

`FINAL_VERIFIED` requires:

```text
SKILL_USAGE_GATE=PASS
CAMERA_GATE=PASS
COMPOSITION_GATE=PASS
KINETIC_GATE=PASS
ANTI_PPT_GATE=PASS
SPEED_RAMP=ACTIVE|NOT_REQUIRED
CAMERA_FOLLOW=USED|NOT_REQUIRED
SFX_MODE=ASSET_ONLY|NONE
```
