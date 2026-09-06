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

Whenever possible, show evidence of the next environment before fully entering it.

Possible seeds:

- a distant light field that later becomes the new environment
- a small network cluster visible through a gap
- a UI plane behind the current hero
- a horizon line shared by both environments
- a corridor, portal, opening, frame, or negative-space window
- a distant version of an object that becomes the next hero
- a material, color-value, or structural motif that grows in importance during travel

This creates anticipation and makes the destination feel spatially continuous.

Avoid hiding the new environment completely until after the old one disappears unless surprise is the narrative goal.

### Camera Commitment

Define the moment when the camera stops merely observing the current scene and commits to traveling into the next environment.

Possible commitment cues:

- the tracked hero crosses a depth threshold and the camera follows
- foreground layers begin separating rapidly
- a midground opening becomes large enough to enter
- the camera leaves its original framing anchor
- lens / perspective behavior shifts to emphasize depth travel
- a background destination begins expanding faster than the current hero
- an object or light path gives the camera a clear spatial route

The commitment should be readable as intentional travel, not generic push-in.

### Parallax Separation

During travel, preserve differentiated motion between depth layers.

Useful behavior:

- near layers cross frame quickly
- midground structures move at moderate screen velocity
- distant destination layers expand more slowly at first, then become dominant as the camera approaches
- foreground occluders may briefly hide the destination to create tension
- a tracked subject may remain relatively stable while the environment moves around it
- a destination object may begin small and off-axis, then inherit hero ownership as the camera approaches

The amount of parallax should communicate depth, speed, and scale.

Do not maximize parallax if it weakens orientation or UI readability.

### Threshold Objects

Use a visible spatial threshold when it helps clarify environment change.

Thresholds may include:

- card edges
- door-like UI planes
- arches
- rings
- node clusters
- structural beams
- typography masks
- foreground devices
- glass panels
- light gates
- gaps between large objects

A threshold does not need to look like a literal portal.

Its purpose is to give the camera a readable boundary to cross.

### Environment Replacement Behind Occlusion

A foreground layer may temporarily cover enough of the frame to hide an environment transformation.

Preferred pattern:

**camera approaches threshold → foreground parallax accelerates → near layer occludes frame → environment state changes during coverage → camera exits occlusion into the next depth system**

Preserve continuity through at least one of:

- camera velocity
- travel direction
- horizon
- light direction
- tracked subject
- structural alignment
- material behavior
- sound tail
- destination object

Do not use full-frame occlusion as an excuse for an unrelated scene reset.

### Environment Morph During Travel

The environment may transform progressively rather than switching during a hidden frame.

Examples:

- UI grid gains depth and becomes an architectural system while the camera advances
- dashboard cards separate into layers and become a spatial corridor
- background network nodes enlarge until the camera is traveling inside the network
- flat lines extrude into rails that define the next environment
- a distant product plane expands while surrounding layers reorganize around it
- a graphic light field becomes volumetric and establishes the destination space

Progressive transformation is preferred when the relationship between worlds is conceptually meaningful.

### Tracked Subject + Parallax Environment Coupling

An extracted transition element may lead the camera through a parallax environment.

Use this pattern when the subject itself provides the reason to travel:

**VISIBLE ELEMENT → EXTRACT → CAMERA ACQUIRES → SUBJECT ENTERS DEPTH → FOREGROUND / MIDGROUND PARALLAX BUILDS → DESTINATION APPEARS → SUBJECT CROSSES THRESHOLD → ENVIRONMENT HANDOFF → SUBJECT OR DESCENDANT FORM REACQUIRED**

The camera does not need to remain tightly attached to the subject.

It may lag, resist, overtake, or release the target temporarily if that creates stronger depth perception and a clearer environment reveal.

### Background-to-Hero Promotion

A powerful environment transition can promote something that begins in the background into the next scene's hero.

Example:

**small distant workflow plane → camera travels through foreground cards → plane grows through perspective → intermediate layers peel away → plane becomes full-screen product environment**

This creates continuity without requiring a foreground object to fill the frame.

### Travel-to-Landing Rule
