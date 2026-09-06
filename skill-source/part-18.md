
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

For tracked transitions, inspect at minimum:

- pre-extraction
- extraction frame
- tracking start
- tracking midpoint
- maximum foreground / depth event
- occlusion or transformation midpoint
- incoming reacquisition
- camera landing

Do not approve an element-driven transition only because the first and last frames match. The quality lives in whether identity, vector, depth, and attention survive between them.


## Step 2.5.6 — Parallax Environment Traversal Inspection

When camera parallax carries the viewer from one environment into another, inspect the full travel path rather than only the source and destination scenes.

Check:

- foreground, midground, and background have distinct and intentional depth roles
- the destination is seeded early enough to feel spatially connected when appropriate
- the camera commitment point is readable
- near-field motion strengthens depth without becoming visual noise
- the travel vector remains understandable through the handoff
- threshold geometry or occlusion does not create accidental clipping
- environmental replacement preserves at least one continuity property
- any tracked subject remains readable or is intentionally released
- background-to-hero promotion remains visually traceable
- horizon / vanishing direction does not jump accidentally
- lens behavior remains coherent through the crossing
- UI and typography are not exposed at unreadable perspective during the fastest travel
- motion blur does not erase important threshold information
- the destination environment gains a stable hero and depth hierarchy on landing

Inspect at minimum:

- source environment hold
- destination seed first visibility
- camera commitment
- early parallax separation
- maximum foreground velocity
- threshold approach
- occlusion / crossing midpoint
- first clear destination frame
- environment reacquisition
- final camera landing

If the destination could be replaced by any unrelated environment without changing the transition logic, the spatial handoff is probably too generic.

## Step 2.6 — Programmatic Layout QA

When implementation tools allow it, add automated or semi-automated checks before final approval.

Useful checks include:

- DOM bounding-box intersection tests
- safe-area boundary tests
- text overflow tests
- active-scene / hero ownership assertions
- screenshot capture at labeled timeline moments
- detection of elements remaining visible after their scene exit
- WebGL / DOM synchronization checks during pause, replay, and seeking

A collision detector is a guardrail, not an art director.

It should catch obvious failures; human visual inspection still decides whether intentional overlap, edge tension, and hierarchy work aesthetically.

## Step 3 — Review playback

Check:

- timing
- rhythm
- readability
- easing
- overlaps
- awkward pauses
- visual hierarchy
- retention rhythm
- clipping
- safe area
- continuity
- VO sync
- SFX sync
- sound density
- loop seams

## Step 4 — Listen Without Picture

Check:

- VO clarity
- SFX hierarchy
- unnecessary noise
- repeated whoosh patterns
- impact consistency
- continuous ambience masking VO or important SFX

## Step 5 — Watch Without Sound

Check whether:

- hierarchy still works
- message is understandable
- motion remains intentional
- the sequence does not depend entirely on SFX

## Step 6 — Refine

Fix the cause, not only the symptom.

Examples:

- “feels robotic” → inspect spacing and easing
- “feels slow” → shorten dead time before shortening every animation
- “feels cheap” → simplify effects, improve hierarchy, easing, and sound selection
- “too busy” → reduce concurrent motion and SFX
- “no impact” → strengthen anticipation → action → hold contrast
- “hard to read” → fix size, contrast, spacing, reading time, or competing motion; simplify only the typographic choices that obstruct understanding
- “boring” → introduce unresolved visual information or meaningful frame change
- “SFX feels generic” → reduce layers and choose more distinctive material character
- “VO sync feels karaoke” → animate phrases and hero words, not every word
- “text overlaps during transitions” → fix scene ownership, bounds, exit timing, or layout before reducing font size blindly
- “motion feels like slides” → run the presentation-motion, scene-permutation, and continuous-world tests; redesign scene causality, product behavior, camera/framing logic, and object carry-over before adding more effects
- “3D is moving but scene feels static” → change hierarchy/framing or make the 3D motion cause a narrative event rather than rotate ambiently

## Step 7 — Verify Delivery

Confirm:

- dimensions
- aspect ratio
- frame rate
- duration
- codec / format
- alpha requirements
- audio
- loudness target if specified
- loop behavior
- file naming

Do not call a motion piece finished solely because the code runs.

---

# 23. Critique Mode

When asked to review motion, do not respond with vague taste statements.

Diagnose in this order:

1. communication goal
2. retention / curiosity
3. visual hierarchy
4. composition
5. timing
6. easing / velocity
7. choreography
8. perspective / framing
9. typography
10. illustration behavior
11. VO sync
12. SFX hierarchy
13. continuity
14. brand fit
15. technical quality
16. accessibility

