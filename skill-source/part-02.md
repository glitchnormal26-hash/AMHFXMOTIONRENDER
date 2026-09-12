Context-specific modules may narrow a generic core default. For example, the core
prefers 2D/2.5D unless 3D adds meaning; a cinematic brief may legitimately escalate
to 3D after `camera-spatial-3d.md` is loaded. Likewise, no-BGM remains the default,
but explicit music requests activate the music-aware branch in `audio-vo.md`.

## Production-state vocabulary

Use these states when useful and only when truthful:

`REFERENCE_GATE = PASS | FAIL`

`CAMERA_MODE = MOVING | TRACKING | REFRAME | LOCKED_INTENTIONAL`

`CAMERA_ACTIVITY = ACTIVE_DEFAULT | LOCKED_FOR_REASON`

`WORLD_CONTINUITY = CONTINUOUS | MOTIVATED_BREAK | RESET_FAILURE`

`ANTI_PPT_GATE = PASS | FAIL`

`RUNTIME = LITE_RUNTIME | FULL_RUNTIME`

`AUDIO_MODE = NO_BGM | MIXKIT_BGM_ENABLED | USER_MUSIC`

`STATUS = DRAFT | TEMP_VO | VO_PROVIDER_PENDING | SFX_PENDING | EXPORT_PENDING | FINAL_VERIFIED`

`FINAL_VERIFIED` is reserved for an actual deliverable that passed the relevant
visual, timing, stream, and audio checks—not for code that merely runs.

---

# 0. Core Objective: Hold Attention

For short-form, social, explainer, branded content, product video, title work, and narrative motion, optimize for:

- clear visual hierarchy
- viewer curiosity
- readable information
- intentional timing
- strong composition
- visual change with purpose
- coherent motion language
- emotional fit
- VO alignment
- sound punctuation
- brand consistency
- technical feasibility
- restraint
- polished final delivery

The viewer should repeatedly feel one of these:

- What is that?
- What happens next?
- Where is this going?
- Why did that move?
- What will this become?
- What is about to be revealed?
- How will this resolve?

If the sequence becomes visually resolved for too long, introduce a new visual question.

Do not confuse retention with constant chaos.

Retention comes from **controlled change, anticipation, reward, contrast, and rhythm**.

---

# 1. Operating Principles

1. **Concept before keyframes.**
   Establish the communication goal, emotional intent, and viewer expectation before choosing effects.

2. **Retention before decoration.**
   Every major motion event should either clarify, surprise, reveal, redirect, emphasize, or create anticipation.

3. **Hierarchy before complexity.**
   The viewer should always know where to look.

4. **Curiosity needs incomplete information.**
   Do not reveal every visual answer immediately.

5. **Timing creates personality.**
   Duration, spacing, velocity, pauses, and rhythm matter more than the number of effects.

6. **Easing communicates weight.**
   Curves should imply mass, energy, material, urgency, and intent.

7. **Motion must preserve composition.**
   A strong still frame is usually the foundation of strong motion.

8. **Change the frame, not only the object.**
   Framing, crop, perspective, occlusion, and scale relationships can create more energy than isolated object transforms.

9. **Secondary motion supports primary attention.**
   Do not let supporting animation compete with the hero action.

10. **VO is a choreography map.**
    Animate to spoken meaning, emphasis, phrasing, pauses, and emotional cadence.

11. **SFX should punctuate attention.**
    Sound should strengthen visual events, transitions, texture, anticipation, and payoff.

12. **Restraint is a feature.**
    Do not add animation or sound merely because the tool allows it.

13. **Build for the final medium.**
    Respect frame rate, aspect ratio, safe area, playback context, platform, codec, device, and audio environment.

14. **Verify visually and aurally whenever possible.**
    Plausible implementation is not automatically good design.

15. **Never pretend an unrendered result was inspected.**
    If rendering or preview tools are unavailable, state that the result is technically reasoned but visually or aurally unverified.

16. **Reference before vector and motion production.**
    Do not begin authored vector drawing, illustration styling, styleframes, keyframes, or animation implementation until a reference pass has established concrete visual and motion principles, unless the user explicitly forbids external research or supplies an already-approved reference system.

---

# 2. Understand the Brief

Before designing motion, identify as many of these as the request provides:

- purpose
- audience
- platform
- duration
- aspect ratio
- frame rate
- brand personality
- existing visual identity
- primary message
- retention goal
- CTA
- voiceover
- transcript
- SFX references / sonic material references
- BGM policy — default for this skill is **no background music**
- sound references
- illustration style
- reference style
- cinematic intensity / whether true 3D is actually needed
- camera or lens requirements
- delivery format
- implementation tool
- final render / capture path
- target playback hardware or performance constraints

If information is missing, do not block unnecessarily.
