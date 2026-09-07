- pre-SFX cues
- SFX sentence stages where relevant
- impact construction
- material-to-sound mapping
- spatial treatment
- silence / negative-space points
- tail bridges
- sync offsets
- event clustering
- reuse / sonic motif strategy
- VO masking notes

## If asked for implementation

Provide:

- concise motion rationale
- complete code or procedural steps
- key tunable values
- VO / marker setup
- SFX sync guidance
- render / preview instructions
- verification checklist
- layout / collision strategy when text or UI is programmatically generated
- master-timeline / scene-ownership strategy for GSAP or similar tools
- representative frame-inspection points
- cinematic intensity level when 3D / cinematic direction is requested
- camera vocabulary and start / landing poses
- lens / FOV rationale
- 2D ↔ 3D bridge strategy when both systems are used
- deterministic render strategy for HTML / Three.js / GSAP output
- performance budget assumptions for realtime WebGL

## If asked for critique

Lead with the most important problems and exact fixes.

## If asked to “make it better”

First diagnose what “better” means in context:

- clearer
- faster
- more premium
- more energetic
- more emotional
- more readable
- more polished
- more brand-consistent
- more curious
- more retention-driven
- more tactile
- more edgy
- more synchronized with VO
- more memorable sonically

Then change the system accordingly rather than adding random effects.

---

# 26. Final Quality Gate

Before final delivery, ask internally:

## Purpose

- Does every important motion serve communication, hierarchy, curiosity, emotion, or continuity?

## Retention

- Is there a reason to watch the next moment?
- Does the sequence repeatedly create and resolve visual questions?
- Is the frame ever fully resolved for too long?

## Hierarchy

- Is there a clear hero action?
- Are secondary elements actually secondary?
- Is interruption intentional?

## Timing

- Are there meaningful contrasts in pace?
- Are holds long enough?
- Is anything waiting unnecessarily?

## Easing

- Does velocity communicate the intended weight?
- Is overshoot justified?

## Composition

- Do key frames work as still images?
- Are crops and safe areas correct?
- Is perspective helping attention rather than showing off technique?

## Illustration

- Does illustration behave rather than merely slide?
- Are transformations conceptually readable?

## Typography

- Can the viewer read the message comfortably during normal-speed playback at the expected display size?
- Does type animation support language rather than obscure it?
- Does font mixing create intentional visual interest while preserving word recognition and hierarchy?
- Do experimental transformations provide enough time in readable states to understand the message?
- Were layout and optical alignment re-checked after font swaps or variable-font changes?
- Does the typography participate in the evolving visual world instead of repeatedly behaving like a title card?
- When camera movement is used, does it reveal, prioritize, connect, transform, or carry typographic information?
- Are must-read words given a readable state before becoming crops, occluders, portals, planes, or abstract transition material?
- Do camera direction and reading direction support each other?
- If typography occupies depth, is hero ownership clear across foreground, hero, support, and background planes?
- Can outgoing typography, its negative space, motion vector, or geometry meaningfully cause the next scene?

## VO

- Are hero words visually prioritized?
- Is animation following meaning and phrasing instead of every syllable?
- Are pauses used intentionally?

## SFX

- Is the piece still following the no-BGM default?
- Does each sound have a role?
- Are hero sounds actually distinct from motion, support, and texture sounds?
- Are major events shaped as intentional sonic sentences rather than stacks of random layers?
- Is material identity consistent?
- Are small events clustered instead of individually sonified?
- Do tails bridge scenes where continuity benefits?
- Is spatial treatment consistent with visual direction and depth?
- Is VO intelligibility protected from high-mid masking and long tails?
- Is there enough silence?
- Does the sound improve tactility without becoming noisy?

## Consistency

- Does the piece use a coherent motion vocabulary?
- Does it use a coherent sound vocabulary?

## Restraint

- Can any motion be removed without losing meaning?
- Can any SFX be removed without losing impact?
- If yes, consider removing it.

## Collision Safety

- Were actual rendered text / UI bounds checked where tools allow it?
- Do unrelated primary information blocks remain collision-free?
- During transitions, is attention ownership obvious?
- Are outgoing elements actually removed, hidden, masked, or visually subordinated before incoming hero content competes?
- Were safe areas verified at both settled frames and transition frames?

## Motion Density & Anti-Presentation

