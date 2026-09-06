
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

### Pedestal / Vertical Move

Use when vertical hierarchy or stacked information is conceptually relevant.

### Orbit

Use only when rotation around the subject reveals geometry, relationship, or material behavior.

Do not use a generic orbit as ambient decoration.

### Arc / Curved Move

Use when a curved path preserves attention while changing angle or depth.

### Whip / Fast Reframe

Use selectively for:

- abrupt attention reset
- energetic cut bridge
- sound-led transition

The next composition must be readable immediately after the whip.

### Macro-to-Wide / Detail-to-System

Use when the narrative moves from:

- detail → context
- data point → workflow
- UI microstate → whole product
- node → network

This is often more meaningful than arbitrary zooming.

## 9.5.2.5 Camera Motion Contract — Direction Must Become Motion

Camera direction is not complete until it becomes an evaluated transform over time.

For every substantial cinematic / spatial / 3D shot, explicitly declare one camera mode:

- `MOVING` — authored camera translation / rotation / lens travel between designed poses
- `TRACKING` — camera response is coupled to a moving subject or target
- `REFRAME` — camera changes framing, orientation, target, lens, or screen-space relationship without requiring long travel
- `LOCKED_INTENTIONAL` — camera remains static because stillness is the designed blocking decision

`LOCKED_INTENTIONAL` is never the implicit fallback for a shot whose direction describes a push, pull, truck, pedestal, orbit, arc, whip, track, parallax traversal, macro-to-wide move, or other camera event.

For `MOVING`, `TRACKING`, or `REFRAME`, define at minimum:

**START CAMERA STATE**
- position or rig position
- orientation / quaternion or look target
- FOV / zoom when relevant
- screen-space framing intention

**END / LANDING CAMERA STATE**
- position or rig position
- orientation / quaternion or look target
- FOV / zoom when relevant
- final screen-space framing intention

**TIMING**
- start time / frame
- end time / frame
- easing or damping behavior
- hold / settle duration

At least one render-relevant camera property must change over the interval. A written instruction such as “camera pushes in,” “camera trucks with the card,” or “camera enters the network” is a failed implementation if the actual camera / camera rig evaluates to the same transform throughout the shot.

### Implementation Binding Rule

In Three.js / React Three Fiber / programmatic render systems:

- bind the authored move to the actual render camera or to a camera rig that owns the render camera
- derive authored camera state from the project master time / frame authority when deterministic capture is required
- do not leave `<PerspectiveCamera position={...} />` as a one-time static declaration when the shot direction calls for camera motion
- do not animate only the subject while describing the result as a camera move
- do not calculate camera key poses without applying them during playback / frame evaluation
- do not let a control system, default camera, helper, or later `lookAt()` overwrite the authored transform every frame
- verify which camera is actually active in the renderer when multiple cameras or rigs exist

A valid implementation should conceptually behave like:

**MASTER TIME → CAMERA SHOT STATE → POSITION / ORIENTATION / TARGET / FOV EVALUATION → ACTIVE RENDER CAMERA → FRAME**

not:

**CAMERA DIRECTION TEXT → STATIC CAMERA COMPONENT → OBJECTS MOVE AROUND IT**

### Visible Camera Consequence Rule

Numerical camera change alone is not enough. The move should produce an observable screen-space consequence in at least one of these:

- foreground / background parallax
- hero scale or perspective change
- subject screen-space position
- occlusion relationship
- revealed information
- depth separation
- framing / crop relationship
- vanishing / perspective relationship
- transition into the next spatial state

If camera and subject move together so perfectly that the frame remains visually unchanged, the implementation may be technically animated but perceptually static. Preserve intentional stabilization only when stabilization itself is the design goal.

## 9.5.3 Camera Blocking

Plan camera positions as designed poses, not continuous wandering.

For substantial shots, define:

1. start composition
2. anticipation or directional cue
3. travel or transformation
4. landing composition
5. readable hold

The start and end states should work as still frames.

Camera blocking is not finished when only those still poses exist. For any non-locked camera mode, implement and inspect the time-varying path between them.

Do not let the camera drift between poses without purpose.

## 9.5.4 Camera Direction Continuity

Across cuts or transitions, preserve or intentionally break screen direction.

Check:

- left-to-right vs right-to-left movement
- incoming / outgoing vector
- subject screen position
- perceived camera travel
- depth direction

If direction changes abruptly, make the interruption intentional through sound, cut, impact, or composition.


## 9.5.5 Subject-Aware Camera Tracking & Scene Handoff

Camera tracking is not merely keeping an object centered.

Use tracking when an existing hero element is moving through space and the camera can preserve its identity, reveal new context, or physically carry attention into the next scene.

The preferred tracking model is:

**TARGET → FRAMING RULE → RESPONSE → LOOK-AHEAD / LAG → HANDOFF → SETTLE**

### Tracking Target Ownership

At every tracking moment, define one primary target.

The target may be:

- a UI element extracted from a product state
- a 2D graphic promoted into spatial depth
- a 3D node, card, device, icon, or object
- a cluster whose internal relationship must remain readable
- a moving light, line, or path only when it represents meaningful information

Do not let the camera ambiguously track several unrelated moving objects.

When target ownership changes, make the transfer readable.

### Screen-Space Framing Rule

Define where the tracked subject should live in screen space.

Possible framing intentions:

- center lock — useful for direct inspection or symmetrical hero moments
- left / right third — useful when preserving look-ahead space
