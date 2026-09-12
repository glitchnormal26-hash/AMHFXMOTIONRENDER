# Camera Motion Contract — Anti-Static Camera + Safe Framing + Speed Ramp

This module is mandatory whenever a brief contains cinematic motion, camera travel,
tracking, follow shots, drag/drop journeys, spatial explainers, product traversal,
2.5D, 3D, fast-paced kinetic transitions, or any composition where camera movement can
crop required content.

The camera is part of the storytelling system. Moving objects inside a fixed frame
is **not** camera movement. Camera energy is also never a license to lose information.

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
#viewport-fit  ← fixed composition fit only
└── #camera    ← authored x/y/scale/rotation
    └── #world ← world-space UI, objects, type, backgrounds
```

Camera-equivalent motion belongs on `#camera` (or a dedicated camera rig), not on
`#viewport-fit` when that node is responsible for fitting the composition to the
browser viewport.

Viewport fit and authored camera movement must be separate transforms.

For Three.js/R3F, animate the real render camera or a parent camera rig. Do not move
only the subject and describe that as a camera move.

## 4. Safe-frame containment hard gate

Every readable beat must declare which element or rectangle is the **attention owner**.
That owner must remain inside the camera-space safe frame at the inspected time.

Default margins for portrait 9:16 work are:

```text
left/right ≈ 7% of stage width
top        ≈ 5% of stage height
bottom     ≈ 8% of stage height
```

At 1080×1920 this is approximately:

```text
left/right 76 px
top        96 px
bottom     154 px
```

Use stricter platform-safe margins when captions, UI chrome, a notch, buttons, or
navigation overlays consume additional space.

### Readable landing rule

A readable landing, CTA, proof/comprehension frame, product inspection frame, hero
word, UI card, character close-up, or brand lockup **fails** if any required portion
is cut by the viewport or pushed outside the safe frame.

Intentional clipping is allowed only as a transient transition gesture, for example a
push-through, foreground wipe, type-as-occluder, or high-speed chase. The move must
settle into a safe readable frame before the viewer is expected to parse information.

### Derive scale from bounds

When a whole target must remain visible, derive zoom from the target rectangle instead
of choosing scale by eye.

Given a target world rectangle `(x, y, width, height)` and safe margins:

```text
safeWidth  = stageWidth  - safeLeft - safeRight
safeHeight = stageHeight - safeTop  - safeBottom
fitScale   = min(safeWidth / width, safeHeight / height)
```

Clamp the chosen scale to any artistic min/max scale, then translate the rig so the
target center lands at the safe-frame center. `runtime/camera-rig.js::frameRect()`
implements this deterministic pattern.

For large typography, use the actual readable word/block bounds, not merely the
containing world section if the type itself can overhang.

## 5. Camera follow grammar

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

## 6. Follow lag and damping

Tracking should not feel welded to the subject unless the style explicitly requires
it. Prefer small authored lag:

- fast digital UI: roughly 1–3 frames of perceptual lag;
- tactile/product motion: roughly 2–5 frames;
- heavier cinematic move: roughly 4–8 frames plus a soft settle.

Lag must remain deterministic. Derive it from authored timeline state, keyed offsets,
or pure functions of master time. Do not use realtime spring integration in the final
capture path unless the spring state is analytically reproducible when seeking.

## 7. Camera cut / overlap hard gate

A hard camera reset is not a magic cancellation boundary.

With timeline systems such as GSAP, a `.set()` placed inside the time range of an
already-running camera tween does **not** guarantee that the older tween stops writing
x/y/scale/rotation after the set time. The previous tween may continue and pull the
camera away from the intended cut frame.

Therefore:

- never overlap camera x/y/scale/rotation tweens unless the overlap is a deliberately
  authored continuous blend on separate properties;
- before a hard cut/reset at time `t`, every previous camera transform tween must end
  no later than `t`;
- after a hard cut, start the next camera move at or after the cut time from the known
  cut state;
- if a move must continue across a transition, author it as one continuous camera move
  rather than tween → `.set()` → unfinished prior tween;