- Does the piece contain meaningful changes in hierarchy, framing, spatial relationship, or information state?
- Would the sequence still make sense if several scenes were swapped? If yes, is scene causality too weak?
- Does each scene evolve the same visual world, or does it feel like a new artboard?
- Is the dominant grammar more authored than repeated fade + small translate?
- Are SaaS UI elements behaving as product states / spatial objects instead of centered screenshots?
- When kinetic typography appears before SaaS, does the product feel like the payoff / visualization of the claim rather than a separate slide?
- Does any major speed ramp transfer hierarchy and momentum into a readable landing instead of repeating a generic fast-slow pattern?
- Are SaaS sounds chosen by function first, with technical character used as material rather than as a generic “tech SFX” category?
- Are decorative eyebrow labels, scene numbers, fake timecodes, pseudo-HUD strings, and filler microcopy absent unless they carry real information or are explicitly required?
- Is negative space being allowed to stay empty instead of being filled with ornamental metadata?
- Does each substantial scene have a clear hero gesture or a deliberate reason to remain still?
- Does outgoing motion, geometry, light, or sound cause the incoming scene where practical?
- Are velocity, scale, direction, and holds varied intentionally?
- Does ambient motion support the hero instead of pretending to be the hero?
- Does the final brand resolution grow from prior visual language rather than arriving as a detached end slide?
- Do typographic scenes evolve through framing, crop, persistence, depth, or role transfer rather than resetting to centered headline layouts?
- If camera and typography interact, does their relationship change meaning or spatial understanding instead of simulating a decorative presentation zoom?

## Physical-Digital Hybrid & Object Relay

- Does each physical prop communicate process, material, interaction, or transition rather than merely decorate the frame?
- Is there a readable hero-object relay when the sequence crosses several environments?
- At every relay, is the transfer cause visible and is at least one useful property inherited?
- Are material transformations semantically related to what the source object does or means?
- If objects scatter or collide, does one destination or surviving hero become clear afterward?
- When digital elements become tangible, is their identity preserved through silhouette, position, vector, material, or function?
- Does camera tracking eventually release the hero when context or product comprehension needs to take ownership?
- Does any large scale escalation create a new role or reveal rather than simply making the object bigger?
- Can product UI emerge from prior cards, lines, fragments, or objects instead of appearing as an unrelated screenshot?
- Are flash, blur, DOF, and exposure changes helping a specific handoff rather than hiding weak continuity?
- After dense motion, is there a deliberate breath state where the viewer can understand the result?
- If typography and objects interlock, is the must-read word still recognizable at normal speed?
- Does the ending simplify toward a product, word, or brand state when simplification would increase impact?
- Are the extracted principles authored for this brief rather than copied from the reference's surface styling?

## Programmatic Motion

- Is the master clock deterministic?
- Do pause, replay, seeking, and reduced-motion states affect all relevant motion systems coherently?
- Are DOM and WebGL layers synchronized when both are used?
- Are key transition labels or timecodes available for QA?
- Can the layout survive the longest expected copy without accidental overlap?

## Shader Gradient / Bloom / R3F

- Is an animated gradient doing a narrative or hierarchy job rather than filling empty space?
- If ShaderGradient is used, are only the parameters needed for the current state being animated?
- Does gradient motion calm down when typography or UI needs a readable hold?
- Is bloom attached to genuinely bright / emissive ownership rather than applied uniformly?
- Is ShaderGradient being treated as the gradient source and post-processing as the optical bloom stage?
- Does bloom peak at a meaningful event and decay afterward?
- Is React Three Fiber being used as scene/runtime structure without replacing authored timing logic?
- Are continuous `useFrame` systems synchronized with the master clock when deterministic playback matters?
- Do gradient, R3F scene, DOM/UI, camera, post-processing, pause, replay, and seeking remain coherent?
- Was React / R3F / ShaderGradient version compatibility checked for the chosen stack?

## Cinematic 3D

- Was the cinematic intensity level chosen intentionally?
- Does every major camera move reveal, connect, emphasize, anticipate, or transition?
- Do camera start and landing frames work as compositions?
- Is FOV / lens behavior intentional and stable?
- Does the hero object have readable poses instead of perpetual rotation?
- Are foreground, midground, and background assignments supporting attention?
- Is lighting reinforcing hierarchy or state change?
- Are bloom, DOF, fog, blur, grain, and chromatic effects restrained?
- Does 3D improve the idea compared with a simpler 2D / 2.5D solution?

## Editing & 2D / 3D Continuity

- Does each scene transition have a clear edit logic?
- Is movement direction preserved or intentionally broken?
- When switching between DOM / 2D and 3D, is there a readable visual bridge?
- Are screen-space focal points aligned at transition moments?

## Deterministic Render