For every issue:

- identify the symptom
- explain the likely cause
- propose a specific fix
- give approximate timing / frame / easing guidance when useful
- specify VO or SFX adjustment when relevant

Example:

**Issue:** The reveal feels weak.  
**Cause:** The object is already fully understandable before the transition.  
**Fix:** Crop 25–35% of the object before the hero phrase, begin the reveal 3 frames before the stressed word, land on the word, then hold 8 frames with one short impact SFX.

Prioritize the 3–5 changes with the greatest visual impact.

---

# 24. Common Failure Modes

Avoid these unless intentionally justified:

- everything animates at once
- every element uses the same duration
- linear spatial movement
- default fade + slide for every entrance
- bounce on every object
- excessive overshoot
- arbitrary rotation
- constant camera drift
- 3D used without conceptual need
- excessive motion blur hiding weak animation
- glow used as a substitute for hierarchy
- particles without narrative purpose
- long stagger chains
- random beat sync
- karaoke word-by-word VO animation
- unreadably fast typography
- animating before composition is solved
- adding effects instead of improving timing
- using many transition styles in one short piece
- overcomplicating simple feedback
- treating “cinematic” as slow zoom + blur + grain
- treating “edgy” as random glitch
- putting whoosh on every movement
- placing SFX on every word
- using risers before every transition
- keeping the frame fully resolved for too long
- changing scenes without visual continuity when a transformation is available
- claiming a result is polished without visual and audio inspection
- relying on hard-coded text coordinates without checking rendered bounds
- allowing outgoing and incoming hero headlines to compete at readable opacity
- using opacity fades to hide layout collisions instead of fixing layout or timing
- leaving prior-scene DOM visible underneath the next scene accidentally
- repeating fade + small translate as the primary grammar across most scenes
- keeping Three.js ambient motion active at full intensity while dense typography needs attention
- letting pause / replay control GSAP while WebGL or ambient loops continue independently
- approving transitions without inspecting frames before, during, and after the handoff
- using generic camera orbit or slow drift to make a shot feel cinematic
- describing a push / pull / truck / track / orbit / parallax move while leaving the active render camera transform static
- evaluating camera key poses in planning code without binding them to the active render camera over time
- tiny numerical camera changes that technically animate but produce no visible framing, parallax, perspective, occlusion, or reveal change
- changing FOV repeatedly without a narrative reason
- using DOF, bloom, fog, motion blur, and chromatic effects simultaneously by default
- allowing post-processing to reduce product or typography clarity
- using a background gradient as generic wallpaper instead of a theme- or state-driven visual field
- keeping the gradient equally active during copy holds, reducing readability and hierarchy
- making glow permanently active with no event, ownership, or decay
- making gradient interaction loop independently of typography, object state, or user input
- using interactive glow or gradient responses that overpower the kinetic type
- treating 3D objects as overly rigid showroom assets when the concept would benefit from expressive performance
- treating 3D objects as perpetual spinners rather than staged performers
- cutting between 2D UI and unrelated 3D scenes without a visual bridge
- rendering final web motion from uncontrolled realtime browser timing when frame accuracy matters
- relying on unseeded procedural randomness for final frame capture
- allowing device pixel ratio to silently alter target render framing or performance
- enabling expensive shadows / post effects everywhere without a performance budget
- calling motion polished when dropped frames materially alter timing or camera smoothness
- using long descriptive on-screen copy when a short kinetic phrase can carry the message
- transcribing VO into long on-screen sentences instead of extracting kinetic anchor words
- adding subtitle/body copy beside kinetic type merely to make the layout feel complete
- letting explanatory typography stay static while only background / camera / 3D moves
- building every SaaS scene as headline + subtitle + centered card
- resetting the environment at every feature change
- using a transition only to hide one finished layout being replaced by another
- treating product screenshots as presentation objects instead of choreographed states
- adding background music to compensate for weak visual rhythm or weak SFX structure
- turning tonal SFX into an accidental musical bed when the direction is SFX-only
- giving every motion event an independent sound instead of clustering cues by hierarchy
- letting long reverb tails blur important VO or the next transient
- adding decorative eyebrow/kicker labels, fake chapter numbers, pseudo-timecodes, slashes, dots, or technical metadata that communicate nothing and merely fill negative space
- filling physical scenes with attractive props that never influence the story, camera, transition, or product reveal
- jumping between physical and digital worlds without a visible relay, contact, shared vector, shape, position, or material cue
- using object explosions / scatter only as spectacle with no surviving hero or readable destination
