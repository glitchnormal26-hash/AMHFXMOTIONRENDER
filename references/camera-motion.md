# Camera Motion Contract — Anti-Static Camera + Speed Ramp

This module is mandatory whenever a brief contains cinematic motion, camera travel,
tracking, follow shots, drag/drop journeys, spatial explainers, product traversal,
2.5D, 3D, or fast-paced kinetic transitions.

The camera is part of the storytelling system. Moving objects inside a fixed frame
is **not** camera movement.

## 1. Anti-static camera hard gate

For every substantial sequence, declare a camera state per semantic beat:

- `MOVING` — camera travels through the world.
- `TRACKING` — camera follows or leads a moving subject.
- `REFRAME` — camera changes crop/scale/position to transfer attention.
- `LOCKED_INTENTIONAL` — camera is deliberately static for contrast, comprehension,
  suspense, product inspection, or a clean typographic landing.

A substantial sequence **fails the camera gate** when all of these are true:

1. the world/stage framing stays materially unchanged across multiple semantic beats;
2. only subjects/cards/UI elements animate;
3. no explicit reason is recorded for a locked shot.

`LOCKED_INTENTIONAL` is an authored contrast state, never the default shortcut.

## 2. Minimum camera activity requirement

For fast-paced explainers, product films, kinetic ads, and spatial motion:

- every 2–4 seconds, either the camera must change framing meaningfully or the shot
  must explicitly enter `LOCKED_INTENTIONAL` for a readable hold;
- at least one major transition should be carried by camera/world motion instead of
  object opacity/slide alone;
- a drag, cursor journey, extracted hero object, or moving character should normally
  receive a follow/lead/reframe response when it is the attention owner;
- hero typography may become a camera target, transition plane, foreground wipe, or
  spatial landmark instead of sitting inside a fixed full-frame layout.

A change is meaningful when the viewer can perceive a different spatial relation,
not merely a 1–2 px decorative drift.

## 3. Camera rig architecture

For DOM/SVG/2.5D work, prefer:

```text
#stage
├── #world        ← camera-equivalent transform owner
│   ├── background
│   ├── product / UI / objects
│   └── typography that belongs in world space
├── lens-space FX
└── debug / safe-area overlays
```

Camera-equivalent motion belongs on `#world` (or a dedicated camera rig), not on
`#stage` when `#stage` is also responsible for viewport fitting.

Viewport fit and authored camera movement must be separate transforms.

Recommended nesting:

```text
#viewport-fit  ← fixed composition fit only
└── #camera    ← authored x/y/scale/rotation
    └── #world
```

For Three.js/R3F, animate the real render camera or a parent camera rig. Do not move
only the subject and describe that as a camera move.

## 4. Camera follow grammar

When the viewer's attention owner moves, choose one:

- **follow** — camera tracks the subject center with controlled lag;
- **lead** — camera looks ahead of the subject to create anticipation;
- **catch-up** — subject moves first, camera accelerates after it;
- **handoff** — camera transfers from subject A to subject B without resetting world
  orientation;
- **push-through** — camera advances into or through a visible object/word/UI region;
- **pull-back reveal** — camera retreats to expose the larger system or final payoff;
- **orbit/reframe** — only when depth or spatial relationship benefits from it.

For cursor/drag interactions, follow the moving object or cursor during the important
part of the journey, then settle on the drop target. Avoid watching a long drag from
a completely fixed wide shot unless the wide framing is the point.

## 5. Follow lag and damping

Tracking should not feel welded to the subject unless the style explicitly requires
it. Prefer small authored lag:

- fast digital UI: roughly 1–3 frames of perceptual lag;
- tactile/product motion: roughly 2–5 frames;
- heavier cinematic move: roughly 4–8 frames plus a soft settle.

Lag must remain deterministic. Derive it from authored timeline state, keyed offsets,
or pure functions of master time. Do not use realtime spring integration in the final
capture path unless the spring state is analytically reproducible when seeking.

## 6. Speed-ramp contract

A speed ramp is an intentional change in velocity through a single movement or
transition. It should create an energy handoff, not merely make the timeline faster.

Use speed ramps for:

- cursor/object pickup → drag acceleration → precise drop;
- kinetic word hit → camera chase → product landing;
- push-through transitions;
- rapid traversal into a detail followed by a readable settle;
- exiting a comprehension hold and entering the next high-energy beat;
- final pull-back or punch-in payoff.

### Default shape

A practical camera speed ramp usually has three phases:

1. **attack** — short acceleration / anticipation release;
2. **travel** — fastest portion of the move;
3. **settle** — deceleration into readable framing.

Typical proportion ranges:

```text
attack  12–25%
travel  45–68%
settle  18–35%
```

These are starting ranges, not presets.

### Avoid

- identical fast-slow ramps on every transition;
- constant high speed with no readable landing;
- speed ramps that move supporting objects faster than the attention owner;
- ramps that make typography unreadable;
- using `timeScale()` as an uncontrolled global trick that desynchronizes VO/audio;
- realtime velocity accumulation that breaks deterministic seeking.

## 7. Deterministic implementation

Speed ramps must remain functions of authored master time.

Preferred options:

- GSAP keyframes with explicit durations/eases;
- piecewise interpolation from master time;
- authored camera state keyframes sampled by `seek(t)`;
- a distance/progress proxy whose value is tweened by the master timeline.

Keep audio, VO, SFX, object state, and camera on the same master clock.

For final render, never implement the ramp by changing capture FPS or by skipping
frames. The output cadence remains fixed; the **authored motion velocity** changes.

## 8. Typography safety under moving camera

Anti-static camera does not override readability.

When typography owns the frame:

- keep text inside a camera-space safe region;
- move supporting objects behind, outside, or around the type lane;
- do not allow a camera follow target to drag unrelated objects across hero text;
- if the camera crosses large type, use the type intentionally as an occluder or
  transition plane;
- verify actual rendered frames at the fastest portion of the ramp, not only the
  landing frame.

## 9. Camera activity QA

Before `FINAL_VERIFIED`, inspect camera activity at key beats.

Required checks for substantial fast-paced work:

- opening framing state;
- first focus transfer;
- fastest speed-ramp midpoint;
- camera landing after the ramp;
- one subject-follow or handoff moment when a moving hero exists;
- final framing / payoff.

Fail QA when:

- the frame is visually locked for most of the piece without authored justification;
- all energy comes from object transforms inside a static viewport;
- camera travel is claimed but only the subject moves;
- the speed ramp has no readable acceleration/deceleration consequence;
- typography collides with or is obscured by world objects during camera travel;
- camera movement creates accidental edge clipping or exposes empty stage regions.

Recommended production labels:

```text
CAMERA_GATE = PASS | FAIL
CAMERA_MODE = MOVING | TRACKING | REFRAME | LOCKED_INTENTIONAL
CAMERA_ACTIVITY = ACTIVE_DEFAULT | LOCKED_FOR_REASON
SPEED_RAMP = ACTIVE | NOT_REQUIRED | FAIL
CAMERA_FOLLOW = USED | NOT_REQUIRED | FAIL
```

`FINAL_VERIFIED` requires `CAMERA_GATE=PASS` whenever this module is triggered.
