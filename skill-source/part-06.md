
The new environment needs a deliberate landing composition.

After high-parallax travel:

- reduce relative layer velocity
- establish the new hero
- restore readable depth hierarchy
- stabilize horizon unless continued instability is intentional
- let typography / UI become readable before the next major move
- provide a short hold when the viewer needs to re-orient

Do not continue high-speed parallax indefinitely after the destination has been reached.

### Parallax Environment Failure Modes

Avoid:

- using parallax only as decorative layer drift
- every layer moving continuously even when the camera is stationary
- entering a destination that was never spatially hinted at
- foreground objects crossing only to create random visual noise
- changing all environment properties during occlusion with no surviving continuity cue
- camera speed so high that scale and destination cannot be read
- tracking a hero so tightly that all environmental depth movement disappears
- replacing the old environment with an unrelated new one while hiding behind a wipe
- repeated tunnel / portal transitions becoming a template
- entering the next scene with no inherited vector, position, shape, depth, or semantic relationship

---

# 9.6 Lens & FOV Language

For perspective cameras, lens behavior changes how motion feels.

Do not choose FOV arbitrarily.

Think in perceptual categories rather than treating exact values as universal rules.

## Wide / Energetic Perspective

Useful for:

- dramatic foreground scale
- strong parallax
- fast spatial movement
- exaggerated entry into a system

Risks:

- distorted UI
- cheap-looking edge stretch
- excessive speed
- text readability loss

## Normal / Natural Perspective

Useful for:

- product hero shots
- balanced SaaS spatial scenes
- readable 3D UI cards
- premium but controlled camera movement

Use this as the default when no stronger lens statement is required.

## Tele-like / Compressed Perspective

Useful for:

- premium restrained shots
- compressed layers
- slower, heavier motion
- graphic flattening of 3D space

Risks:

- reduced sense of depth
- weak parallax

## FOV Change Rules

Changing FOV is not the same as moving the camera.

Use FOV animation only when it has a clear perceptual purpose such as:

- controlled perspective exaggeration
- a stylized push-pull effect
- a transition from immersive to graphic space

Avoid casual FOV pumping.

If a camera move can achieve the idea more naturally, prefer physical translation over animated FOV.

When combining camera translation and FOV changes, verify that the result does not resemble accidental digital zoom.

---

# 9.7 3D Staging & Blocking

Treat 3D subjects like performers.

A hero object should have designed poses and actions rather than continuous rotation.

## 9.7.1 Hero Pose

Before animation, define a resting hero pose that communicates:

- silhouette
- orientation
- scale
- focal face / surface
- relationship to typography
- available negative space

The object should still feel intentional when paused.

## 9.7.2 Pose Sequence

For a major 3D event, think in:

**POSE A → ANTICIPATION → ACTION → POSE B → SETTLE**

Examples:

- node compresses → launches → connects → system settles
- card tilts away → camera follows → card becomes spatial doorway
- object rotates just enough to reveal hidden face → light catches it → copy appears

Avoid:

- endless 360° rotation
- random oscillation
- identical amplitude on every axis
- motion with no readable pose


## 9.7.2.5 Expressive 3D Object Performance

3D objects should not always feel rigid, corporate, or mechanically neutral.

When the brief benefits from personality, tension, tactility, or emotional lift, give the object an authored performance rather than only a transform.

Useful expressive behaviors include:

- anticipation tilt before motion
- slight compress / release before launch or impact
- hinge, fold, fan, peel, or open behaviors
- magnetic pull, convergence, or repulsion between object parts
- drag, lag, or follow-through on attached elements
- controlled wobble or recoil after impact
- soft collision response
- rotation with a readable lead-in and landing, not perpetual spin
- object reaction to typography, cursor, data pulse, or environmental change
- one object handing attention to another through contact, occlusion, or transformation

Possible object personalities:

