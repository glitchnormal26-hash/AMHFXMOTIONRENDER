- palette choices that weaken typography or object separation

When typography is the hero, the gradient should support attention. When the 3D object is the hero, the gradient may become more active, sculptural, or luminous.

For `FAST_EDGY` typography, reduce background detail during must-read frames and let gradient intensity pulse or redirect **around** the type hit rather than continuously behind it.

### Interactive Gradient Behavior

Gradient should not only move. Gradient may also **respond**.

When the brief, platform, or implementation allows interactivity, gradient may react to:

- hero typography hits
- 3D object activation or proximity
- cursor / pointer position
- hover / focus state
- scroll progress
- drag direction or velocity
- click / tap confirmation
- product state changes
- section transitions

Preferred reactive grammar:

**IDLE → APPROACH → HIT / RESPONSE → DECAY → SETTLE**

Useful responses include:

- local brightness increase near the interaction point
- field compression toward the active subject
- directional color flow following cursor or drag direction
- intensity pulse on a type hit
- ripple, bend, or displacement caused by object contact
- slow atmospheric state when idle, stronger response on user action

Do not let every interaction trigger a full-scene explosion.

Keep the response proportional:

- micro interaction → subtle local response
- hero event → clearer field redirection or compression
- scene transition → broader but still motivated change

If typography is being read, the gradient response should happen around the type or immediately after the hit, not destroy readability during the hold.

### ShaderGradient Parameter Choreography

When using `@shadergradient/react`, choreograph parameters as authored motion rather than leaving every property continuously alive. Useful controls include:

- `type` — `plane`, `sphere`, or `waterPlane` according to the spatial role
- `uTime` / `uSpeed` — temporal flow
- `uStrength`, `uDensity`, `uFrequency`, `uAmplitude` — deformation and field character
- `color1`, `color2`, `color3` — palette hierarchy
- `positionX/Y/Z` and `rotationX/Y/Z` — spatial relationship
- `cAzimuthAngle`, `cPolarAngle`, `cDistance`, `cameraZoom` — camera relationship
- `brightness`, `lightType`, `envPreset` — light/environment character
- `grain` / `grainBlending` — restrained texture when appropriate

Do not animate all of these at once.

Prefer one dominant field change plus one or two supporting changes.

Example:

**quiet field → hero object activates → gradient compresses toward the hero and increases local intensity → camera reveals product context → field calms and becomes a low-contrast continuity layer**

This is stronger than an endlessly morphing gradient with no state relationship.

### Gradient Readability Rule

When typography or SaaS UI is the hero:

- reduce gradient motion density
- protect text contrast
- avoid high-frequency deformation directly behind must-read copy
- let color/value separation support the hierarchy
- stop or slow the field during a critical readable hold when necessary

A moving gradient is support unless the gradient transformation itself is the hero event.

## 9.8.4 Bloom / Glow

Bloom is an accent, not a hierarchy system.

Important implementation distinction:

- `@shadergradient/react` provides the moving gradient / shader field
- optical bloom or glow should come from an actual post-processing stage when needed
- in a React Three Fiber stack, `@react-three/postprocessing` is a preferred reference for Bloom / EffectComposer behavior

Use bloom primarily for actual bright or emissive elements.

Preferred pattern:

**shader / emissive source → thresholded bloom → short hierarchy peak → controlled decay**

Bloom may increase during:

- activation
- connection established
- hero reveal
- energy / data transfer
- object handoff
- impact where light itself is part of the event

Then reduce it after the event so the eye can read the landing state.

### Interactive Glow Response

Glow should not be permanently active by default. It should react to something.

When the design benefits from responsive motion, glow may respond to:

- hover / focus
- click / tap
- hero word impact
- cursor proximity
- object contact or collision
- UI activation
- product confirmation
- edge passes or handoff moments

Preferred behavior:

**quiet surface → activation peak → short bloom → controlled decay**

or

**idle glow → hover rise → click peak → settle**

Glow may be attached to:

- edges
- emissive text
- object seams
- active nodes
- cursor trails
- UI highlights
- transition paths

Do not make glow equally strong on all objects. Keep one clear emissive owner at a time whenever possible.

For kinetic typography, glow may accent a hero word, follow a letter edge, or flash on impact, but it must not blur the word during the readable hold.

Avoid:

- glowing every edge
- large bloom halos behind dense text
- using glow to compensate for weak contrast
- full-scene bloom with no emissive ownership
- continuous bloom pulsing when no state is changing
- stacking bloom + DOF + fog + chromatic aberration merely to signal “premium”

## 9.8.5 Depth of Field

Use DOF only when focus hierarchy benefits from it.

Good uses:

- macro reveal
- shifting attention between depth planes
- simplifying background detail during a hero moment

Avoid:

- blurring essential UI
- constant focus hunting
- extremely shallow focus on typography-heavy scenes

## 9.8.6 Fog / Atmosphere

Use atmosphere to clarify depth or scale, not to make every shot look cinematic.

## 9.8.7 Motion Blur

Motion blur may support fast movement, but it must not hide poor spacing or unreadable typography.

## 9.8.8 Grain / Vignette / Chromatic Effects

Use these only when they fit the visual language.

They are finishing tools, not substitutes for composition, timing, lighting, or material design.

Avoid stacked post-processing that weakens product clarity.

---

# 10. Illustration Motion

Do not treat illustration as a static image that slides onto screen.

Illustration should have behavior.

Possible behaviors:

- unfold
- stretch
- split
- assemble
- peel
- collapse
- react
- point
- chase
- interrupt
- transform
- reveal
- absorb
- push
- pull
- hide

Instead of:

**icon enters → holds → exits**

prefer:

**line draws → becomes object → reacts to narration → pushes type → becomes transition**

## Illustration as Narrative Device

Use illustration to:

- visualize abstract language
- simplify complex ideas
- create metaphors
- establish emotional tone
- create visual callbacks
- connect scenes through transformation

## Behavioral Consistency

Give illustration a material personality.

Examples:

- paper-like
- rubbery
- rigid
- liquid
- mechanical
- hand-cut
- marker-drawn
- UI-like

Do not mix incompatible physical behavior without narrative reason.

---

# 11. Occlusion, Crop & Edge Tension

Occlusion is a strong attention tool.

Hide information temporarily behind:

- typography
- illustration
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
