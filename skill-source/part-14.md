During a hero relay, the camera may track the object tightly for a short period, then release it to reveal context.

Useful pattern:

**hero accelerates → camera follows with slight lag → foreground passes amplify speed → hero approaches destination → camera resists or pulls wider → environment becomes legible → hero stops being the only important object**

This preserves object identity while allowing the world to become the next subject.

Avoid perfect center-lock for the entire sequence.

## 18.7.5 Scale Escalation & Miniature-to-Macro

A small interface element can become large enough to behave like a physical object, and a large object can later resolve into a small product component.

Use scale escalation to change meaning:

- tiny UI control → hero interaction object
- small card → full-frame plane
- tool tip / stroke → environment-scale path
- prop → transition threshold
- word → cropped spatial field

The scale change should reveal a new role. Do not enlarge elements only because the camera can.

## 18.7.6 Material Trail as Scene-Carrying Structure

A stroke, ribbon, cable, path, light line, or paper edge can carry the viewer through multiple shots.

A strong trail can:

- preserve travel direction
- link physical and digital worlds
- wrap around or reveal objects
- become a divider or frame
- guide the camera
- create a wipe
- resolve into product geometry

Let the trail react to depth and perspective. Avoid a flat overlay that ignores the world it is supposed to connect.

## 18.7.7 Product World Assembly

Instead of cutting from abstract motion to a complete product screenshot, let earlier objects become the product's structure.

Examples:

- folder separates into cards → cards align into a content strip → the wider interface is revealed around them
- physical notes group by role → flatten into modules → modules become a workflow view
- extracted UI fragments travel in depth → settle into their actual product positions → camera reveals the full application
- image tiles or cards already visible in the world become the first readable part of the product page

The product should feel like the destination of the choreography.

Once the real product is visible, reduce spectacle enough for comprehension.

## 18.7.8 Flash, Blur & Depth as Handoff Tools

Fast movement may temporarily use:

- motion blur
- shallow depth of field
- exposure lift / bright wash
- radial streaking
- foreground smear
- brief frame domination by one material

Use these as **transition coverage**, velocity amplification, or hierarchy control.

Do not use them to hide weak spatial logic.

A flash or blur should preserve at least one continuity cue before and after it: vector, object, silhouette, position, color-value, trail, camera direction, or sound tail.

## 18.7.9 Typography Can Be a Destination, Not Only a Caption

After a dense physical-digital sequence, typography may become the clean landing.

Useful contrast:

**complex spatial world → simple hero word → oversized crop / scale event → compact brand resolution**

This works when the type summarizes or reframes what the viewer just saw.

Avoid adding small ornamental metadata around the landing. Let the word, object, or product own the negative space.

## 18.7.10 Terminal Simplification

The end of a dense film often benefits from fewer moving parts.

A useful resolution is:

**many objects → one object / word → one brand mark → stillness**

Let the final seconds reduce motion density, depth complexity, and sound density unless the brief explicitly requires a hard energetic ending.

The simplification should feel earned by the prior sequence, not like an unrelated end card.

## 18.7.11 Reference-Abstraction Rule

When learning from a supplied film, preserve principles such as:

- hero-object relay
- physical-digital continuity
- semantic transformations
- camera-object coupling
- scale escalation
- burst / breath contrast
- product-world assembly
- object-integrated typography

Do **not** copy the reference's exact:

- branded assets
- logo
- palette
- prop selection
- room / desk composition
- course/product content
- transition order
- hero object sequence
- scene-for-scene timing

Build a new causal chain for the new message.

---

# 19. Brand Motion

When brand work is involved, define a motion grammar:

- signature easing
- fast / standard / slow durations
- entrance behavior
- exit behavior
- transition behavior
- overshoot tolerance
- crop behavior
- perspective behavior
- illustration behavior
- typography behavior
- texture intensity
- sound vocabulary
- VO treatment

Do not use every trend in one project.

The motion language should feel like the same brand even when scenes differ.

Never distort a logo casually.

Preserve logo geometry unless the brief explicitly allows morphing.

---

# 20. Tool-Specific Behavior

Remain tool-agnostic at the art-direction level, then adapt implementation to the target tool.

## After Effects

When working in After Effects:

- think in compositions, layers, properties, keyframes, expressions, effects, precomps, mattes, cameras, and render settings
- use the Graph Editor intentionally
- preserve editable structure
- name important comps and layers clearly
- prefer transforms, masks, shape layers, parenting, and expressions before heavy effects
- use 2.5D only when it materially improves the idea
- separate reusable controls into a clear control layer
- keep audio markers organized for VO and SFX sync

When generating scripts:

- explain where the script should run
- avoid destructive assumptions
- preserve project structure where possible
- use predictable naming
- expose designer-tunable parameters

## Remotion

When working in Remotion:

- make timing deterministic and frame-based
- derive animation from `useCurrentFrame()` and composition timing
- use interpolation and springs intentionally
- keep reusable animation behavior componentized
- synchronize VO and SFX frame-accurately
- separate content data from visual behavior
- render representative frames and inspect them before calling the piece complete

## Lottie / Web / UI

When producing motion for web or Lottie:

- prioritize transforms and opacity for performance when appropriate
- keep exported complexity under control
- verify unsupported effects
- provide reduced-motion behavior
- keep interaction motion responsive and interruptible
- do not sacrifice usability for spectacle

## GSAP + HTML / DOM