- **precise-rigid** — clean, mechanical, restrained; good for technical or premium systems
- **elastic-reactive** — quick compression, release, and rebound; good for playful or energetic scenes
- **magnetic-modular** — pieces attract, separate, and snap into systems; good for product assembly
- **soft-digital** — float, bend, and reform with subtle fluid character; good for AI / abstract environments
- **paper-like hybrid** — fold, hinge, peel, and layer; good for editorial or physical-digital staging

Do not force cartoon squash-and-stretch onto every object. The goal is not silliness. The goal is to avoid dead, showroom-like 3D behavior when more expressive motion would improve attention and character.

A useful test:

**If the 3D object could be replaced by a static product render plus a slow turntable and the scene would feel almost the same, the object performance is probably too stiff.**

## 9.7.3 Depth Staging

Assign layers deliberately:

- foreground — interruption / wipe / scale / framing
- midground — hero subject
- background — context / environment / support

Do not fill every depth layer merely because 3D allows it.

At the hero moment, the viewer should be able to identify the primary subject immediately.

## 9.7.4 Silhouette & Occlusion

Check important 3D states in screen space.

Avoid:

- hero geometry merging with background values
- text crossing high-detail geometry
- important surfaces hiding during the exact moment they are described
- foreground occlusion lasting so long that comprehension drops

Use occlusion to create anticipation, then reward it with a readable reveal.

---

# 9.8 Lighting, Material & Post-FX Choreography

Lighting is part of hierarchy.

Do not light every object equally.

## 9.8.1 Lighting Roles

### Key Light

Use to define the hero surface and primary form.

### Fill

Use only enough to preserve necessary information.

### Rim / Edge Light

Use to separate subject from background or emphasize a reveal.

### Emissive / State Light

Use for meaningful state changes such as:

- AI processing
- connection established
- workflow completed
- activation
- alert

Avoid constant emissive pulsing when nothing is changing.

## 9.8.2 Lighting Choreography

Light may change with the action.

Examples:

- dim before reveal → key light lands with hero object
- rim light appears as object separates from background
- emissive path travels only when data moves
- shadow tightens at impact

Lighting changes should reinforce the same hierarchy as motion.

## 9.8.3 Material Discipline

Choose materials according to narrative and brand character.

Possible material personalities:

- matte technical
- translucent glass
- soft plastic
- metallic precision
- emissive digital
- paper-like hybrid

Do not assign different materials merely to show shader variety.

## 9.8.3.5 Shader-Driven Gradient Fields

For React / WebGL work, `@shadergradient/react` is a preferred implementation reference when the concept benefits from a moving 3D gradient field.

Use a shader gradient as one of these roles:

- atmospheric background that establishes depth or mood
- luminous hero plane, sphere, or water-like surface
- material field behind or inside a product object
- continuity layer that survives scene handoffs
- lighting-adjacent visual cue for activation, processing, or transformation
- abstract spatial destination that later resolves into product context

Do not use animated gradient merely to fill empty space.

The gradient should answer at least one question:

- what is changing?
- what is active?
- where is attention moving?
- what spatial layer is being revealed?
- what material or environmental state is changing?


### Theme-Responsive Gradient Direction

When the background uses a gradient, derive it from the **theme, emotional tone, brand palette, or narrative state** rather than choosing an arbitrary attractive blend.

Treat the gradient as part of the world. It may communicate calm, tension, optimism, danger, intelligence, warmth, night energy, luxury, speed, or transformation.

Possible thematic tendencies:

- **premium / elegant** — restrained transitions, controlled luminance, fewer but richer hues
- **energetic / hype** — stronger contrast, clearer directional flow, sharper intensity shifts
- **technical / SaaS** — cleaner palette separation, focused glow ownership, structured movement
- **AI / futuristic** — luminous depth, atmospheric layering, field compression around active events
- **playful / expressive** — bolder hue contrast, softer material drift, elastic response to hero motion
- **calm / reflective** — slower chroma movement, wider gradients, gentler value transitions

A theme-responsive gradient may change across scenes or beats, but each change should relate to a real shift in message, hierarchy, or energy.

Avoid:

- a gradient that is unrelated to the message
- equal motion intensity across the whole film
- high-frequency background motion behind dense copy
