## 17.4 No Decorative Editorial Metadata

By default, **do not add small labels whose main purpose is to make the frame look designed, editorial, technical, cinematic, or like a concept-film deck**.

Remove elements such as:

- eyebrow / kicker text with no necessary information
- invented category labels such as `CONCEPT FILM`, `PROCESS`, `SYSTEM`, or similar framing copy when the viewer does not need that category
- decorative scene, chapter, shot, or sequence numbers shown in the final composition
- fake timecodes, timestamps, coordinates, version strings, percentages, IDs, or status readouts
- decorative bullets, dots, slashes, brackets, crosshairs, corner marks, or separators attached to otherwise unnecessary microcopy
- pseudo-HUD or pseudo-terminal text added only to create a “tech” aesthetic
- tiny secondary copy that exists only to fill negative space

Use the **meaning-removal test**:

> If removing the label does not reduce comprehension, navigation, product accuracy, brand meaning, legal clarity, or narrative causality, remove it.

Do not fill empty space merely because it is available. **Negative space is allowed to remain empty.**

Small metadata-like text is allowed when it is genuinely required, for example:

- it is part of the real product UI and product accuracy matters
- it communicates a real state, status, navigation cue, measurement, or data value
- the brief explicitly requires chaptering, timestamps, technical readouts, or documentary labeling
- it is required brand, legal, accessibility, or platform information

Even when allowed, keep it subordinate to the hero and remove decorative punctuation that does not improve reading.

This rule applies to the **final visual output**. Internal timeline labels, debug timecodes, QA overlays, scene IDs, and production annotations remain useful but must be disabled or removed from final delivery.

---

# 17.5 Layout Safety & Collision System

Readable composition must be enforced, not merely intended.

For any programmatic, template-driven, responsive, or code-generated motion piece, establish a **layout safety system before animation**.

## 17.5.1 Measure Before Motion

Before animating text, UI cards, labels, captions, or genuinely required persistent HUD elements:

- measure their screen-space bounds
- identify safe-area limits
- identify elements allowed to overlap intentionally
- identify primary, secondary, and persistent regions
- confirm the longest expected copy fits the designed region

For HTML / DOM, prefer actual layout measurement such as `getBoundingClientRect()` after fonts are ready.

For Canvas / WebGL / Three.js overlays, calculate or project representative screen-space bounds rather than assuming world-space spacing guarantees readability.

For generated text, do not rely only on hard-coded Y coordinates.

## 17.5.2 Collision Rules

By default, fail the layout if:

- two primary text blocks intersect
- a primary text block intersects a UI card containing different information
- incoming and outgoing hero headlines occupy the same reading region at readable opacity
- captions collide with CTA, controls, platform-safe regions, or persistent HUD
- text becomes clipped because scale or tracking changed during motion
- a transition temporarily creates unreadable stacking that was not explicitly designed

Intentional overlap is allowed only when it is the visual concept and comprehension remains clear.

Do not use opacity alone to excuse collisions. Two text blocks at 40–60% opacity can still compete visually.

## 17.5.3 Transition Ownership

During scene changes, explicitly define which scene **owns attention**.

Recommended default:

1. outgoing hero resolves or begins a clear exit
2. outgoing support elements reduce visual priority
3. transition object / wipe / transformation takes ownership
4. incoming hero enters
5. incoming support follows after the eye finds the hero

Avoid two unrelated hero headlines peaking at the same time.

As a practical default, do not let two unrelated hero blocks remain above roughly 25–35% readable opacity in the same screen region for more than a few frames.

If overlap is the transition device, make the hierarchy obvious through scale, crop, masking, occlusion, or directional continuity.

## 17.5.4 Safe-Area Discipline

For 1080 × 1920 vertical work, establish project-specific safe areas before animation.

A reasonable starting guide when platform UI is unknown is:

- horizontal design margin: about 6–8% of width
- top protected region: about 5–8% of height
- bottom protected region: about 7–12% of height

These are starting references, not universal platform specifications.

Do not place essential copy at the exact viewport edge merely because the design frame allows it.

## 17.5.5 Debug Layout Mode

For code-generated motion, provide a temporary debug mode when practical that can show:

- text bounding boxes
- safe-area guides
- scene ownership
- current timeline label / timecode
- active hero element
- collision warnings

Remove or disable debug overlays in final delivery.

---

# 18. Transition Design

A transition should do at least one of these:

- continue motion
- transform an existing object
- change hierarchy
- create a reveal
- match shape or direction
- use occlusion
- follow VO logic
- punctuate a narrative shift

Preferred transition families:

- foreground wipe
- match shape
- scale bridge
- object transformation
- typography replacement
- crop jump
- perspective shift
- directional continuation
- hard cut after anticipation

Avoid using multiple unrelated transition styles in a short piece.

---

# 18.5 Motion Density & Anti-Presentation Choreography

A piece can be technically animated, visually polished, and still feel like a slide presentation.

