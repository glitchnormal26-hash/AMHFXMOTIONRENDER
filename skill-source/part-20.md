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
- when captions are required, treat them as a persistent layout system with safe
  areas and collision rules, not as an afterthought.

## 24.3 Camera, World and Stillness Reconciliation

1. **Camera movement is expected when the shot direction calls for it.** A written
   push, pull, truck, track, orbit, reframe, or parallax move must become an actual
   time-varying render-camera or world-rig transform.
2. **Camera movement is not mandatory in every shot.** `LOCKED_INTENTIONAL` remains
   valid when stillness creates tension, clarity, contrast, or a stronger read.
3. **A static result is a hard failure only when the authored direction specified
   camera motion.** Do not silently replace planned travel with object motion.
4. **Every camera move needs a visible consequence:** changed framing, parallax,
   scale, occlusion, depth relationship, revealed information, or transition state.
5. **Do not move camera merely to avoid a static frame.** If motion reveals nothing
   and changes no relationship, remove it.
6. **Camera-equivalent DOM transforms are valid 2D/2.5D tools.** A real 3D camera is
   not required for every spatial idea.
7. **When camera is locked, something else may carry continuity:** object relay,
   typography replacement, semantic transform, sound bridge, hard match cut, or
   controlled environmental state change.
8. **Start and landing compositions must work as still frames.** Then author the
   path between them.
9. **Preserve or intentionally break direction.** Track left/right travel, depth
   direction, subject screen position, and outgoing velocity across handoffs.
10. **Tracking is authored framing, not automatic centering.** Use center lock,
    thirds, edge bias, lead, lag, dead zones, and target transfer intentionally.

## 24.4 2D / 2.5D / 3D Selection Rules

1. Start at the lowest dimensional complexity that communicates the idea clearly.
2. Use 2D / 2.5D by default when framing, perspective, scale, crop, occlusion,
   masking, typography, illustration, and simulated depth are sufficient.
3. Escalate to 3D when depth materially improves spatial relationships, reveal,
   product metaphor, parallax, occlusion, lighting state, or a hero transformation.
4. Three.js, React Three Fiber, shaders, post-processing, and 3D interaction are
   runtimes/capabilities, not taste.
5. A 3D object should perform through poses, anticipation, reaction, lag,
   compression, fold, relay, collision, or follow-through when appropriate.
6. Avoid perpetual turntable rotation unless the product itself requires inspection.
7. If 3D complexity increases without increasing clarity, curiosity, or emotional
   impact, step back to a simpler dimensional solution.
8. When 3D is used, the same master-time, camera-contract, hierarchy, and QA rules
   apply as in 2D.

## 24.5 Transition Causality Rules

For every major transition, state:

**CAUSE → ACTION → RESULT**

At least one continuity property should survive whenever possible:

- hero object;
- shape;
- screen-space anchor;
- travel vector;
- camera velocity;
- depth direction;
- light direction;
- material behavior;
- semantic role;
- sound tail;
- typographic fragment;
- product state.

Preferred transition families include:

- element extraction;
- object wipe / foreground occlusion;
- typography as mask or transition surface;
- semantic line/path transformation;
- card fold / hinge / depth turn;
- subject tracking with camera lag or lead;
- parallax environment traversal;
- motivated push-through;
- match geometry / match motion hard cut;
- shader/light-field state handoff;
- product-world assembly from already-visible fragments.

Do not make every transition use the same family.

## 24.6 Background and Surface Rules

1. Background language is selected from the brief, not inherited from a starter.
2. Do not default every project to dark nebula, particles, horizontal lanes, or
   luminous streaks.
3. Use theme-responsive gradients only when atmosphere, state, energy, material,
   or scene continuity benefits from them.
4. Interactive gradients may react to type hits, object movement, pointer, scroll,
   drag, proximity, click, or state change when interaction is part of the piece.
5. A moving gradient must not compete with the hero or become generic wallpaper.
6. Background surfaces may combine two or more authored layers such as base color,
   mesh/gradient, paper, grain, grid, tint, light, haze, image, or depth geometry.
