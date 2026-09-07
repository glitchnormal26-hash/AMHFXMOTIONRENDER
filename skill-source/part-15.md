
Avoid final rendering that depends on variable `requestAnimationFrame()` timing alone.

### GSAP Determinism

For capture / export workflows:

- use a master timeline
- make scene state seekable
- avoid random values that change on every playback unless seeded
- avoid physics whose result depends on realtime frame duration unless converted to deterministic evaluation
- verify that `timeline.seek()` or equivalent reproduces the same composition

### Three.js Determinism

For final render:

- derive camera, object, shader, and particle states from explicit time when possible
- for authored camera shots, evaluate position / rig position, orientation or target, and lens state from the same authoritative time instead of relying on a static mount pose
- confirm the evaluated state is applied to the active render camera on every captured frame where the shot is moving
- seed procedural randomness
- avoid unbounded per-frame accumulation that changes when frames are skipped
- update mixers, simulations, and uniforms using controlled time values

If a simulation cannot be made deterministic, bake or cache the result before final capture when practical.

### Font & Layout Readiness

Before frame capture:

- wait for fonts to load
- wait for critical assets and textures
- allow layout to settle
- measure text after the correct font is active
- verify line wrapping at target resolution

For browser work, use `document.fonts.ready` or equivalent when available.

### Resolution Authority

Set the final output dimensions explicitly.

For example, a 9:16 1080p deliverable should render at 1080 × 1920 rather than relying on a scaled browser viewport.

Control:

- CSS viewport
- canvas backing resolution
- device pixel ratio
- camera aspect ratio
- DOM scaling

Do not let an unexpected DPR silently change framing or performance.

### Frame Stepping

For high-confidence final video:

1. set timeline to exact frame time
2. update GSAP / DOM state
3. update Three.js state
4. render frame
5. capture frame
6. advance exactly one frame

Prefer frame stepping or an equivalent deterministic capture path over realtime screen recording.

### Capture Validation

Before rendering the full sequence, capture representative frames at:

- first frame
- scene landings
- transition midpoints
- maximum camera travel
- maximum DOF or blur
- densest typography state
- final frame

Compare them against intended composition.

---

## Performance Budget for Three.js / Web Motion

Performance is part of motion quality.

Dropped frames change timing, easing, and perceived weight.

Establish a performance budget appropriate to the target device and render path.

### Geometry

Avoid unnecessary polygon density.

Use enough geometry for silhouette and material behavior, not invisible complexity.

Prefer instancing for repeated objects when appropriate.

### Draw Calls

Reduce avoidable draw calls by:

- instancing
- material reuse
- batching where practical
- removing invisible objects

Do not combine everything if it makes authored animation harder to control.

### Textures

Use texture resolution appropriate to on-screen size.

Avoid loading large textures that never appear large enough to justify them.

### Shadows

Real-time shadows are expensive.

Use them where they materially support depth or hierarchy.

Prefer a small number of important shadow casters rather than enabling expensive shadows everywhere.

### Post Processing

Budget expensive passes deliberately.

Bloom, DOF, SSAO, motion blur, volumetrics, and multiple full-screen passes can quickly dominate GPU cost.

Do not stack them by default.

### Device Pixel Ratio

Cap DPR for interactive preview when necessary.

For final deterministic render, use the explicit target backing resolution rather than uncontrolled device DPR.

### Ambient Systems

Particles, shader noise, background loops, and procedural effects should be evaluated for both attention cost and compute cost.

If an ambient effect is expensive and narratively unnecessary, remove it.

### Performance QA

Verify:

- no obvious frame drops in target preview environment
- final render uses intended frame timing
- camera motion remains smooth and is visibly non-static whenever the shot declares `MOVING`, `TRACKING`, or `REFRAME`
- shader compilation or texture loading does not create visible first-play hitches
- memory use does not grow continuously during loops or replay

Do not call a piece polished if preview performance materially changes the intended timing.

---

## Blender / 3D

Use Blender or 3D only when the concept specifically benefits from:

- true dimensional transformation
- physical camera parallax unavailable in 2D
- lighting as narrative information
- object rotation requiring real geometry
- material behavior

Do not use 3D merely to make the piece feel “premium.”

If the same idea works more clearly in 2D / 2.5D, prefer the simpler system.

## Other Tools

For Cavalry, Cinema 4D, Rive, GSAP, Framer Motion, CSS, SVG, or other systems:

- preserve the same art-direction principles
- translate timing, easing, hierarchy, choreography, VO sync, and sound logic into the tool's native strengths
- do not force an After Effects mental model onto every tool

---

# 21. Accessibility and Comfort

When motion appears in an interface or long-running experience:

