
## Signature easing

Choose one dominant easing behavior for most of the project.

## Duration scale

Use a small family of durations rather than arbitrary values.

Suggested starting bands:

| Motion type | Typical duration |
|---|---:|
| micro feedback | 80–160 ms |
| snap / punch | 100–220 ms |
| quick transition | 160–280 ms |
| standard element motion | 280–450 ms |
| major transition | 450–700 ms |
| dramatic reveal | 700–1400+ ms |

These are starting points, not laws.

Duration should scale with:

- travel distance
- visual weight
- information complexity
- importance
- emotional tone
- VO pacing
- sound transient

## Entrance grammar

Choose a small set of entrance behaviors.

Examples:

- rise + settle
- mask reveal
- crop reveal
- foreground wipe
- scale from focal point
- directional replacement
- tracking expansion
- illustration assembly
- perspective snap
- shape transformation

## Exit grammar

Exits should usually be simpler and faster than entrances unless the exit itself is the narrative event.

## Transition vocabulary

Limit the project to a small set of transition ideas so the sequence feels authored rather than assembled.

---

## 3.15 Default High-Retention Social Direction

For social / short-form / high-retention briefs, default to:

`SOCIAL_RETENTION = HIGH`  
`KINETIC_TYPE_MODE = FAST_EDGY`  
`TYPE_OWNS_FRAME = TRUE`

Execution rules:

- open with motion on frame one
- show **1–3 dominant words** at a time by default
- let **VO carry explanation; on-screen type carries impact**
- avoid subtitles, paragraphs, and descriptive copy during kinetic passages
- keep most frames under **6 visible words total** unless a deliberate final landing needs more
- reset crop, scale, position, depth, or wording every meaningful beat
- use one unmistakable hero word per passage
- use 2–7 frame attacks for high-energy type events at 30 fps
- use short 4–12 frame readable locks between bursts
- let type cross edges, collide, replace, compress, expand, fracture, or become transition material
- use hard cuts or directional continuity more often than fades
- remove support copy entirely when the hero phrase already communicates the idea

Do not default to:

- headline + subtitle + paragraph
- centered title card
- explanatory captions covering the frame
- repeated fade + slide
- equal emphasis on every word
- slow cinematic drift over static text

Preferred rhythm:

**HOOK → HIT → INTERRUPT → HERO WORD → HOLD → TRANSFORM → NEXT HOOK**

# 3.25 Specificity Gate — Do Not Output Generic Concepts

Do not consider a concept complete if it can be described only with adjectives such as:

- premium
- sleek
- modern
- futuristic
- dynamic
- cinematic
- engaging
- energetic
- clean

These words may describe tone, but they are not an art direction.

Every substantial concept should define concrete behavior.

At minimum, specify:

- **hero subject** — the exact visual object or information that dominates
- **hero gesture** — what physically or graphically changes
- **camera / framing event** — what the viewer learns because framing changes, or why the camera stays still
- **transition cause** — what existing object, motion, light, crop, sound, or semantic idea causes the next state
- **support reaction** — what responds after the hero action
- **material behavior** — rigid, glassy, soft, paper-like, luminous, mechanical, etc. when relevant
- **readable landing** — what the final pose communicates
- **SFX behavior** — not merely a sound-category label

Prefer instructions like:

> The assistant card rises as the camera pulls back, revealing three agent nodes already attached behind it; the nearest node crosses foreground and becomes the circular mask for the next workflow state. A dry relay click anticipates the node activation by 2 frames, followed by one short filtered air pass and a compact lock on landing.

Avoid instructions like:

> Use a sleek futuristic transition with dynamic cards and cinematic whooshes.

## Cause → Action → Result Rule

For each major scene, be able to state:

**CAUSE → ACTION → RESULT**

Example:

- cause — user submits a prompt
- action — prompt bar compresses into a node while the camera reveals connected agents
- result — the viewer understands that one request activates a larger system

If the action does not change meaning, hierarchy, context, or anticipation, it may be decorative.

## Three-Concrete-Details Rule

When proposing a hero moment, include at least three concrete design details from different categories, such as:

- composition / crop
- object behavior
- timing / velocity
- depth / camera
- material / light
- typography behavior
- transition logic
- SFX structure

Do not satisfy this by listing three adjectives.

---

# 3.5 Cinematic Intensity Levels

Do not interpret the word **cinematic** as a command to maximize camera movement, depth of field, bloom, or 3D complexity.

Before implementation, choose a cinematic intensity level that matches the communication goal.

## Level 1 — Clean Product Motion

Use when clarity, UI communication, and product comprehension are primary.

Typical behavior:

- mostly 2D / 2.5D
- restrained perspective
- one or two depth layers
- minimal camera-equivalent movement
- typography and UI remain dominant
- clean lighting or flat graphic shading
- limited post-processing
- transitions driven by crop, mask, scale, or object continuity

Use this as the default for dense SaaS explanation when real 3D is not necessary.

## Level 2 — Cinematic SaaS

Use when the product or automation concept benefits from spatial storytelling.

Typical behavior:

- one primary 3D hero or spatial system
- motivated camera push, pull, truck, or reveal
- foreground / midground / background staging
- selective lighting choreography
- controlled depth cues
- DOM / UI and 3D share attention deliberately
- stronger shot-to-shot continuity
- selective DOF, bloom, fog, or motion blur only when they support hierarchy

This is the preferred level for premium SaaS explainers that need more cinematic character without becoming a full 3D film.

## Level 3 — Hero Film

Use only when the brief benefits from strong dimensional storytelling.

Typical behavior:

- deliberate 3D blocking
- explicit lens and camera language
- lighting as narrative information
- real spatial transitions
- foreground occlusion and deep parallax
- stronger material behavior
- more demanding render and performance requirements
- shot planning closer to film / title design than UI presentation

Level 3 should not be chosen merely because the tool supports it.

## Intensity Escalation Rule

Start at the lowest level that can clearly communicate the idea.

Escalate only when added dimensionality produces a meaningful benefit such as:

- clearer spatial relationships
- stronger reveal
- better product metaphor
- more memorable transformation
- useful parallax or occlusion
- lighting-driven state change
- a hero moment that cannot be achieved as clearly in 2D / 2.5D

If 3D complexity increases without increasing clarity, curiosity, or emotional impact, reduce the level.

---

# 4. Retention Architecture

Build motion sequences using this loop:

**HOOK → QUESTION → REVEAL → RESET**

The loop may take 0.5 seconds or several seconds depending on content density.

## Hook

Create an immediate reason to look.

Possible hooks:

- unexpected crop
- oversized typography
- a visual already in motion on frame one
- partial illustration
- an object entering before context is visible
- an extreme close-up
- abrupt scale relationship
- a visual contradiction
- unusual perspective
- foreground obstruction
- sound arriving slightly before the visual

Avoid generic “fade in everything” openings.

## Question

Leave something unresolved.

Examples:

- show only part of an illustration
- hide information behind another layer
- crop the important object
- begin the sentence before the full composition is visible
- move toward something before showing what it is
- introduce a visual relationship that has not yet resolved

The viewer should mentally predict the next state.

## Reveal

Reward the prediction.

Reveal through:

- pullback
- slide
- mask opening
- perspective correction
- foreground wipe
- object separation
- typography replacement
- illustration transformation
- scale reversal
- negative-space reveal
- match cut

The reveal should feel earned, not random.

## Reset
