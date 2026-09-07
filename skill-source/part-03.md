Hierarchy should not feel polite.

The viewer should immediately feel **what dominates, what interrupts, what supports, and what disappears.**

Do not distribute attention evenly.

Create deliberate imbalance.

## 1. HERO — Dominant Gesture

Every scene should have one primary visual event.

The hero may be:

- oversized kinetic typography
- aggressive scale shift
- hard crop
- frame invasion
- illustration transformation
- variable-font change
- sudden spatial displacement
- graphic object behaving with physical weight
- perspective change

Think approximately **70–80% of visual attention** on the hero during its peak.

Do not make the hero only slightly more visible than everything else.

## 2. INTERRUPT — Tension Layer

Use selective interruption to disturb expected rhythm.

Examples:

- text briefly breaking the grid
- object entering from an uncomfortable edge
- counter-motion
- abrupt tracking compression
- 2–4 frame alternate composition
- hard cut between extreme scale states
- foreground object temporarily occluding information
- SFX arriving before the visual event

Interruption should feel intentional, not random.

## 3. SUPPORT — Choreography Layer

Supporting elements should react to the hero rather than animate independently.

Possible behaviors:

- delayed follow-through
- counter-motion
- staggered typography
- shadow or texture response
- baseline shift
- parallax
- layout snap
- small illustration reaction

Secondary motion should usually arrive after the eye has already found the hero.

## 4. TEXTURE — Character Layer

Use ambient motion to add authored texture.

Favor:

- grain fluctuation
- photocopy texture
- imperfect masks
- hand-made marks
- subtle frame jitter
- paper / print behavior
- restrained analog noise
- organic deformation

Avoid generic particles, glow, floating gradients, or perpetual camera drift unless justified.

## 5. VOID — Intentional Stillness

Stillness is part of hierarchy.

Use:

- abrupt holds
- empty frames
- isolated typography
- negative space
- silence
- motion freezing after impact

Edgy means **controlled disruption**, not visual confusion.

---

# 7. Timing and Spacing

Timing is the first place to look when motion feels wrong.

Think in:

- frames for video
- milliseconds for UI
- transient groups, SFX clusters, and silence windows for sound rhythm
- words, syllables, stress, and pauses for VO

At 30 fps:

- 1 frame ≈ 33 ms
- 3 frames ≈ 100 ms
- 6 frames ≈ 200 ms
- 9 frames ≈ 300 ms
- 15 frames ≈ 500 ms
- 30 frames = 1 second

At 24 fps, allow important poses to read.

At 60 fps, design in time first, then convert to frames.

## Rhythm

Good motion contains contrast:

- fast vs slow
- action vs pause
- dense vs quiet
- large vs small
- synchronized vs offset
- visual hit vs audio hit

Do not animate every event at the same cadence.

## Stagger

Use stagger to establish hierarchy and rhythm.

Typical starting points:

- subtle UI/list cascade: 20–50 ms
- standard graphic stagger: 50–100 ms
- dramatic typography: 80–180 ms

For frame-based work, think in 1–4 frame offsets first.

Avoid long stagger chains.

Lead with the most important element unless suspense requires otherwise.

---

# 8. Easing and Velocity

Never default to linear interpolation for expressive spatial movement.

Use linear motion primarily when constant velocity is conceptually correct:

- continuous rotation
- scanning
- conveyor motion
- progress
- mechanical loops

General logic:

- **entrance** → fast departure, controlled landing
- **exit** → controlled departure, faster finish
- **reposition** → smooth acceleration and deceleration
- **impact** → fast approach, brief compression, controlled settle
- **ambient loop** → seamless velocity at loop boundaries
- **edgy snap** → sharp acceleration, very short settle, minimal bounce

Use overshoot only when it communicates:

- elasticity
- energy
- playfulness
- impact
- spring-like material

Do not add bounce to every animation.

## Weight

Heavy elements:

- take longer to start or settle
- use less overshoot
- feel better with smoother acceleration
- often need lower, heavier SFX

Light elements:

- react quickly
- tolerate sharper changes
- can use modest overshoot
- can pair with shorter, brighter SFX

The Graph Editor, velocity curve, or equivalent is a primary design tool.

---

# 9. Perspective Without 3D

Do not reach for 3D merely to create spatial interest.

Create depth and perspective using 2D / 2.5D techniques.

## Forced Scale

Use strong layer relationships.

Starting reference:

- foreground: 120–180%
- midground: 80–120%
- background: 40–80%

These are not rigid values.

Allow elements to cross between perceived layers.

## Planar Perspective

Distort flat graphics intentionally using:

- skew
- corner pin
- perspective warp
- non-uniform scale
- angled masks
- diagonal trajectories

The goal is spatial energy, not photorealism.

## Foreground Wipes

Let an object temporarily cover much of the frame.

Examples:

- hand
- phone
- paper
- text
- icon
- illustration component
- graphic shape

Use the obstruction to transition.

Prefer:

**object crosses → frame is obscured → next scene appears behind it**

instead of automatic fade transitions.

## Push / Pull

Create implied camera movement by coordinating:

- foreground scale
- background scale
- position
- crop
- blur
- spacing

No 3D camera is required.

## Perspective Shift as Attention Reset

Change perspective when:

- the viewer has already understood the frame
- a new subject becomes important
- VO changes topic
- a reveal needs stronger impact
- a transition needs spatial logic

Do not wobble perspective continuously.

---

# 9.5 Cinematic 3D & Camera Direction

Cinematic motion is primarily **attention direction through framing, blocking, lens behavior, depth, timing, and light**.

Do not define cinematic quality by the amount of camera movement.

A camera move must have a narrative or compositional reason.

## 9.5.1 Camera Motivation

Use camera movement to do at least one of these:

- reveal information
- change hierarchy
- establish scale
- connect spatial layers
- follow an action
- create anticipation
- resolve a visual question
- expose hidden geometry
- transition from abstract system to concrete product state
- move attention from one subject to another

Do not move the camera merely because the scene would otherwise be static.

Do not interpret this rule as a preference for static cameras. In a brief that calls for cinematic, spatial, 3D, tracking, parallax, or camera-driven motion, authored camera movement is expected unless the shot is explicitly blocked as `LOCKED_INTENTIONAL`. A static camera must be a deliberate composition decision, not the accidental result of missing animation implementation.

If the camera move reveals nothing, changes no relationship, and creates no emotional effect, remove it or replace it with a better motivated move. Do not silently fall back to a static camera when the shot direction specifies camera travel.

## 9.5.2 Camera Vocabulary

Choose a small camera vocabulary for the piece.

### Dolly / Push In

Use to:

- increase importance
- reduce emotional distance
- enter a system or interface
- create anticipation before a reveal

Avoid continuous slow push-ins on every shot.

### Pull Out / Reveal

Use to:

- reveal context
- show that one element belongs to a larger system
- transform an abstract detail into a product overview

A pull-out should reveal something meaningful.

### Truck / Lateral Move

Use to:

- connect adjacent subjects
- maintain directional continuity
- reveal information hidden behind foreground layers
- create parallax without excessive rotation
