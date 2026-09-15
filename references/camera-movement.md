# Camera Movement for Motion Design

Reference module for choreographing camera movement in Three.js + GSAP — built to sit alongside the AMHFX Motion Render pipeline (Three.js / GSAP / HTML / CSS, 16:9, 1080p export). Use it whenever the camera itself needs to move, not just objects on screen. The whole point of this module is the gap between "technically animated" and "reads as professional SaaS explainer" — that gap is almost entirely about *which* move you pick and *how it's eased*, not the move's complexity.

## Why this matters

A static camera with animated objects reads as a slideshow. A camera that moves with no motivation reads as generative "AI slop" — motion for motion's sake, usually because it's linear, constant, and never resolves. The fix is always the same: every camera move should (a) have a reason tied to the content beat, (b) ease in and settle instead of running at constant speed, and (c) stop — hold on a beat once it arrives, rather than drifting forever.

## The 9 core moves

Each entry: what it is, the feeling it creates, when to reach for it.

1. **Push In / Pull Out** — camera moves along its own forward axis toward or away from the subject. Feeling: focus, emphasis, reveal (push in) or context, conclusion (pull out). Use for: highlighting a UI element, ending a sequence by pulling back to show the whole scene.
2. **Pan & Tilt** — camera rotates in place (Y for pan, X for tilt) without translating. Feeling: a look, a reveal of what's beside/above the subject. Use for: following text or a UI element that enters from off-frame.
3. **Orbit / Arc** — camera travels along a curve around a fixed lookAt point. Feeling: dimensionality, "look at this from all sides." Use for: showcasing a 3D product/icon. Overused, it's the single most common "AI slop" tell — cap it at 15–30° of arc for explainer work, not a full rotation.
4. **Truck & Pedestal** — camera translates sideways (truck) or vertically (pedestal) while facing the same direction, on a *pre-scripted* path. Feeling: parallel movement, a "walk past" feel. Use for: transitioning between scenes laid out side by side.
5. **Parallax Drift** — a slow truck or push combined with layered depth (background moves slower than foreground). Feeling: subtle, ambient, premium. Use for: idle/loop states, background loop footage.
6. **Crane / Rise** — camera moves vertically while also tilting to keep the subject framed. Feeling: reveal of scale, "the big picture." Use for: opening or closing shots.
7. **Whip Pan** — a fast rotation, typically motion-blurred, used as a transition rather than a shot. Feeling: energy, a hard cut disguised as movement. Use for: scene-to-scene transitions inside a single render.
8. **Micro-Drift** — a very small (1–3% of frame), slow, continuous position/rotation wobble. Feeling: "alive," removes the dead stillness of a locked-off CG camera. Use for: any held/static shot longer than ~2s — almost always worth adding at low amplitude.
9. **Follow / Tracking Shot** — camera position (and lookAt) is continuously tied to a *moving* subject's transform, instead of tweened on a fixed path. "Following" and "tracking" are used interchangeably for this in practice — both mean the camera keeps a moving element framed as it travels, as opposed to Truck (move #4), which is a scripted path that happens to look parallel but isn't actually reacting to anything. Feeling: momentum, "riding along with" the action. Use for: a UI card, icon, or product flying/sliding across the frame that the camera should keep near-centered instead of letting it exit frame.

## Easing & timing (this is what separates "AI slop" from professional)

- **Never animate a camera linearly.** Linear = robotic. Every move needs ease-in and ease-out.
- Preferred GSAP eases and the feel each gives:
  - `power2.inOut` — default, safe, neutral SaaS feel.
  - `power3.out` — snappier start, gentle settle; good for push-ins that need urgency.
  - `expo.inOut` — dramatic accel/decel; use sparingly, for hero moments only.
  - `sine.inOut` — the softest option; good for micro-drift and parallax loops.
- **Anticipation → move → settle.** For a deliberate move (push-in on a reveal), a tiny counter-move (pull back 2–3% before pushing in) reads as intentional rather than triggered. Don't overuse this — one or two moments per sequence, not every cut.
- **Typical durations for explainer beats:** 1.2–1.8s for a push/pull tied to a UI reveal, 2.5–4s for an establishing orbit or crane, 0.3–0.5s for a whip-pan transition.
- **Hold after arrival.** Once a move lands, give it 0.5–1s of stillness (or micro-drift only) before cutting or starting the next move — a camera that's still translating when the next beat starts reads as unfinished.
- Camera timing should support the content animation's timeline, not compete with it — stagger the camera start slightly behind or ahead of object reveals rather than starting both on frame 0.

## Implementation pattern: animating a Three.js camera with GSAP

The most common bug in this stack: animating `camera.position` with GSAP but never updating `camera.lookAt`, so the camera drifts off-target mid-move. Animate a plain JS object as the lookAt target and call `camera.lookAt()` every frame (or on each tween update) rather than trying to tween lookAt directly.

