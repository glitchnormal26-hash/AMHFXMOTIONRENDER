- frame edge
- foreground shape
- mask
- another object

Reveal information through motion.

Do not expose every complete form immediately.

## Edge Tension

Do not center everything.

Use:

- partially off-screen objects
- oversized typography
- cropped illustration
- diagonal entrances
- objects touching safe edges intentionally
- large forms continuing beyond the screen

The frame can feel larger than the viewport.

Maintain readable hierarchy and safe-area awareness.

---

# 12. Visual Transformation & Match Logic

Whenever possible, connect scenes through an existing object.

Examples:

- circle → eye → button → planet
- underline → road → timeline
- character arm → wipe
- speech bubble → text container
- phone screen → full-screen composition
- dot → punctuation → transition anchor
- letterform → icon → illustration

Transformation creates curiosity because viewers want to know what the object becomes.

Avoid cutting to an unrelated composition when a meaningful visual bridge is available.

Use transformation only when the relationship is readable.

---

# 12.5 Shot-to-Shot Editing & 2D ↔ 3D Continuity

A cinematic motion piece is edited, not merely sequenced.

Treat each transition as an edit decision.

## 12.5.1 Editing Grammar

Choose the transition based on narrative logic.

### Hard Cut

Use when:

- contrast is the point
- a punchline needs immediacy
- anticipation has already prepared the eye
- sound can carry continuity

### Match Cut

Use when shape, position, direction, scale, or meaning can connect two scenes.

### Movement Continuation

Let motion exiting one shot provide the vector entering the next.

### Occlusion Cut

Let a foreground object cover the frame, then reveal the next scene behind it.

### Audio-Led Cut

Allow SFX or VO to create expectation slightly before the visual edit.

### Lighting-Led Cut

Use brightness, blackout, emissive pulse, or shadow transition when lighting itself is part of the story.

Do not default to cross-dissolve unless softness or temporal blending is conceptually useful.

## 12.5.2 2D → 3D Bridge

When moving from graphic / DOM space into 3D, use a readable bridge.

Examples:

- UI card becomes a 3D plane
- circle icon gains depth and becomes a node
- DOM grid aligns with a 3D network before camera entry
- flat line extends into spatial path
- typography mask becomes a portal into the next scene

Avoid cutting from unrelated flat UI to unrelated 3D spectacle.

## 12.5.3 3D → 2D Bridge

When returning to typography or UI:

- project a 3D node into screen-space position, then replace it with a DOM dot
- flatten a 3D plane into a full-screen UI surface
- let a camera-facing panel become the next 2D composition
- use a shadow, line, or highlight from 3D as the next graphic element

The viewer should understand that the worlds are connected.

## 12.5.4 Coordinate Continuity

For hybrid scenes, plan how world-space objects map into screen-space layout.

When practical:

- project the hero 3D focal point to screen coordinates
- anchor DOM typography relative to that projected point
- verify mapping at start, midpoint, and landing camera poses

Do not assume a DOM composition remains safe after a camera move.


## 12.5.5 Element Extraction & Role-Transfer Transitions

A visible element may become the transition itself.

Prefer using an object the viewer has already seen when that object can logically carry the story into the next scene.

The preferred grammar is:

**SOURCE ELEMENT → EXTRACT → PROMOTE → TRANSFORM / TRAVEL → HANDOFF → NEW ROLE**

The source may begin as a small supporting element and end as the hero, transition surface, spatial object, mask, portal, foreground occluder, camera target, or structural component of the next scene.

### Source Ownership

The transition object should have a readable origin.

Good sources include:

- button
- icon
- avatar
- cursor
- chart mark
- card
- notification
- text fragment or glyph
- line or connector
- node
- image thumbnail
- illustration part
- 3D product component
- light / emissive path tied to a visible system state

Prefer:

**the existing Send button compresses and detaches from the prompt bar**

instead of:

**a new rounded rectangle appears and flies toward camera**

The viewer should understand what object is being promoted.

### Extraction Moment

Define the exact moment the element stops behaving as a child of the existing layout and becomes an independent transition hero.

Possible extraction cues:

- surrounding UI recedes while the element remains
- parent container clips open or releases the element
- shadow / depth appears as the element separates
- connected lines stretch and break or reroute
- element crosses its parent's boundary
- local perspective changes while the rest of the UI stays planar
- the camera begins to respond specifically to that element

Do not detach every UI object simply by moving it forward.

Make the release readable.

### Identity Preservation