When producing timeline-driven HTML motion with GSAP:

- use one master timeline with explicit scene labels
- build scene timelines as named units rather than one long unstructured chain
- set deterministic initial states before playback
- measure DOM layout after fonts are loaded
- prefer transforms and opacity for animation performance, but do not use transform-only assumptions for layout safety
- use `autoAlpha` / visibility logic when outgoing DOM should no longer compete visually
- ensure replay returns every scene to the same deterministic starting state
- ensure pause actually pauses hero, secondary, ambient, and WebGL motion together when they are part of one experience
- avoid orphaned tweens continuing after a scene has lost ownership
- use timeline labels for key QA frames and transitions
- avoid arbitrary independent delays that become difficult to retime globally

For text-heavy scenes:

- measure actual rendered copy
- allow responsive line breaks intentionally
- do not animate typography before layout settles
- re-check bounds after scale, width, tracking, or variable-font animation

For scene exits, do not leave old DOM at readable opacity underneath the next scene unless it is intentionally part of the composition.

## React Three Fiber + ShaderGradient Runtime

For React-based 3D motion, use `@react-three/fiber` as the preferred declarative Three.js runtime when it improves implementation clarity, reuse, interaction, or scene orchestration.

React Three Fiber is a renderer for Three.js, not an art direction or a complete authored-animation system.

Use it for:

- `<Canvas>` scene ownership
- declarative meshes, lights, cameras, materials, and reusable components
- pointer / interaction state
- per-frame updates through `useFrame` when continuous evaluation is actually needed
- composition of Three.js with the React ecosystem
- hosting ShaderGradient and post-processing inside the same scene world

### Animation Authority

Choose the animation authority according to the motion type.

**Use `useFrame` primarily for:**

- continuous procedural motion
- shader uniform evaluation
- subtle environment response
- interaction-following behavior
- camera/object systems that genuinely need every-frame calculation

**Use a master timeline / explicit time source primarily for:**

- VO-synced choreography
- kinetic typography handoffs
- camera pose-to-pose transitions
- product reveal timing
- speed ramps
- deterministic final video capture
- scene replay / seeking / exact QA frames

Do not let `useFrame` accumulate authored hero motion indefinitely when the final sequence needs exact reproducibility.

For deterministic capture, derive R3F object, camera, shader, and post-processing states from the same authoritative time used by DOM / GSAP / audio whenever practical.

### ShaderGradient Integration

A preferred stack for luminous gradient scenes is:

**React → React Three Fiber Canvas → ShaderGradient field / Three.js objects → optional post-processing → DOM/UI/typography overlay when required**

Use `ShaderGradientCanvas` when the gradient owns its own canvas.

When deeper scene integration is required, preserve one coherent render/time authority and verify that gradient, camera, product object, typography, and post-processing stay synchronized.

### Bloom Integration

When bloom is required in R3F, use an actual bloom effect such as the Bloom component from `@react-three/postprocessing` rather than describing ShaderGradient itself as a bloom engine.

Tune bloom by perceptual hierarchy:

- threshold / luminance ownership
- intensity
- smoothing / radius character
- timing of the peak
- duration of the tail
- interaction with text/UI contrast

The brightest object should normally be the object that owns attention.

### Version Compatibility

Check React / R3F major-version compatibility before implementation. The React Three Fiber repository currently documents R3F 8 for React 18 and R3F 9 for React 19. ShaderGradient v2 also documents compatibility requirements for its React/R3F combinations.

Do not copy an old starter setup blindly.

### Implementation References

- ShaderGradient: https://github.com/ruucm/shadergradient
- React Three Fiber: https://github.com/pmndrs/react-three-fiber
- React Three post-processing: https://github.com/pmndrs/react-postprocessing

## Three.js + DOM Hybrid Motion

When Three.js and HTML typography / UI are combined:

- decide whether WebGL or DOM owns the hero at each beat
- do not let ambient 3D motion steal attention from primary copy
- project important 3D focal points into screen space and compose DOM around the projected result
- treat camera motion as a layout change because it can invalidate previous screen-space spacing
- re-check collision and readability at representative camera states
- synchronize Three.js animation to the same master clock or GSAP timeline when practical
- pausing, seeking, replaying, or reduced-motion behavior should affect both systems coherently
- do not fake depth with constant rotation when a clearer 2D / 2.5D transformation would communicate better

For WebGL hero objects:

- define a resting pose that works as a still composition
- define the reason for rotation, orbit, dolly, or parallax
- define camera start pose, landing pose, and readable hold
- choose a lens / FOV behavior intentionally rather than using arbitrary defaults
- stage foreground, midground, and background according to attention priority
- coordinate lighting changes with state changes or reveals
- stop or reduce ambient movement during dense typography moments
- avoid perpetual spinning as a substitute for choreography
- avoid combining orbit + FOV pumping + bloom + DOF merely to signal “cinematic”

## Deterministic Web Render Pipeline

When HTML, Canvas, Three.js, GSAP, Web Animations, or similar systems will be rendered as video, deterministic playback is a production requirement.

Do not assume realtime browser playback is frame-accurate enough for final rendering.

### Fixed Timeline Authority

Use one authoritative time source for final render.

Prefer a timeline that can be evaluated from an explicit time or frame index.

For frame `f` at frame rate `fps`:

`time = f / fps`

All render-relevant systems should derive their state from that timeline when practical.
