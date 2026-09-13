# Camera Motion Contract — Authored Framing, Follow & Speed Ramp

This module is mandatory for every substantial motion piece unless the concept is
explicitly a locked-camera composition.

The camera is part of the storytelling system. Moving objects inside a fixed frame is
**not** camera movement.

## 1. Hard camera gate

For every semantic beat, declare one state:

- `MOVING` — camera/world rig travels through space;
- `TRACKING` — camera follows or leads the attention owner;
- `REFRAME` — crop/scale/position/perspective changes to transfer attention;
- `LOCKED_INTENTIONAL` — deliberate static hold for contrast, comprehension, tension,
  inspection, or a clean landing.

A sequence fails when the frame remains materially unchanged across multiple beats and
all perceived energy comes from objects moving inside it.

For roughly 8–20 second social/product films, target at least **three visibly distinct
framing states** unless a locked shot is the concept. The states must create different
spatial relationships through position, scale/FOV, crop, perspective, depth, target,
or occlusion.

Decorative 1–2 px drift, generic camera breathing, or scaling the hero alone does not
count.

## 2. Camera must follow attention

When the attention owner moves, choose an authored response:

- **follow** — track with controlled lag;
- **lead** — frame ahead of the subject to create anticipation;
- **catch-up** — subject moves first, camera accelerates after it;
- **handoff** — transfer from subject A to B without resetting orientation;
- **push-through** — advance into/through a visible object, word, or UI region;
- **pull-back reveal** — retreat to expose the larger system;
- **orbit/reframe** — only when depth/spatial relation benefits from it.

Long cursor drags, extracted objects, characters, or hero UI journeys should not be
watched from a fixed wide shot by default.

## 3. Camera rhythm

For fast-paced product/social work:

- change framing meaningfully every 2–4 seconds, or enter a short
  `LOCKED_INTENTIONAL` hold;
- use at least one camera/world-driven transition rather than object opacity/slide only;
- avoid repeating the same push-in/pull-out pattern at every cut;
- use burst → breath → burst: travel, settle, read, then move again;
- let the next camera move be caused by the current attention owner whenever possible.

## 4. Camera rig architecture

For DOM/SVG/2.5D:

```text
#viewport-fit  ← fixed fit only
└── #camera    ← authored x/y/scale/rotation/perspective behavior
    └── #world ← background, UI, objects, world-space type
```

Do not animate the viewport-fit transform as the authored camera.

For Three.js/R3F, animate the real render camera or a dedicated parent rig. Do not move
only the subject and call it a camera move.

## 5. Follow lag

Tracking should not feel welded to the subject unless intentional.

Starting ranges:

- fast digital UI: 1–3 frames perceptual lag;
- tactile/product motion: 2–5 frames;
- heavier cinematic move: 4–8 frames plus a soft settle.

Lag must remain deterministic and seekable.

## 6. Speed-ramp contract

A speed ramp is an intentional velocity change through one movement or transition.
Use it as an energy handoff, not as a repeated preset.

Preferred shape:

1. **attack** — anticipation release / acceleration;
2. **travel** — fastest portion;
3. **settle** — deceleration into readable framing.

Starting proportions:

```text
attack  12–25%
travel  45–68%
settle  18–35%
```

Avoid identical fast-slow ramps on every transition, constant high speed, unreadable
landings, global `timeScale()` hacks, realtime velocity accumulation, capture-FPS
changes, or frame skipping.

## 7. Deterministic implementation

Preferred options:

- GSAP keyframes with explicit durations/eases;
- piecewise interpolation from master time;
- authored camera state keyframes sampled by `seek(t)`;
- a distance/progress proxy tweened by the master timeline.

Output cadence remains fixed. Authored motion velocity changes; capture does not.

## 8. Composition safety under camera movement

A camera move that destroys composition is a failed move.

During each major transfer:

- keep one clear attention owner;
- protect type with camera-space safe lanes;
- avoid accidental tangent/collision with UI or frame edges;
- preserve deliberate negative space;
- do not expose dead stage regions;
- use foreground/background parallax only when it strengthens depth and hierarchy;
- inspect the transition midpoint, not only the landing.

## 9. Camera QA

Before `FINAL_VERIFIED`, inspect:

- opening framing;
- first focus transfer;
- fastest ramp midpoint;
- ramp landing;
- one subject follow/handoff when applicable;
- final framing.

Fail when:

- the frame is locked for most of the piece without authored justification;
- only subjects move;
- claimed camera travel has no visible rendered consequence;
- acceleration/deceleration is imperceptible;
- type becomes unreadable during travel;
- camera exposes empty stage edges;
- camera causes accidental collisions or weakens hierarchy;
- multiple consecutive beats share effectively the same framing.

Required labels:

```text
CAMERA_GATE = PASS | FAIL
CAMERA_MODE = MOVING | TRACKING | REFRAME | LOCKED_INTENTIONAL
CAMERA_ACTIVITY = ACTIVE_DEFAULT | LOCKED_FOR_REASON
SPEED_RAMP = ACTIVE | NOT_REQUIRED | FAIL
CAMERA_FOLLOW = USED | NOT_REQUIRED | FAIL
```

`FINAL_VERIFIED` requires `CAMERA_GATE=PASS` for substantial motion.