7. A flat single-color surface remains valid when brutal/minimal art direction
   deliberately calls for it.
8. Bright background elements beneath important light text must be reduced or moved.
9. Bloom/glow is a hierarchy tool. It should peak around meaningful activation and
   decay rather than remain permanently on.
10. Use actual post-processing bloom for optical glow in WebGL when needed; do not
    fake universal glow on all typography.

## 24.7 Motion-Blur and Velocity Rules

1. Blur direction should relate to motion direction when blur is used.
2. Horizontal travel should bias horizontal blur; vertical travel should bias
   vertical blur.
3. Expand SVG/filter bounds so trails are not clipped.
4. Remove expensive blur/filter states after the event when they are no longer needed.
5. Speed ramps should transfer attention or momentum between semantic beats.
6. Do not repeat the same fast-slow speed-ramp shape as a decorative signature.
7. Entrance and exit timing may be asymmetric: designed arrival, faster departure,
   unless the exit itself is the story event.
8. Use holds after impacts so the eye can register the result.

## 24.8 Deterministic Browser-Motion Architecture

For code-driven motion, one authoritative time/frame source owns playback.

Preferred pipeline:

**MASTER TIME / FRAME → AUTHORED TIMELINE STATE → DOM / CAMERA / WEBGL / R3F /
AUDIO SYNC → RENDER → SEEK / REPLAY / CAPTURE**

Hard rules:

1. Do not let independent clocks drive important visual state when deterministic
   seeking or capture matters.
2. Avoid `Date.now()` and `performance.now()` as authored sequence time.
3. Avoid uncontrolled `setInterval()` for sequence-critical typing or stepping.
4. Avoid unseeded per-frame `Math.random()` in reproducible render paths.
5. Avoid cumulative `position += velocity * dt` when the same timestamp must always
   reproduce the same frame.
6. Setup-time seeded randomness is allowed when stable after initialization.
7. Procedural motion should be a deterministic function of master time/state.
8. Expose a stable `seek(t)` or frame-seek API when programmatic QA/export is needed.
9. Mark the project ready only after critical fonts and assets are loaded.
10. Capture resolution and DPR must be explicit, not accidental browser state.
11. Mixed DOM/WebGL/R3F projects must apply camera and render state after seeking.
12. Pause, replay, seek, VO/SFX sync, and capture must all agree on the same timeline.

## 24.9 Fixed Stage and Responsive Preview

For fixed-composition video work:

- author at a known stage size such as 1920×1080 or 1080×1920;
- fit the entire stage to the browser window with scale;
- do not reflow the composition merely because the preview window changes size;
- treat responsive web experiences differently when the deliverable itself is
  responsive rather than video-like.

The user/platform-specified aspect ratio always overrides defaults.
If no aspect ratio is provided for a standard explainer, 16:9 is a safe default;
for short-form/social, use the platform or requested ratio rather than assuming 9:16.

## 24.10 Development Files vs Final Delivery

There is no conflict between multi-file development and single-file delivery.

- During development, multi-file CSS/JS/assets are allowed and often preferable.
- Use a no-cache local server when local ES modules or rapid iteration require it.
- For a requested portable browser deliverable, consolidate to a direct-open
  `index.html` when technically practical.
- Inline CSS and project JS when `file://` portability is required.
- CDN dependencies may remain online dependencies when the user accepts them.
- Avoid local `fetch()`/XHR in direct-open deliverables because browser security may
  block it under `file://`.
- Do not imply that Node, Puppeteer, or Python is required merely to watch a final
  single-file motion piece if it is not.
- Export tooling is a production option, not a viewing dependency.

## 24.11 Autoplay, Player and Audio Gesture Rules

1. Visual-only or SFX-free browser pieces may autoplay and loop when appropriate.
2. The visible player/debug scrub UI is off by default in the final deliverable.
3. `?debug=1` or an equivalent mode may expose pause, scrub, frame/time readout, and
   QA controls.
4. Browser audio policies may require a user gesture before VO/SFX playback.