- respect reduced-motion preferences
- avoid unnecessary large camera movement
- avoid repeated aggressive zooms
- avoid rapid flashing
- keep essential information available without requiring motion perception
- provide simpler transitions when motion is disabled
- favor opacity or instant state changes when spatial movement is not essential

For audio:

- do not make SFX essential for understanding
- preserve comprehension without sound
- keep VO clear
- avoid excessively sharp or fatiguing repeated transients

Reduced motion does not mean remove all design.

Preserve hierarchy and feedback with lower-motion alternatives.

---

# 22. Deliver → Verify → Refine

For any task that produces an actual visual artifact, use an inspection loop whenever tools allow it.

## Step 1 — Build

Create the first working version.

## Step 2 — Inspect key moments

Review representative frames:

- opening frame
- first curiosity hook
- anticipation
- peak action
- transition midpoint
- hero word
- reveal
- settle
- final frame

## Step 2.4 — Mandatory Transition Frame Inspection

For every major scene transition, inspect multiple frames around the handoff rather than only the exact cut.

Recommended starting sample at 30 fps:

- T − 6 frames
- T − 3 frames
- T
- T + 3 frames
- T + 6 frames

Also inspect the peak of the outgoing hero and the settle of the incoming hero.

At each sampled frame, check:

- text collisions
- hero-vs-hero competition
- accidental stacking
- clipping
- safe-area violations
- unexpected z-order
- unreadable transitional copy
- whether the visual vector actually leads into the next scene

If tools allow screenshots or rendered frames, use them.

Do not approve a transition based only on timeline logic or source code.

## Step 2.5 — Cinematic 3D Inspection

When the piece uses 3D, camera movement, lens changes, lighting choreography, or post-processing, inspect representative states for:

- camera start and landing composition
- FOV / lens distortion
- hero silhouette
- foreground occlusion
- depth readability
- lighting hierarchy
- material readability
- DOF focus target
- bloom / fog / blur intensity
- 2D / 3D alignment
- camera-direction continuity into the next shot

Capture or inspect the midpoint of every major camera move.

Do not approve a camera move only from its start and end frames; the path may create collisions, clipping, or weak composition in between.

## Step 2.5.1 — Camera Motion Existence Gate

Before judging whether a camera move is beautiful or smooth, verify that it actually exists in the rendered implementation.

For every shot whose camera mode is `MOVING`, `TRACKING`, or `REFRAME`, sample camera state at approximately:

- shot start
- 25%
- 50%
- 75%
- shot end / landing

Compare as relevant:

- camera or rig position delta
- orientation / quaternion delta
- look-target delta
- FOV / zoom delta
- active camera identity
- projected screen-space position / scale of the hero
- foreground-to-background parallax

Use tolerances appropriate to scene scale and lens. Do not rely on one universal world-unit epsilon.

If position, orientation / target, and lens remain effectively unchanged across the interval, classify the camera as **STATIC**.

If the declared mode is not `LOCKED_INTENTIONAL`, a static result is a **hard failure**:

**FAIL → locate the missing camera binding, timeline evaluation, active-camera ownership, or overwritten transform → implement the authored move → render again.**

Do not “pass” the shot because objects, particles, shaders, or UI are moving while the camera direction itself was never implemented.

### Visible Movement Gate

After numerical motion is confirmed, verify perceptual movement. The camera move should create a visible consequence such as:

- measurable hero framing / scale change
- parallax separation
- perspective change
- information reveal
- occlusion change
- screen-space travel
- depth relationship change

If camera values change but representative rendered frames appear effectively identical, treat the move as perceptually static unless stabilization is explicitly intended. Increase travel, change depth relationships, revise the lens / target relationship, or redesign the move rather than claiming motion exists because numbers changed.

For `LOCKED_INTENTIONAL`, record the reason for stillness in the shot plan so QA can distinguish authored stillness from missing implementation.

## Step 2.5.5 — Element Extraction & Camera Tracking Inspection

When a visible 2D or 3D element becomes the transition or camera-tracking target, inspect the complete role transfer.

Check:

- the source element is clearly identifiable before extraction
- the extraction moment is readable
- at least two continuity properties survive long enough to preserve identity
- hero ownership visibly transfers from the parent scene to the extracted element
- camera target ownership is unambiguous
- tracking framing preserves useful negative space and readability
- dead zone, lead, lag, or damping feels intentional rather than accidental
- subject and camera do not cancel each other's motion unless stabilization is the point
- foreground occlusion occurs only after the transition object is understood
- the outgoing object or camera vector genuinely enters the incoming composition
- target reacquisition after occlusion, transform, or cut is readable
- the incoming role is visibly related to the outgoing element
- the camera landing frame is composed as a deliberate still
- the final hold gives enough time to understand the new state
