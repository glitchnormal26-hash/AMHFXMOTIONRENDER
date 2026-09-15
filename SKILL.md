---
name: amhfxmotionrender
description: Motion Designer v3.9.4 unified browser-motion skill for authored camera choreography, composition, kinetic typography, spatial continuity, playback-first QA, deterministic speed ramps, frame-accurate capture, MP4 export, and task-specific SaaS explainer art direction.
---

# Motion Designer v3.9.4 — Playback-First Motion Depth Gate

This repository has one active motion-skill integration: **Motion Designer v3.9.4**.

The v3.9 modular source remains the canonical creative rulebook. v3.9.4 adds hard
production gates for **camera choreography, composition, hero authority, kinetic depth,
continuity material, actual skill usage, playback-first verification, visual quality,
and asset-only SFX**. Task-specific visual profiles, such as the SaaS explainer
direction module, refine that global rulebook without creating a parallel skill tree.

## Canonical source

Load these files in order as one continuous rulebook for every substantial motion job:

1. `skill-source/part-01.md`
2. `skill-source/part-02.md`
3. `references/camera-motion.md`
4. `references/camera-movement.md`
5. `references/anti-ppt.md`
6. `references/techniques.md`
7. `references/failure-gates.md`
8. `references/visual-quality.md`

Then load task-specific modules only when needed:

- `references/architecture.md` for SaaS/product/composition/runtime structure;
- `references/explainer.md` for explainer-specific visual planning;
- `references/saas-motion-explainer-direction.md` for SaaS-style motion explainers,
  microstock/product concepts, palette/type/surface rules, shot vocabulary, and
  beat-level art direction;
- `references/full-runtime.md` for browser/runtime implementation details.

For SaaS explainer work, load `references/saas-motion-explainer-direction.md` together
with `references/explainer.md`, `references/camera-motion.md`, and
`references/camera-movement.md`. The SaaS module governs **what is built and how it is
styled/paced**; the camera modules govern **how it is shot and reframed**.

Do not load or reconstruct any retired v3.8 rulebook. Git history preserves retired
versions if they are ever needed for archaeology.

## Repository module map

- camera / spatial / 3D → `references/camera-motion.md`, `references/camera-movement.md`, `references/full-runtime.md`, `references/architecture.md`, `runtime/camera-rig.js`, `runtime/three-scene.js`
- kinetic typography / anti-PPT → `references/techniques.md`, `references/anti-ppt.md`
- composition / SaaS / brand → `references/architecture.md`, `references/visual-quality.md`, `references/saas-motion-explainer-direction.md`, `references/anti-ppt.md`
- playback / failure rejection → `references/failure-gates.md`
- visual quality / art direction → `references/visual-quality.md`
- visual transitions → `references/techniques.md`, `references/architecture.md`
- browser runtime → `references/full-runtime.md`, `runtime/`, `scripts/`
- explainer → `references/explainer.md`, `runtime/explainer-helpers.js`
- SaaS explainer → `references/saas-motion-explainer-direction.md`, `references/explainer.md`, `assets/starter-saas-explainer.html`
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

### 3. Camera energy gate

Camera movement must have an authored energy shape, not one generic smooth ease reused
throughout the sequence.

For active-camera short-form work, use at least two meaningfully different movement
signatures such as anticipation→chase→impact→settle, lead→catch-up→overshoot→correction,
or pull-back→hold→push-through.

Reject constant-distance follow, uniform smooth pans, or camera motion that feels like a
screensaver across a static canvas.

Use `CAMERA_ENERGY_GATE=PASS|FAIL`.

### 4. Composition / hero authority gate

Every hero frame must have a deliberate attention hierarchy and balanced negative
space. The piece fails when:

- the hero has no clear visual owner;
- the attention owner becomes tiny for a sustained interval without a deliberate wide-shot reason;
- type, UI, and decoration compete at similar weight;
- important elements collide with edges or each other without intent;
- the same centered composition is reused across consecutive beats;
- the frame reads like unrelated cards placed on a canvas;
- negative space has no tension, directional role, landing zone, or counterweight;
- camera moves expose dead stage regions or destroy the intended reading order.

Before final export, inspect opening, hero impact, mid-transition, landing, and final
frame as still compositions. Use `COMPOSITION_GATE=PASS|FAIL` and
`HERO_AUTHORITY_GATE=PASS|FAIL`.

### 5. Kinetic depth / causality gate

Kinetic typography must be authored as a sequence of differentiated micro-events.
A piece fails when kinetic animation is primarily:

- identical word-by-word stagger;
- repeated fade/slide/scale entrances;
- one easing curve applied to every word or character;
- text moving independently from camera, objects, or semantic transitions;
- decorative motion with no anticipation, attack, contact, handoff, or settle.

For a kinetic-led short sample, use multiple distinct roles such as anticipation,
attack, replacement, crop reveal, compression, masking, occlusion, semantic morph,
camera target, object/type relay, or settle.

At least one type event must materially change camera framing, object state, or the next
transition. If typography can be removed without changing the choreography of the world,
it fails the causality gate.

