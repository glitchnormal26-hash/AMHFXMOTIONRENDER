# Production-state vocabulary

Use these states when useful and only when truthful:

`REFERENCE_GATE = PASS | FAIL`

`SKILL_USAGE_GATE = PASS | FAIL`

`CAMERA_MODE = MOVING | TRACKING | REFRAME | LOCKED_INTENTIONAL`

`CAMERA_ACTIVITY = ACTIVE_DEFAULT | LOCKED_FOR_REASON`

`CAMERA_GATE = PASS | FAIL`

`COMPOSITION_GATE = PASS | FAIL`

`KINETIC_GATE = PASS | FAIL`

`WORLD_CONTINUITY = CONTINUOUS | MOTIVATED_BREAK | RESET_FAILURE`

`ANTI_PPT_GATE = PASS | FAIL`

`SFX_MODE = ASSET_ONLY | NONE`

`RUNTIME = LITE_RUNTIME | FULL_RUNTIME`

`STATUS = DRAFT | SFX_PENDING | EXPORT_PENDING | FINAL_VERIFIED`

`FINAL_VERIFIED` is reserved for an actual deliverable that passed the relevant
visual, timing, stream, composition, camera, kinetic, continuity, and audio checks—not
for code that merely runs.

---

# 0. Core Objective: Hold Attention Through Authored Motion

For short-form, social, explainer, branded content, product video, title work, and
narrative motion, optimize for:

- clear visual hierarchy;
- strong still-frame composition;
- camera/framing evolution;
- curiosity and anticipation;
- readable information;
- differentiated kinetic behavior;
- intentional timing;
- meaningful transition causes;
- coherent motion language;
- spatial continuity;
- brand consistency;
- technical feasibility;
- restraint;
- polished final delivery.

The viewer should repeatedly feel one of these:

- What is that?
- What happens next?
- Where is this going?
- Why did that move?
- What will this become?
- What is about to be revealed?
- How will this resolve?

If the sequence becomes visually resolved for too long, introduce a new visual
question through framing, hierarchy, spatial relationship, or motion logic—not random
extra movement.

Retention comes from **controlled change, anticipation, reward, contrast, and rhythm**.

---

# 1. Operating Principles

1. **Concept before keyframes.** Establish the communication goal, emotional intent,
   and viewer expectation before choosing effects.

2. **Composition before decoration.** Every important frame needs one dominant visual
   owner and a deliberate reading order.

3. **Camera before object-only energy.** If the frame feels static while objects dance
   inside it, re-author the world framing.

4. **Retention before decoration.** Every major motion event should clarify, surprise,
   reveal, redirect, emphasize, transfer attention, or create anticipation.

5. **Hierarchy before complexity.** The viewer should always know where to look.

6. **Curiosity needs incomplete information.** Do not reveal every visual answer
   immediately.

7. **Timing creates personality.** Duration, spacing, velocity, pauses, and rhythm matter
   more than the number of effects.

8. **Easing communicates weight.** Curves should imply mass, energy, material, urgency,
   and intent.

9. **Motion must preserve composition.** A strong still frame is the foundation, but
   the composition must evolve across the sequence.

10. **Change the frame, not only the object.** Framing, crop, perspective, occlusion,
    camera target, and scale relationships can create more energy than isolated
    transforms.

11. **Kinetic type needs differentiated roles.** Avoid one repeated stagger/ease recipe.
    Use hierarchy-driven attacks, replacements, masks, compression, occlusion, spatial
    handoffs, and landings.

12. **Secondary motion supports primary attention.** Supporting animation must not
    compete with the hero action.

13. **Transitions need causality.** Use `CAUSE → ACTION → RESULT`. Decorative transitions
    that do not change meaning, hierarchy, continuity, or anticipation should be rebuilt
    or removed.

14. **SFX are asset-only.** Use only user-supplied or repository `assets/` audio files.
    Never generate, synthesize, search, scrape, or download SFX from inside the skill.

15. **Restraint is a feature.** Do not add animation or sound merely because the tool
    allows it.

16. **Build for the final medium.** Respect frame rate, aspect ratio, safe area,
    playback context, codec, device, and audio environment.

17. **Verify visually and aurally whenever possible.** Plausible implementation is not
    automatically good design.

18. **Never pretend an unrendered result was inspected.** If rendering or preview tools
    are unavailable, state that the result is technically reasoned but visually or
    aurally unverified.

19. **Reference before motion production.** When useful references are available, study
    their composition, camera path, transition logic, hierarchy, and kinetic rhythm
    before implementation.

---

# 2. Understand the Brief

Before designing motion, identify as many of these as the request provides:

- purpose;
- audience;
- platform;
- duration;
- aspect ratio;
- frame rate;
- brand personality;
- existing visual identity;
- primary message;
- retention goal;
- CTA;
- available SFX assets;
- illustration style;
- reference style;
- cinematic intensity / whether true 3D is actually needed;
- camera or lens requirements;
- delivery format;
- implementation tool;
- final render / capture path;
- target playback hardware or performance constraints.

If information is missing, do not block unnecessarily. Make the strongest reasonable
visual decision from the brief and keep the implementation deterministic.

---

# 3. Required visual verification

For substantial motion, inspect at minimum:

- opening composition;
- first hero impact;
- first framing transfer;
- kinetic passage midpoint;
- transition midpoint;
- transition landing;
- final frame.

Reject the render when any of these are true:

- effective framing stays static across several beats without an authored reason;
- hero hierarchy is ambiguous;
- type/UI/decorative elements fight for equal attention;
- kinetic typography is mostly one repeated stagger/fade/slide/scale treatment;
- camera motion is claimed but only subjects move;
- transitions feel like unrelated screens loading;
- camera exposes dead space or creates accidental collisions;
- a starter's default composition or motion signature survives into final work.

`FINAL_VERIFIED` requires all applicable gates to pass.
