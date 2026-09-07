
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
- edge-biased framing — useful for tension, reveal, or imminent occlusion
- vertical bias — useful when the scene contains stacked systems or directional ascent / descent
- intentionally drifting anchor — useful when the subject itself should create compositional tension before the camera responds

Do not automatically center every tracked object.

### Dead Zone & Response

Allow the subject to move inside a controlled screen-space region before the camera reacts when a looser, more authored follow is desired.

A dead zone may create:

- perceived mass
- delayed pursuit
- stronger foreground parallax
- anticipation before a camera correction
- less robotic motion than one-to-one target locking

For precise technical motion, a tighter lock may be appropriate.

Choose the response intentionally:

- **locked** — camera follows almost immediately
- **smooth** — camera follows with controlled damping
- **heavy** — camera starts later and settles more slowly
- **lead** — camera gives additional space in the subject's travel direction
- **lag** — subject pulls camera behind it before the frame catches up
- **snap reframe** — camera waits, then rapidly establishes a new framing pose

Do not use springy tracking merely because interpolation makes it easy.

### Velocity Look-Ahead

When useful, bias framing toward the subject's movement vector.

The camera may reveal space before the subject reaches it so the viewer anticipates where the action is going.

Reduce look-ahead before a stop, reversal, or impact so the landing composition does not feel accidentally off-center.

### Depth Tracking

Tracking may include Z-depth, not only X/Y follow.

Use push / pull behavior when:

- a 2D element gains depth and becomes a 3D object
- a foreground element approaches camera to create occlusion
- a small UI state expands into a larger spatial system
- the viewer should move from detail into context or context into detail

Do not mechanically match the subject's Z movement if doing so destroys scale perception.

Sometimes the stronger choice is to let the subject approach while the camera resists, increasing apparent scale and parallax.

### Orientation & Horizon Behavior

Decide whether the camera tracks subject rotation.

Options include:

- stable horizon while the subject rotates
- partial rotational follow
- full orientation follow for intentional POV-like movement
- orbit around the subject while preserving its screen-space anchor

Preserve readability of UI, typography, and recognizable surfaces.

Avoid accidental horizon roll.

### Target Transfer

When attention moves from object A to object B, define the transfer cause.

Useful transfer cues:

- A physically contacts or activates B
- A passes behind B and B becomes the new foreground hero
- A transforms into B
- a line, light path, or motion vector connects A to B
- A exits through occlusion and B inherits its screen position or velocity
- sound anticipates B before the visual tracking target switches

Do not switch camera targets invisibly while both subjects remain equally plausible.

### Occlusion & Reacquisition

An extracted hero may temporarily leave sight behind foreground geometry or fill the frame completely.

Use occlusion as a handoff opportunity.

Possible pattern:

**track target → target approaches foreground → frame becomes obscured → scene state changes behind occlusion → target or descendant form is reacquired → camera settles**

If the tracked element disappears permanently during occlusion, preserve at least one continuity property such as:

- motion vector
- screen position
- shape
- scale direction
- light behavior
- material cue
- sound tail
- semantic role

### Tracking-to-Transition Handoff

Camera motion itself may become part of the transition.

Whenever possible, preserve one or more of:

- outgoing camera velocity
- subject velocity
- screen-space anchor
- depth direction
- parallax direction
- lens character
- foreground travel direction

The next scene should feel discovered by the camera rather than loaded after the camera move.

Example:

**UI node detaches → gains depth → camera trucks with slight lag → node moves toward foreground → node occludes frame → camera continues the same vector through the occlusion → node resolves as a larger system component in the next scene → camera eases into a readable landing**

Avoid:

**track object → stop camera → hide everything → load unrelated scene → begin a new camera move**

That breaks spatial causality.

### Tracking Failure Modes

Avoid:

- perfect center-lock on every moving subject
- camera and subject starting and stopping on identical frames without reason
- constant catch-up oscillation
- excessive rotational tracking that makes UI unreadable
- target switching without a visible cause
- following an object that is no longer narratively important
- camera movement that cancels all useful object motion


## 9.5.6 Parallax Environment Traversal & World-to-World Camera Travel

Parallax is not merely a depth effect.

Use parallax as a transition mechanism when foreground, midground, and background relationships can physically guide the viewer from one environment into another.

The preferred grammar is:

**CURRENT ENVIRONMENT → DEPTH CUE → CAMERA COMMIT → PARALLAX SEPARATION → THRESHOLD / OCCLUSION → ENVIRONMENT REVEAL → NEW DEPTH SYSTEM → LANDING**

The next environment should feel reached through space, not loaded after a camera move.

### Depth-Layer Roles

Assign each depth layer a transition role.

Possible roles:

- **foreground** — frame invasion, wipe, tunnel edge, portal edge, passing structure, occlusion, velocity amplifier
- **midground** — hero subject, bridge object, structural corridor, UI plane, node cluster, product module
- **background** — destination clue, horizon, future environment, large system, light field, architectural context

Do not move every layer at arbitrary speeds merely to demonstrate parallax.

Each layer should help explain where the camera is going.

### Destination Seeding