Use `KINETIC_GATE=PASS|FAIL` and `KINETIC_CAUSALITY_GATE=PASS|FAIL`.

### 6. Continuity / anti-PPT gate

Use one evolving visual world. Avoid slide/presentation choreography, replaceable
full-screen artboards, repeated title cards, or unrelated screens that enter/hold/exit.
Preserve continuity through camera velocity, object identity, geometry, typography,
material, light, screen position, or semantic transformation.

A thin decorative connector alone is insufficient. At least one visible carrier must
materially persist, transform, transfer role, or physically cause the next state.

Reject consecutive major beats that behave as card/screen swaps: previous hero leaves,
new hero appears unrelated, camera/world effectively resets, and no visible material or
semantic cause bridges them.

Use `ANTI_PPT_GATE=PASS|FAIL`, `CONTINUITY_MATERIAL_GATE=PASS|FAIL`, and
`SCREEN_SWAP_GATE=PASS|FAIL`.

### 7. Payoff gate

The final state must resolve the energy built by the sequence.

Reject endings that shrink into a tiny centered card, lose hero authority, appear as a
fresh unrelated screen, or contain no visual memory of the journey that created them.

Prefer the persistent hero, route, type, object, or transformed material resolving
into the final payoff.

Use `PAYOFF_GATE=PASS|FAIL`.

### 8. Visual quality gate

`references/visual-quality.md` is globally mandatory for visible output. Motion quality
does not excuse developer art, default materials, weak still frames, flat fake shadows,
unresolved depth, or accidental visual-language mixtures.

Inspect representative stills at full size, reduced scale, and thumbnail size. Use the
visual-quality gate fields truthfully, including anti-primitive, still-frame,
hero-visual, material, depth, art-direction, thumbnail, and copyspace checks.

Task-specific modules may define an intentional visual dialect. For example, the SaaS
profile permits simple abstract geometry when it is clearly art-directed graphic
language; it does **not** permit raw tutorial primitives or primitive stand-ins for
real-world objects.

### 9. SaaS direction gate — conditional

When a project explicitly uses the SaaS explainer profile, it must visibly follow
`references/saas-motion-explainer-direction.md` rather than merely claiming a SaaS
look.

Require:

- one named palette and tokenized color use;
- fragmentary hero/feature typography, not animated explanatory paragraphs;
- authored hierarchy and intentional depth layering when depth supports the concept;
- one hero motion per shot with staggered secondary motion and readable holds;
- scene/shot choice that carries the product argument rather than generic filler;
- deliberate pairing between beat purpose and camera behavior;
- no unstyled Three.js/demo geometry or unrelated flying-object filler.

Use `SAAS_DIRECTION_GATE=PASS|FAIL|NOT_REQUIRED` truthfully.

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

Reject clipped, hard-limited, wildly inconsistent, or constantly cluttered SFX mixes.
For SFX-only short-form, `-24 to -18 LUFS integrated` and true peak around or below
`-3 dBTP` are practical starting safety values unless the delivery brief specifies
otherwise.

Use `SFX_MODE=ASSET_ONLY|NONE` and `AUDIO_MIX_GATE=PASS|NOT_REQUIRED`.

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
For concrete Three.js + GSAP camera move selection, easing/timing, `lookAt` synchronization,
follow damping, loop-friendly drift, and chroma-key constraints, use
`references/camera-movement.md` together with `references/camera-motion.md`.

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
- typography/object collision during the fastest move;
- full-resolution, reduced-scale, and thumbnail still-frame quality;
- SaaS palette/type/depth/hold compliance when the SaaS profile is active.

Then watch the **actual encoded video from start to finish at normal speed**. Contact
sheets are necessary but not sufficient. The encoded playback is the final visual
authority.

`FINAL_VERIFIED` requires:

```text
SKILL_USAGE_GATE=PASS
PLAYBACK_GATE=PASS
CAMERA_GATE=PASS
CAMERA_ENERGY_GATE=PASS
HERO_AUTHORITY_GATE=PASS
COMPOSITION_GATE=PASS
KINETIC_GATE=PASS
KINETIC_CAUSALITY_GATE=PASS
ANTI_PPT_GATE=PASS
CONTINUITY_MATERIAL_GATE=PASS
SCREEN_SWAP_GATE=PASS
PAYOFF_GATE=PASS
ANTI_PRIMITIVE_GATE=PASS
STILL_FRAME_GATE=PASS
HERO_VISUAL_GATE=PASS
MATERIAL_GATE=PASS
DEPTH_GATE=PASS
ART_DIRECTION_GATE=PASS
THUMBNAIL_GATE=PASS
COPYSPACE_GATE=PASS|NOT_REQUIRED
SAAS_DIRECTION_GATE=PASS|NOT_REQUIRED
SPEED_RAMP=ACTIVE|NOT_REQUIRED
CAMERA_FOLLOW=USED|NOT_REQUIRED
SFX_MODE=ASSET_ONLY|NONE
AUDIO_MIX_GATE=PASS|NOT_REQUIRED
```