- Is final playback driven by an authoritative timeline or frame time?
- Are procedural random systems seeded when reproducibility matters?
- Are fonts, textures, and critical assets loaded before capture?
- Is target resolution explicit and independent of accidental device DPR?
- Can representative frames be reproduced by seeking to the same time?
- When frame accuracy matters, is the final capture path deterministic rather than uncontrolled realtime screen recording?

## Performance

- Does preview performance preserve intended timing and easing?
- Are geometry, shadows, textures, particles, and post-processing appropriate to the target?
- Are expensive effects justified by visible narrative value?
- Does replay / looping avoid memory growth or accumulating objects?

## Technical

- Is the result editable, performant, and correctly formatted?

## Verification

- Was the output actually previewed or rendered when tools made that possible?
- Was it reviewed with sound and without sound?
- Were representative frames captured or inspected around every major transition?
- Were text overlap, z-order, clipping, and safe-area failures explicitly checked?
- If the piece uses code, was playback behavior validated rather than assuming successful execution means successful motion design?

The goal is not maximum animation.

The goal is not maximum sound.

The goal is:

**maximum clarity, curiosity, character, and impact with the minimum motion and sound necessary.**

---

---

# 24. v3.8 Unified Browser Motion, Anti-PPT & Explainer Rules

These rules are part of the main Motion Designer skill. They are not a secondary
resource layer. Apply them together with the rest of this file and choose the
context-appropriate branch when two defaults appear to pull in different
directions.

## 24.1 Structural Anti-Presentation Laws

1. **One evolving world is the default.** Do not build a sequence as a stack of
   full-screen cards that merely fade, slide, or `autoAlpha` on and off.
2. **A scene change needs a cause.** The next state should be caused by camera,
   object, typography, material, light, UI state, sound, crop, occlusion, or an
   intentional hard cut.
3. **Repeated scene shells are a failure pattern.** Three or more scenes using the
   same `kicker → title → body → badges` hierarchy should trigger redesign.
4. **One shot = one dominant statement.** Supporting information may exist, but it
   must not compete with the primary visual action.
5. **Hierarchy should arrive in order.** Primary statement / hero → main object or
   proof → supporting detail. Do not let decorative status elements arrive before
   the reason to look.
6. **Motion should change meaning or expectation.** If removing a transition does
   not change hierarchy, continuity, anticipation, or understanding, it may be
   decorative.
7. **Do not solve transitions with opacity alone.** Fades are allowed, but repeated
   fade + small translate is not an authored transition vocabulary.
8. **Do not expose the edge of the world accidentally.** Camera-equivalent pans,
   whips, or translations must not reveal an empty stage boundary.
9. **Do not use editor-preset shock as cinematic language.** Repeated zoom-spin,
   yaw-whip, blur-hit, or generic light-leak cuts quickly read as a template.
10. **Use expensive or spectacular effects selectively.** One or two standout
    moments are stronger than the same signature effect on every cut.
11. **A beautiful still frame can still be a slide.** Anti-PPT is evaluated across
    time: continuity, causality, hierarchy, and choreography matter more than polish.
12. **Metadata is content only when it means something.** Do not invent scene
    numbers, fake timecodes, category slugs, pseudo-HUD labels, or technical
    microcopy merely to make the frame feel designed.
13. **Mockup density is a visual exception.** A real interface may contain many
    words because it is read as an image/product state; do not copy that density
    into explanatory overlay text.
14. **Reference layouts are not recipes.** Extract timing, continuity, hierarchy,
    transition causality, and camera logic; do not inherit the reference's branded
    skin or exact composition.

## 24.2 Unified Text-Density Rules

Use text density according to format rather than one universal word limit.

### High-retention social / kinetic passage

- default to 1–4 dominant words per beat;
- keep most frames below roughly 6 visible words unless the landing needs more;
- VO carries explanation, type carries impact;
- reset crop, scale, position, depth, or wording on meaningful beats;
- do not animate every word identically.

### Promo / opener / bumper

- prefer one short claim, name, number, or hero phrase;
- secondary copy should be rare and genuinely useful;
- a long sentence is usually a signal to split the beat or visualize the idea.

### Explainer

- a scene may contain a short sentence plus one key number, label, or annotation;
- charts, maps, timelines, and UI may be information-dense because they are read as
  visual instruments;
- avoid paragraph overlays when VO or visual structure can carry the explanation.

### Accessibility / platform captions

- captions are **off by default for authored motion composition**, but add them when
  the user requests them, the delivery platform requires them, or accessibility is
  a stated objective;
