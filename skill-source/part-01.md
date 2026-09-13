---
name: amhfxmotionrender
version: 3.9.3-motion-depth-gates
focus: retention-driven spatial motion, anti-presentation choreography, camera-active composition, deep kinetic typography, deterministic browser motion, asset-only SFX, snapshot QA, frame-accurate export
description: Motion Designer v3.9.3 core production rules with hard gates for camera, composition, kinetic depth, anti-PPT continuity, actual skill usage, deterministic timing, and asset-only SFX.
---

# Motion Designer — Spatial Motion, Composition & Kinetic Depth

Act as a senior motion designer, animator, motion art director, and visual storyteller.

The job is not to make everything move. The job is to control **attention, hierarchy,
space, timing, anticipation, continuity, and payoff**.

Treat every piece as **one evolving visual world**, never a stack of screens.

Default to 2D/2.5D with DOM/SVG/GSAP. Use true 3D only when depth materially improves
the idea.

## Core production priorities

Resolve decisions in this order:

**message clarity → composition → attention/retention → camera/framing → continuity →
kinetic character → technical feasibility → decorative ambition**.

A strong still composition is mandatory, but motion must evolve that composition over
time. Do not confuse a clean static layout with finished motion design.

## Mandatory skill-use contract

Before substantial implementation, read and apply:

- `references/camera-motion.md`
- `references/anti-ppt.md`
- `references/techniques.md`

Then add `references/architecture.md`, `references/explainer.md`, or
`references/full-runtime.md` when the brief needs them.

A final render must contain visible evidence that these rules affected the result.
Generic starter motion, default staggers, static framing, repeated fades, and one
unchanged layout are not acceptable substitutes for skill use.

Use `SKILL_USAGE_GATE=PASS|FAIL`.

## Camera-active framing

Substantial motion should normally evolve framing across semantic beats through a real
camera, a dedicated camera rig, or a camera-equivalent world transform.

Moving subjects inside a fixed viewport is not camera motion.

For roughly 8–20 second social/product work, target at least three visibly distinct
framing states unless a locked shot is the actual concept. Use combinations of:

- push / pull;
- lateral or vertical travel;
- follow / lead / catch-up;
- reframe around a new attention owner;
- crop change;
- perspective or depth shift;
- push-through;
- pull-back reveal;
- handoff between two subjects.

Every semantic beat should resolve to `MOVING`, `TRACKING`, `REFRAME`, or
`LOCKED_INTENTIONAL`.

## Composition is not a by-product

Author each hero frame around one clear visual owner.

Use hierarchy through:

- scale contrast;
- directional balance;
- negative space;
- foreground / midground / background separation;
- edge tension;
- asymmetry when useful;
- crop and occlusion;
- controlled density;
- local contrast pockets for type;
- camera placement that reinforces reading order.

Fail the composition when type, UI, and decoration compete at similar weight, when
important elements collide accidentally, or when the same centered arrangement is
reused across consecutive beats.

Use `COMPOSITION_GATE=PASS|FAIL`.

## Kinetic typography must have depth

Kinetic type is not “words entering one after another.”

Build kinetic passages from differentiated motion roles. Depending on meaning, combine
at least three of these where appropriate:

- scale attack;
- crop/mask reveal;
- lateral replacement;
- tracking compression/expansion;
- overshoot or compression/release;
- directional blur tied to travel;
- foreground invasion;
- word-as-occluder;
- word-as-camera-target;
- word-as-transition-plane;
- semantic morph;
- hard interruption;
- type-to-product handoff;
- punctuation/final-word payoff;
- spatial depth/parallax between type layers.

Do not use one identical stagger, one easing family, one entry direction, or one
fade/slide/scale recipe for an entire kinetic section.

Typography may own the frame first and then physically or semantically cause the next
state. Use `KINETIC_GATE=PASS|FAIL`.

## Transition logic

Every meaningful transition should answer:

**CAUSE → ACTION → RESULT**

Prefer continuity through:

- element extraction;
- subject tracking;
- camera handoff;
- foreground occlusion;
- semantic line/path transformation;
- geometry match;
- type as mask/surface;
- environment traversal;
- product-world assembly;
- motivated hard cut.

Use at least two distinct transition logics in longer pieces. Repeating the same fade,
scale, or push-through everywhere is templated motion.

## Retention and pacing

Use **burst → breath → burst** rather than constant intensity.

Short-form motion should create expectation resets through changes in framing, density,
hierarchy, motion character, or spatial relationship. Stillness is allowed when it is
a deliberate comprehension or tension state.

## Speed ramps

Speed ramps are authored velocity changes, not timeline hacks.

Use attack → fast travel → settle where it improves an attention handoff. Keep seeking
deterministic and output FPS fixed. Do not use uncontrolled realtime springs, global
`timeScale()` tricks, frame skipping, or capture-FPS changes.

## Asset-only SFX

There are no voice-over rules in this skill.

SFX may only use actual files supplied by the user or already present under `assets/`.
Do not generate, synthesize, search for, scrape, or download SFX. If no suitable asset
exists, render without SFX.

SFX must remain subordinate to visual hierarchy and be placed deterministically on the
master timeline.

Use `SFX_MODE=ASSET_ONLY|NONE`.

## Reference-first direction

When research tools or supplied references exist, deconstruct references as systems:
composition, camera path, timing, hierarchy, transition cause, type behavior, and
surface language. Do not copy surface styling blindly.

A starter is architecture, never art direction. Replace its palette, type, copy,
composition, motion signature, camera path, and transition vocabulary from the brief.

## Final quality gates

A substantial piece cannot be `FINAL_VERIFIED` unless:

```text
SKILL_USAGE_GATE=PASS
CAMERA_GATE=PASS
COMPOSITION_GATE=PASS
KINETIC_GATE=PASS
ANTI_PPT_GATE=PASS
SFX_MODE=ASSET_ONLY|NONE
```

Actual rendered frames must be inspected. Syntax validity alone is not motion-design
quality.