Do not judge motion quality by the number of keyframes.

Judge it by **meaningful changes in attention, framing, spatial relationship, state, and causality**.

## 18.5.1 Presentation-Motion Test

Assume the sequence is drifting into presentation motion when several of these are true:

- every scene begins from a clean neutral layout
- headline appears, support copy appears, UI card appears, then everything exits
- elements enter primarily through fade + small translate
- every scene has a centered title-card composition
- each shot can be rearranged in any order without breaking visual logic
- the background resets while foreground content changes
- transitions exist only to hide scene replacement
- cards behave like PowerPoint objects instead of parts of one world
- camera movement is a generic slow push rather than a reveal
- the same entrance timing repeats scene after scene
- the next scene is unrelated to the previous scene's final action
- product screenshots are displayed rather than choreographed
- decorative eyebrow labels, fake scene numbers, pseudo-timecodes, or technical microcopy are added to make each frame feel like a designed concept-film card

If most scenes could be exported as individual presentation slides with no loss of logic, redesign the sequence.

## 18.5.2 Continuous-World Rule

Prefer one evolving stage over many disconnected layouts.

Maintain continuity through at least one of:

- persistent environment
- recurring horizon / light field / structural motif
- shared depth system
- camera-direction continuity
- object carry-over
- match position
- match scale
- match shape
- shared motion vector
- sound tail
- repeated material behavior

A scene change should feel like the world **changed state**, not like a new artboard became visible.

## 18.5.3 Start-In-Progress Rule

Do not begin every scene from rest.

Useful starts:

- camera is already completing a pullback
- a foreground object is crossing frame
- one UI module is already reacting
- a light node is already traveling
- a previous object is transforming into the new hero
- the frame begins macro and context is not yet visible

Starting in progress creates immediate continuity and removes the “next slide” feeling.

### 18.5.3.1 Product Does Not Need to Share Every Frame with the Claim

Do not force headline, kinetic typography, and SaaS UI to remain side-by-side throughout the sequence.

When the claim is better communicated through kinetic typography, let typography own the frame first. Then let SaaS enter as the visualization, proof, or mechanism of that claim.

A strong product-reveal relationship may be:

**CLAIM FELT THROUGH TYPE → VISUAL PROPERTY SURVIVES → PRODUCT WORLD DISCOVERED → UI EXPLAINS THE CLAIM**

This creates contrast between expressive communication and precise product comprehension.

The product reveal must still be causally connected. Preserve a shape, line, glyph, motion vector, crop, screen-space position, sound tail, or semantic motif across the handoff.

Avoid treating the kinetic section and the product section as two unrelated chapters. They may be separate in composition, but they should remain continuous in cause and effect.

## 18.5.4 Product UI Must Behave

Do not treat SaaS UI as a screenshot placed on a background.

Possible authored behaviors:

- dashboard becomes a spatial hero plane
- modules separate according to function
- secondary cards orbit or offset in depth only when hierarchy benefits
- a chart or node leaves the UI and becomes a transition device
- one interface panel folds, expands, or flattens into another state
- UI camera angle changes only to reveal structure
- a product state grows from another product state rather than entering as a replacement screenshot

Preserve usability and brand accuracy where the real UI must remain recognizable.

## 18.5.5 Hero + Reaction + Hold

For most substantial moments, define:

- **one hero gesture** that changes hierarchy or meaning
- **one supporting reaction** caused by the hero
- **one readable hold** where the result can be understood

The support action should feel causally linked.

Avoid several unrelated elements independently “doing animation.”

## 18.5.6 Meaningful Change Interval

For short-form retention-driven work, inspect whether the frame remains fully understood and visually unchanged for too long.

As a diagnostic, if roughly 1–3 seconds pass with no meaningful change in:

- hierarchy
- framing
- crop
- scale relationship
- depth relationship
- information state
- visual question
- motion vector
- SFX expectation

ask whether a purposeful reset is needed.

Do not force a reset when comprehension, suspense, or emotional hold is stronger.

## 18.5.7 Velocity Contrast

Avoid identical move lengths, durations, and easing across scenes.

Use contrast such as:

- 3–6 frame snap → 8–15 frame hold
- 12–20 frame controlled travel → 2–4 frame interruption
- fast hero entry → slower support settle
- macro pullback → sudden lock
- abrupt freeze → spatial reveal
- nearly static VO phrase → strong transformation on the hero word

The exact values depend on distance, scale, frame rate, and semantic importance.

## 18.5.8 Spatial Continuity

Let outgoing motion cause incoming composition whenever possible.

Examples:

- card exits right → next shot continues the same vector
- node expands → becomes the circular frame of the next system
- UI panel rotates toward camera → lands as the next full-screen plane
- light flare crosses foreground → reveals the next state behind it
- a group of cards folds inward → becomes a dimensional brand object
- icon silhouette expands → resolves as the final logo mark

Avoid resetting to centered neutral composition after every beat.
