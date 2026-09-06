# Anti-PPT — Browser Motion Verification Layer

> 
Use this reference as an additional verification layer for browser-generated
motion. The main `SKILL.md` remains the primary motion-direction authority.

## Mechanical failure checks

A browser motion piece is at high risk of feeling like a presentation when:

1. Three or more full-screen `<section>` / `.scene` blocks are merely turned
   on and off with opacity / `autoAlpha`.
2. Every scene rebuilds the same hierarchy: kicker → title → body → badges.
3. The world disappears between beats instead of being carried by camera,
   subject, object, material, typography, or environment continuity.
4. The only motion is Ken Burns, fade, scale bump, or repeated slide-in.
5. Every transition uses the same device.
6. Background motion is generic and unrelated to the brief.
7. Text is forced into “information layout” rather than one strong statement.
8. Decorative metadata, fake HUD labels, scene numbers, or pseudo-technical
   microcopy are added without narrative purpose.

## Preferred corrections

- Treat the piece as one evolving world.
- One shot should make one dominant statement.
- Use at most two meaningful text levels in a typical hero frame.
- Let an existing element cause the next shot.
- Move or reframe the world/camera, not only the text.
- Use object wipes, extraction, push-through, match geometry, depth handoffs,
  semantic transforms, or motivated hard cuts rather than repeated fades.
- Keep background motion subordinate to the hero.
- Preserve one continuity property across transitions: object, shape, vector,
  screen position, camera velocity, light, material, semantic role, or sound.
- Use asymmetric timing: authored entrance / faster exit unless the exit is
  itself the narrative event.

## Anti-template typography

Avoid:
- all-caps 800-weight centered headings in every scene;
- identical stagger on every word;
- identical size, position, and entry direction in consecutive beats;
- a paragraph where VO should carry explanation;
- “hero word + subtitle + caption + badges” as a default layout.

Prefer:
- one dominant phrase or hero word;
- sentence case or intentionally brutal type when the brief calls for it;
- one selected highlight language per piece;
- punctuation or final word as a separate rhythmic event;
- position and scale tied to the visual subject;
- camera/framing that reveals typography spatially.

## Contrast gate

When bright type is present:
- keep the local text pocket dark enough for crisp edges;
- reduce bright background elements beneath the type;
- do not use bloom as a substitute for contrast;
- if grayscale values behind the title approach the title value, simplify or
  darken that region.

When dark type is present:
- create a sufficiently light local surface;
- keep texture low-frequency behind important words.

## Transition test

For every transition, answer:

**CAUSE → ACTION → RESULT**

Example:

- cause — a product card becomes the new hero;
- action — card detaches, gains depth, crosses foreground, occludes frame;
- result — the same card resolves as the structural plane of the next state.

If the transition can be removed without changing meaning, hierarchy,
continuity, or anticipation, it may be decorative.

## Screenshot heuristics

At representative frames ask:

- Could this frame be dropped into a corporate slide deck unchanged?
- Can the eye identify the hero within ~0.2 seconds?
- Is there a readable relationship between foreground, hero, and background?
- If text is hidden, does the world still have authored structure?
- Is something moving because of camera/world continuity rather than every
  element independently animating itself?
- Does the next scene feel caused or merely loaded?

Any repeated “loaded screen” feeling is a signal to rebuild the transition.