- use `camera.cutSafe()` when possible; it tracks the camera busy interval and throws
  when a requested hard cut overlaps an earlier camera move;
- in hand-authored GSAP timelines, write down camera move intervals and check them as
  part of QA.

This gate prevents the classic symptom where a scene appears correctly positioned in
source code but later frames are shifted, exposing a black stage edge or clipping text.

## 8. Speed-ramp contract

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

## 9. Deterministic implementation

Speed ramps must remain functions of authored master time.

Preferred options:

- GSAP keyframes with explicit durations/eases;
- piecewise interpolation from master time;
- authored camera state keyframes sampled by `seek(t)`;
- a distance/progress proxy whose value is tweened by the master timeline.

Keep audio, VO, SFX, object state, and camera on the same master clock.

For final render, never implement the ramp by changing capture FPS or by skipping
frames. The output cadence remains fixed; the **authored motion velocity** changes.

## 10. Typography safety under moving camera

Anti-static camera does not override readability.

When typography owns the frame:

- keep text inside a camera-space safe region;
- move supporting objects behind, outside, or around the type lane;
- do not allow a camera follow target to drag unrelated objects across hero text;
- if the camera crosses large type, use the type intentionally as an occluder or
  transition plane;
- verify actual rendered frames at the fastest portion of the ramp, not only the
  landing frame;
- inspect glyph overhangs, strokes, shadows, and outline text; visual bounds can extend
  beyond the nominal CSS box;
- final CTA and proof typography must pass safe-frame containment without depending on
  hidden overflow.

## 11. Automated framing audit

Browser-authored scenes may expose `window.OPENER.FRAME_AUDIT` as an array of checks:

```js
window.OPENER.FRAME_AUDIT = [
  { time: 0.65, selectors: ['#hook'], safe: { left: 76, right: 76, top: 96, bottom: 154 } },
  { time: 15.90, selectors: ['#cta .cta-title', '#cta .folder', '#cta .cta-button'] }
];
```

Run:

```bash
INDEX=assets/scene.html WIDTH=1080 HEIGHT=1920 npm run audit:framing
```

The audit seeks the deterministic master timeline, reads `getBoundingClientRect()` for
each required selector, and fails if a required target crosses the configured safe
margins. It complements, not replaces, visual review.

## 12. Camera activity QA

Before `FINAL_VERIFIED`, inspect camera activity and containment at key beats.

Required checks for substantial fast-paced work:

- opening framing state;
- first focus transfer;
- fastest speed-ramp midpoint;
- camera landing after the ramp;
- one subject-follow or handoff moment when a moving hero exists;
- proof/comprehension frame;
- final CTA/product framing;
- safe-frame containment of each readable attention owner;
- camera tween interval overlap around every hard cut/reset.

Fail QA when:

- the frame is visually locked for most of the piece without authored justification;
- all energy comes from object transforms inside a static viewport;
- camera travel is claimed but only the subject moves;
- the speed ramp has no readable acceleration/deceleration consequence;
- typography collides with or is obscured by world objects during camera travel;
- camera movement creates accidental edge clipping or exposes empty stage regions;
- a readable target leaves the safe frame;
- a hard camera reset overlaps a still-running camera transform tween;
- a CTA/proof/product landing contains truncated words, cards, buttons, or brand marks.

Recommended production labels:

```text
CAMERA_GATE = PASS | FAIL
CAMERA_FRAME_GATE = PASS | FAIL
CAMERA_OVERLAP_GATE = PASS | FAIL
CAMERA_MODE = MOVING | TRACKING | REFRAME | LOCKED_INTENTIONAL
CAMERA_ACTIVITY = ACTIVE_DEFAULT | LOCKED_FOR_REASON
SPEED_RAMP = ACTIVE | NOT_REQUIRED | FAIL
CAMERA_FOLLOW = USED | NOT_REQUIRED | FAIL
```

`FINAL_VERIFIED` requires all triggered camera gates to pass.
