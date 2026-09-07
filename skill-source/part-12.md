## 15.13 SFX Cue Sheet

For substantial sound-design work, plan cues with enough detail to reproduce them.

Recommended fields:

| Time / frame | Visual event | SFX role | Source character | Start offset | Peak / contact | Tail | Spatial note | VO masking note |
|---|---|---|---|---:|---:|---|---|---|
|  |  | hero / motion / support / texture |  |  |  |  |  |  |

Do not write cue sheets as “add whoosh here.”

Describe the reason and sonic behavior.

## 15.14 Avoid Generic SFX Language

Avoid defaulting to vague directions such as:

- cinematic whoosh
- futuristic sound
- tech sound
- epic hit
- cool transition sound

Instead specify behavior:

- short filtered air pass with a narrow transient at landing
- soft relay click followed by a 120 ms electrical residue
- low-mid body impact with a glass-like top transient and no long reverb
- suction beginning 3 frames before the card collapse, ending exactly at occlusion

Specific sonic behavior produces less generic work.


## 15.15 Translating Dense Reference Rhythm Into SFX-Only Structure

When a visual reference uses music or a dense soundtrack, extract its **event hierarchy**, not its music bed.

Translate visual density into SFX-only chapters:

- object burst / scatter → one shared travel texture plus selected impacts, not one cue per object
- camera acceleration → directional motion layer that grows with perceived speed
- material transformation → one changing texture that preserves identity through the morph
- clean product landing → reduce motion sound, keep one compact lock / activation cue
- breath section → thin ambience or near-silence
- new trigger → pre-SFX 1–4 frames early when anticipation helps

A useful macro sound rhythm is:

**CLUSTER → TAIL → GAP → HERO CONTACT → QUIET READ → NEXT ANTICIPATION**

If the visual reference feels energetic because of music, do not compensate by filling every frame with effects. Preserve the same contrast between dense and sparse moments using transient density, tail length, ambience, and silence.

---

# 16. VO + SFX Relationship — No BGM Default

Audio hierarchy is:

1. **VO comprehension**
2. **hero SFX / semantic punctuation**
3. **motion and support SFX**
4. **texture / ambience**
5. **silence as contrast**

Do not rely on a beat grid.

Build temporal rhythm from:

- sentence boundaries
- stressed words
- pauses and breaths
- motion acceleration
- impact transients
- transformation phases
- edit points
- tails and silence windows

Prefer:

- hero word → strongest visual emphasis, optionally supported by one focused SFX
- major state change → hero SFX
- spatial transition → movement SFX or tail bridge
- secondary reaction → quieter support cue
- pause → hold, ambience thinning, or silence
- final brand landing → distinct but restrained sonic signature

When VO exists:

- protect speech intelligibility
- do not hit every stressed word
- simplify SFX during dense sentences
- allow important sounds to land in phrase gaps when possible
- use pre-SFX selectively to anticipate a spoken reveal
- let post-SFX communicate consequence after the phrase

The sequence should still feel rhythmic with no music because the rhythm is authored into motion, speech, sound events, and silence.

---

# 17. Composition for Motion

Design every important beat as a composition.

Check:

- focal point
- scale hierarchy
- alignment
- negative space
- edge tension
- balance
- contrast
- depth
- safe areas
- crop behavior
- reading order
- next visual question

Motion should move attention through the frame.

Avoid:

- objects drifting without purpose
- camera moves revealing nothing
- important elements crossing unsafe edges accidentally
- scaling from arbitrary anchors
- transitions destroying spatial continuity without intent
- fully centered layouts in every shot
- equal visual weight across the frame

For multi-format delivery, design crop zones from the start.

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