```js
// Setup
const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 100);
camera.position.set(0, 1.2, 6);
const lookTarget = { x: 0, y: 0, z: 0 }; // plain object, not a Vector3 tween target
camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);

function syncLookAt() {
  camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
}

// Push-in reveal on a hero object
const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
tl.to(camera.position, { z: 3.2, y: 0.8, duration: 1.6, onUpdate: syncLookAt })
  .to(lookTarget, { y: 0.2, duration: 1.6, onUpdate: syncLookAt }, "<") // parallel, same start
  .to({}, { duration: 0.6 }); // hold beat before next cut
```

```js
// Orbit reveal — capped arc, not a full spin
const radius = 6, startAngle = -0.35, endAngle = 0.35; // ~40° total arc
const state = { angle: startAngle };
gsap.to(state, {
  angle: endAngle,
  duration: 3,
  ease: "sine.inOut",
  onUpdate: () => {
    camera.position.x = Math.sin(state.angle) * radius;
    camera.position.z = Math.cos(state.angle) * radius;
    camera.lookAt(0, 0.4, 0);
  }
});
```

```js
// Parallax drift for a looping background beat
gsap.to(camera.position, {
  x: "+=0.15",
  duration: 6,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});
// Pair with a background layer moving at ~0.3x the foreground's speed
// to sell depth without the viewer consciously noticing camera motion.
```

```js
// Follow / tracking cam — camera stays near a moving target with a slight lag.
// The lag (damping < 1) is what makes it read as operator-driven rather than
// robotically snapped to the target every frame — zero damping is an AI-slop tell.
const target = movingObject; // a THREE.Object3D animated elsewhere, e.g. by its own GSAP tween
const offset = new THREE.Vector3(0, 1.5, 4); // camera sits behind/above the target
const desiredPos = new THREE.Vector3();
const damping = 0.08; // lower = more cinematic drift/lag, higher = tighter lock

function updateFollowCam() {
  desiredPos.copy(target.position).add(offset);
  camera.position.lerp(desiredPos, damping);
  camera.lookAt(target.position);
}
// Call updateFollowCam() inside your render loop (requestAnimationFrame), after
// gsap's ticker has applied the target's own tween for that frame, so the offset
// is always computed from the target's current — not stale — position.
```

## SaaS explainer style rules

- Amplitude stays small — think in single-digit percentages of frame width/depth, not dramatic swoops. The product/subject should barely notice the camera moved; the viewer should just feel more engaged.
- Pick one movement vocabulary per series (e.g., "every reveal is a push-in + 15% orbit") and reuse it — consistency across a batch of 10 concepts reads as a system, not 10 unrelated clips.
- For loop-friendly stock footage, prefer moves that can return to their start state (yoyo/repeat) or that are subtle enough that a hard loop cut isn't jarring — parallax drift and micro-drift are the safest choices for this.

## Green screen / chroma key–specific notes

- Keep the camera move small enough that it doesn't reveal matte edges around the keyed subject — extreme rotation or FOV change stresses edge detail that reads fine when static.
- Use parallax between a keyed foreground subject and a separately rendered background layer to sell depth in the composite — this is often more convincing than moving the "real" camera at all.
- Avoid combining a whip pan with a chroma key subject — fast motion blur on a matte edge is one of the most common keying artifacts.
- Match the background layer's perspective/FOV to whatever camera move you're implying for the foreground, or the composite will look like two flat planes rather than one space.

## Anti-pattern checklist (AI slop tells)

- Constant motion with no start/stop — nothing ever settles.
- Linear easing, or worse, no easing function specified at all.
- Full 360° or near-full orbits on every shot.
- Camera clipping through geometry mid-move (check near-plane distance against your smallest object).
- A move that never resolves before the next cut — the viewer never gets to actually look at anything.
- Every shot using the same single move (e.g., push-in on literally everything) — reads as a template, not direction.
- A follow/tracking cam with zero damping — locks perfectly and instantly to the target every frame, which reads as rigid/robotic rather than operator-driven.

## Quick reference

| Move | Feeling | Typical use |
|---|---|---|
| Push In / Pull Out | Focus / conclusion | Emphasis, closing shot |
| Pan & Tilt | A look, a reveal | Following an entering element |
| Orbit (capped arc) | Dimensionality | Showcasing a 3D product |
| Truck & Pedestal | Parallel movement | Scene-to-scene transition |
| Parallax Drift | Premium, ambient | Idle/loop states |
| Crane / Rise | Scale, big picture | Opening/closing shot |
| Whip Pan | Energy, hard cut | Transition only |
| Micro-Drift | Alive, not locked-off | Any held shot > 2s |
| Follow / Tracking | Momentum, riding along | Camera keeps a moving element in frame |

## Pre-export checklist

- Every move has an eased in/out, never linear.
- Every move lands and holds for ≥0.5s before the next cut.
- `camera.lookAt()` (or its update equivalent) is called on every frame the position/rotation is tweened — no drifting target.
- No shot holds a full unbroken orbit or spin.
- If a chroma key subject is present: no whip pans, and the move amplitude is checked against matte edge quality at final render resolution (1080p, 16:9).
- If a follow/tracking cam is used: damping is non-zero (no instant lock) and the offset is computed from the target's post-tween position each frame.
