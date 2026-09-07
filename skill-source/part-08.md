
### Extraction Failure Modes

Avoid:

- introducing a new object that only resembles the source instead of transforming the visible source
- losing object identity because every visual property changes at once
- scaling a UI element to 1000% without adding any hierarchy or spatial logic
- using 3D depth when a flat transition would be clearer
- camera tracking that fights the object's motion rather than clarifying it
- hiding the object before the viewer understands that it became the transition


## 12.5.6 Parallax Environment Handoff Transitions

An environment itself may become the transition device.

Do not assume every transition requires one isolated hero object.

When the scene already contains meaningful foreground, midground, and background layers, the camera may travel through those layers so spatial separation carries the viewer into the next environment.

Use the handoff model:

**SOURCE DEPTH SYSTEM → DESTINATION SEED → CAMERA TRAVEL → LAYER SEPARATION → THRESHOLD → DEPTH REASSIGNMENT → DESTINATION SYSTEM**

### Depth Reassignment

Layers may change narrative role across the transition.

Examples:

- current background → next midground hero
- current midground card → next foreground threshold
- current foreground frame edge → next environment architecture
- distant node cluster → next full spatial network
- current horizon → persistent horizon in the destination
- small background UI plane → next full-screen product state

This role transfer should be readable through position, scale, motion vector, material, or light continuity.

### Environmental Carry-Over

For a parallax-driven scene change, preserve at least one environmental property across the handoff:

- horizon or vanishing direction
- camera travel vector
- foreground travel direction
- depth-axis logic
- structural motif
- light direction
- atmospheric density
- repeated material
- tracked element
- destination landmark
- sound texture or tail

Prefer preserving two or more when the environments differ substantially.

### Environment-to-Environment Examples

**UI DASHBOARD → cards separate in depth → camera follows a node between panels → distant network enlarges → foreground cards whip past → camera enters network environment**

**3D PRODUCT TABLE → camera trucks behind a large device → device creates near-field occlusion → same camera vector continues → backside reveals a wider automation environment**

**FLAT GRID → perspective increases → grid lines become floor / rails → camera moves through foreground intersections → distant UI plane becomes the next workspace**

**NODE NETWORK → camera accelerates toward one illuminated gap → surrounding nodes produce deep parallax → gap resolves into circular product motif → motif becomes architecture of the next scene**

### No Teleport Rule

If the transition is presented as camera travel, the destination must respect the travel.

Do not:

**push forward → hide frame → place camera at an unrelated angle, depth, or direction in a new world**

unless the discontinuity is explicitly motivated as a deliberate impossible-space effect.

Prefer:

**travel vector survives → depth relationships evolve → destination becomes legible → camera lands inside a new but connected environment**
- arriving at a scene whose composition has no relationship to the extracted object's final position or vector
- repeatedly extracting an element from every scene until the technique becomes predictable

---


## 12.5.7 Hero-Object Relay & Semantic Material Transformation

A strong multi-scene sequence does not need the same object to survive forever.

It needs a **readable relay of attention**.

Use this grammar:

**OBJECT A OWNS → A ACTIVATES / REVEALS B → B INHERITS VECTOR OR POSITION → CAMERA ACQUIRES B → B TRANSFORMS / TRAVELS → B REVEALS C → SETTLE**

The relay may pass between:

- physical prop
- UI element
- cursor / pointer
- notification or message card
- tool such as pen, marker, brush, scissors, or device
- line / stroke / ribbon
- card / folder / thumbnail
- typographic word or glyph
- product module
- brand mark

### Relay-Cause Rule

Object B should not become hero merely because the edit needs something new.

A visible cause should transfer ownership, for example:

- A points toward B
- A contacts B
- A draws or generates B
- A opens to expose B
- A passes behind B and B inherits the foreground position
- A breaks into fragments that become B
- A's motion trail becomes B
- A's screen position is matched by B after an occlusion or cut
- the camera follows A toward B, then releases A after B becomes more important

### Semantic Material Transformation

Prefer transformations where the new form is related to the source object's action, function, or meaning.

Examples:

- drawn stroke → route → connector → workflow path
- cursor / pointer → physical directional object → product interaction target
- folder → content cards → thumbnail strip → product library
- paper edge → frame edge → interface panel
- underline → rail → progress path
- sticky-note cluster → grouped tasks / modules
- ring / canopy / circular prop → framing aperture → radial reveal

The transformation does not need literal realism.

It needs **conceptual legibility**.

Avoid arbitrary morph chains where shape changes are impressive but the viewer cannot explain why one thing became another.

### Identity-Invariant Rule

During a relay or transformation, preserve at least two useful invariants whenever possible:

- motion vector
- screen-space position
- silhouette family
- scale direction
- material cue
- edge / stroke character
- color-value relationship
- semantic role
- camera travel direction
- sound identity / tail

If shape, color, material, position, scale, and direction all change at once, stage the transformation into intermediate poses.

### Controlled Scatter / Collision Burst

A temporary burst of objects can create scale, energy, and surprise when it has a destination.

Useful grammar:

**stable cluster → trigger → related objects separate at different depths → one hero remains trackable → near-field passes amplify speed → clutter clears → destination object or environment becomes dominant**

Use the scatter to:

