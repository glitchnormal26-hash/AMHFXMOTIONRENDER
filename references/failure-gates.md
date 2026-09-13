# Failure Gates — Playback-First Motion QA

This module exists to reject technically-correct motion that still feels generic,
under-directed, weak in composition, or unconvincing during real playback.

It is mandatory for substantial samples, demos, product films, kinetic pieces, and
short-form motion before `FINAL_VERIFIED`.

## 1. Playback is the authority

Contact sheets are necessary but not sufficient. A sequence may look acceptable in
isolated frames and still fail in motion.

Before final approval, watch the actual encoded video from start to finish at normal
speed. Also inspect difficult transitions at reduced speed when useful.

Reject the piece when playback reveals:

- camera movement with no perceptible change in understanding;
- repeated identical velocity/easing signatures;
- long stretches where the hero becomes visually insignificant;
- transitions that feel like one card disappearing and another card loading;
- kinetic type that reads as basic entrance animation rather than authored behavior;
- rhythm that is uniformly smooth with no anticipation, attack, impact, or settle;
- a final payoff that has less visual authority than the build-up.

Use `PLAYBACK_GATE=PASS|FAIL`.

## 2. Hero occupancy and visual authority gate

The attention owner must have enough screen authority for the viewer to track it.

For a short-form sequence, reject when the primary hero becomes tiny or visually weak
for a sustained interval without an explicit wide-shot reason.

Practical guidance for 16:9 short-form work:

- during chase, inspection, transformation, or handoff beats, the hero should normally
  occupy a clearly dominant region rather than reading as an icon floating in empty
  space;
- if the hero occupies less than roughly 6% of frame area for more than about 0.7 s,
  require a clear contextual reason such as a deliberate wide reveal;
- after a wide reveal, re-establish hero authority quickly through camera catch-up,
  foreground scale, contrast, occlusion, or supporting geometry;
- negative space must create tension, direction, contrast, or a landing zone. Empty
  space with no compositional role is a failure.

Use `HERO_AUTHORITY_GATE=PASS|FAIL`.

## 3. Camera energy-shape gate

Camera motion must have authored energy, not one generic smooth interpolation reused
throughout the piece.

Across a substantial 8–20 second sample, use at least two meaningfully different camera
energy signatures when camera is active, for example:

- anticipation → chase → impact → settle;
- slow inspection → sudden transfer → hard lock;
- lead → catch-up → overshoot → correction;
- pull-back reveal → short hold → push-through;
- lateral track → foreground occlusion → reframe.

Reject when:

- every camera move uses the same ease and similar duration;
- the camera follows at one constant perceptual distance;
- there is no readable acceleration/deceleration consequence;
- camera movement feels like a screensaver pan across a static canvas;
- the camera is active but the hero never gains or loses meaningful scale, depth,
  occlusion, or compositional weight.

Use `CAMERA_ENERGY_GATE=PASS|FAIL`.

## 4. Continuity-material gate

Continuity must be carried by visible material, not only by color, background, or a
thin connecting line.

At least one important element should persist, transform, transfer role, or physically
cause the next state across multiple beats.

Strong continuity carriers include:

- one hero object that changes role while remaining identifiable;
- a route/path that becomes UI structure, a mask, an edge, a chart, or a destination;
- typography that becomes geometry or a transition plane;
- a card/object that unfolds into the next environment;
- a cursor/handle that drags or assembles the next product state;
- light/material that transfers because of an interaction rather than remaining as a
  decorative background effect.

Reject when the next state could be replaced with a different screen without changing
the transition logic.

Use `CONTINUITY_MATERIAL_GATE=PASS|FAIL`.

## 5. Card-reset / anti-screen-swap gate

A product film fails when important beats behave like isolated cards or screens that
enter, hold, and leave independently.

Reject any two consecutive major beats when all are true:

1. the previous hero fades/slides/scales away;
2. the next hero appears from an unrelated location or hierarchy;
3. the camera/world relationship effectively resets;
4. no visible object, geometry, motion vector, mask, material, or semantic cause bridges
   the transition.

A persistent decorative route line alone does not automatically pass this gate. The
carrier must materially participate in the transformation.

Use `SCREEN_SWAP_GATE=PASS|FAIL`.

## 6. Kinetic causality gate

Kinetic typography must cause something.

For a kinetic-led short sample, require at least:

- one anticipation/compression event;
- one attack/impact event;
- one non-trivial replacement, mask, reflow, or semantic transform;
- one type event that directly changes camera framing, object state, or transition
  structure;
- one readable settle/lock.

Large type merely appearing, scaling, or sliding does not satisfy the gate.

Reject when typography can be removed without changing the choreography of the world.

Use `KINETIC_CAUSALITY_GATE=PASS|FAIL`.

## 7. Final-payoff authority gate

The ending must resolve the built energy rather than shrink away from it.

Reject when:

- the final state collapses into a small centered card after a large-scale sequence;
- the final hero has less contrast or spatial authority than the preceding beat;
- the payoff appears as a fresh screen instead of the result of the prior action;
- the final lock has no visual memory of the journey that created it.

Prefer a final state where the persistent hero, route, type, or transformed material
resolves into the payoff.

Use `PAYOFF_GATE=PASS|FAIL`.

## 8. SFX mix gate — asset-only

SFX sourcing remains asset-only. This section governs mix quality, not sourcing.

Reject when:

- any event audibly clips or hard-limits;
- one impact overwhelms the entire sequence without narrative justification;
- successive SFX have extreme level inconsistency;
- every motion event receives a sound, creating constant sonic clutter;
- important impacts lack contrast because ambience or tails fill every gap.

For SFX-only short-form material, a useful starting safety region is roughly
`-24 to -18 LUFS integrated` with true peak normally at or below about `-3 dBTP`,
unless the delivery brief specifies otherwise. These are practical starting values,
not universal mastering laws.

Silence is an authored mix state.

Use `AUDIO_MIX_GATE=PASS|FAIL` when SFX are present.

## 9. Final verification matrix

For substantial short-form motion, `FINAL_VERIFIED` now requires all applicable gates:

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
SPEED_RAMP=ACTIVE|NOT_REQUIRED
CAMERA_FOLLOW=USED|NOT_REQUIRED
SFX_MODE=ASSET_ONLY|NONE
AUDIO_MIX_GATE=PASS|NOT_REQUIRED
```

If any required gate fails, the work remains `DRAFT` regardless of successful render,
encode, contact sheet, or syntactically correct motion code.