During extraction and transformation, preserve enough identity for the viewer to track the object.

Prefer maintaining at least two or three of these properties through the handoff:

- silhouette
- color / value
- screen position
- motion vector
- label, icon, or recognizable internal mark
- aspect ratio
- material cue
- scale direction
- light behavior
- semantic function
- sound identity

Do not change shape, color, position, material, and motion direction simultaneously unless the transformation is deliberately staged so identity remains readable.

### Hero Promotion

A small source element may become the dominant transition subject.

Promote hierarchy by changing the relationship around it, not only its scale.

Useful promotion methods:

- reduce surrounding contrast
- let the parent UI fall away
- increase negative space around the source
- isolate the element through crop or lighting
- let support elements react after the source moves
- shift camera framing toward the extracted element
- allow the element to cross foreground and temporarily dominate the viewport

The viewer should feel the transfer from:

**support element → hero element**

### 2D → 2D Role Transfer

The extracted object may remain flat.

Examples:

- chart bar leaves a chart → stretches into a full-frame wipe → becomes a timeline rail
- notification bubble detaches → enlarges → its container edge becomes the next scene frame
- text underline extends → becomes a path → guides the next composition
- icon crosses foreground → becomes a mask revealing the next product state

Do not add 3D when shape, crop, scale, or occlusion can communicate the transition more clearly.

### 2D → 3D Role Transfer

A flat element may gain spatial depth when dimensionality creates a meaningful bridge.

Possible progression:

**flat UI element → extraction → perspective response → thickness / depth cue → spatial hero → tracked 3D travel → next scene structure**

Examples:

- button detaches → gains thickness → becomes a processing module
- circle icon gains depth → becomes a network node
- UI card becomes a physical plane → camera tracks around it → the reverse side contains the next state
- flat connector line extends in Z → becomes a spatial route the camera follows

Introduce depth progressively enough that the viewer understands it is the same object.

### 3D → 2D Role Transfer

A spatial object may return to graphic space.

Possible progression:

**3D hero → camera-facing pose → perspective compression → screen-space alignment → flat replacement → 2D scene continues**

Examples:

- 3D node aligns to a known screen coordinate → becomes a DOM icon
- spatial panel rotates camera-facing → fills viewport → becomes the next UI surface
- 3D edge highlight becomes a 2D divider line
- projected shadow becomes the shape mask of the next composition

### Transition Handoff Property

For every element-driven transition, explicitly identify what survives the scene boundary.

Possible handoff properties:

- position
- shape
- scale
- velocity
- direction
- depth
- orientation
- crop boundary
- material
- light
- sound tail
- semantic meaning

The handoff does not need to preserve everything.

It must preserve enough for the viewer to perceive causality.

### Element + Camera Coupling

When the extracted element becomes a 3D tracking target, object choreography and camera choreography should be designed together.

Define:

1. source element and original parent
2. extraction cue
3. hero promotion moment
4. tracking target
5. screen-space framing rule
6. camera response — locked / smooth / heavy / lead / lag / snap reframe
7. object travel vector and depth behavior
8. occlusion or transformation event
9. inherited handoff property
10. incoming scene role
11. camera landing composition
12. readable hold

The camera should not merely follow the object after the transition has already been designed.

The tracking move may be the mechanism that reveals the next scene.

### Scene-Carry Pattern

A strong default pattern is:

**visible element acts → element leaves its local container → camera recognizes it as the new hero → camera tracks / reframes → element changes scale or depth → element crosses or fills frame → scene state changes through the element → camera continues or reacquires → element lands with a new role**

Examples:

**SEND BUTTON → COMPRESS → DETACH → 3D MODULE → CAMERA TRACK → FOREGROUND OCCLUSION → WORKFLOW PLANE → SETTLE**

**CHART DOT → LEAVE GRAPH → BECOME 3D NODE → CAMERA PULLS BACK WITH NODE ANCHORED → NETWORK REVEALED → NODE ACTIVATES NEXT CLUSTER**

**UI CARD → TILT → CAMERA TRUCKS → CARD EDGE FILLS FRAME → EDGE BECOMES DIVIDER IN NEXT 2D SCENE → CAMERA-FACING LANDING**

### Do Not Reset the World

Avoid this pattern:

**element exits → empty frame → generic transition effect → unrelated new composition**

Prefer:

**element causes the frame change → outgoing motion survives the handoff → the next scene is revealed by the same element, its descendant form, or the camera movement it initiated**

The viewer should feel that the next scene was reached, not summoned.