- expose a hidden destination
- promote one object from support to hero
- create a foreground wipe
- show many inputs becoming one output
- convert a static composition into spatial travel

Do not use an explosion of objects merely as spectacle.

After the burst, the viewer should be able to identify what survived, what changed, and what now matters.

### Physical ↔ Digital Bridge

When a sequence mixes tactile real-world objects and product/UI graphics, do not treat them as unrelated aesthetic layers.

Build a bridge through:

- matching scale trajectory
- contact or pointing
- screen-space alignment
- shared shape
- object extraction
- a line or path crossing both worlds
- camera continuation
- shadow / material transfer
- depth change
- interaction feedback

A digital element may temporarily behave like a physical object, and a physical object may become a graphic or UI structure, but the change must be staged enough to preserve identity.

---

# 13. Kinetic Typography

Typography is both language and image.

Use expressive typography, font mixing, and experimentation as sources of visual attraction while keeping the message readable.

Prioritize:

1. comprehension
2. hierarchy
3. rhythm
4. character
5. spectacle

## 13.1 Font Selection & Mix and Match

Choose fonts for their character, word shapes, and fit with the concept. Check that they support the actual language and glyphs in the copy.

Mix serif, sans-serif, monospace, display, or handwritten fonts when their contrast strengthens the composition. Combinations may appear across scenes, within one headline, or within a word when the word remains easy to recognize.

Use font contrast to create:

- a visual hook or distinctive personality
- emphasis on a word or phrase
- emotional contrast or a change of voice
- rhythm, surprise, or a narrative shift

Let the composition determine the number of fonts. Do not impose a universal two- or three-font limit. Judge the result by readability, hierarchy, and the relationship between the letterforms.

Establish visual connections through spacing, alignment, scale, color, repeated forms, or motion behavior. Coherence can come from these relationships even when the fonts are visibly different.

Use expressive faces wherever the copy remains readable; give dense supporting text enough size, spacing, and reading time. Respect font requirements explicitly provided in the brief.

## 13.2 Typography Style Direction

Choose or combine typographic styles according to the concept: editorial, Swiss / modernist, brutalist, retro, playful, technical, or expressive.

Explore contrast in:

- serif / sans-serif / monospace / handwritten forms
- condensed / extended proportions
- light / heavy weight and upright / italic forms
- solid / outline treatment
- scale, case, tracking, baseline, and line breaks

Treat these as creative options, not fixed presets. A style may change between words or scenes when the contrast supports the visual idea and the reading order stays clear.

## 13.3 Experimental Typography

Encourage bold experimentation when the message remains understandable at the intended viewing speed.

Useful approaches include:

- font swaps timed to a phrase, accent, or visual event
- variable-font weight, width, slant, or other axes supported by the chosen font
- mixed letterforms within a word while preserving recognizable word shape
- solid-to-outline changes, unusual spacing, and baseline play
- elastic letterforms, compression, expansion, and expressive distortion
- type / object transformations and intentional crop or grid breaks

Choose the intensity from the concept and the copy. Avoid arbitrary font cycling; make changes contribute visual character, emphasis, or rhythm.

During transformations, preserve a clear path to the next readable state and allow enough time to understand the message. Voiceover may reinforce the text, but it does not replace visual readability.

## 13.4 Animation Units & Techniques

Choose the animation unit intentionally:

- full block
- line
- word
- syllable
- character
- glyph component

Do not default to letter-by-letter animation for ordinary typography. When the brief explicitly calls for **fast-paced kinetic typography, rapid type, type-by-type motion, punchy social typography, high-retention text animation, or an energetic verbal hook**, character-, cluster-, and word-level animation become preferred execution methods when they strengthen rhythm and hierarchy.

**Anti-karaoke does not mean anti word-by-word or anti character-by-character motion.** It means avoiding uniform treatment, equal emphasis, identical timing, and mechanical transcription of every spoken unit.

Use character-level animation when it supports:

- pronunciation
- rhythm
- personality
- transformation
- emphasis
- a clear visual concept

Useful techniques:

- mask reveals
- split text
- tracking changes
- baseline shifts
- weight / width changes
- scale emphasis
- directional replacement
- kinetic line breaks
- word-to-object transformation
- type as foreground wipe
- oversized cropped type


### 13.4.1 FAST / EDGY Kinetic Type — Execution Only

When kinetic typography is requested:

`KINETIC_TYPE_MODE = FAST_EDGY`  
`KINETIC_COPY_MODE = MINIMAL`  
`TYPE_OWNS_FRAME = TRUE`

**COPY**

- default: **1–3 words per beat**
- target: **≤6 visible words per frame**
- no paragraph copy
- no explanatory subtitle by default
- no headline + body-copy layout
- VO carries explanation; type extracts only the strongest words

**MOVE**

- word / cluster / character / glyph animation
- hard crop
- oversized invasion
- 2–4f word replacement
- 1–2f character offset
- 2–5f snap / scale attack
- 3–6f tracking / width hit
- fracture → recompose
- directional swap
- glyph → mask / object / UI / transition

**RHYTHM**

**WORD → HIT → REPLACE → INTERRUPT → HERO WORD → HOLD → TRANSFORM**

At 30 fps:

- micro event: **1–4f**
- hero attack: **3–7f**
- readable lock: **4–12f**
