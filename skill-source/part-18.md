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
5. When audio requires permission, a minimal **Start / Enable Audio** interaction is
   allowed even though the final piece otherwise has no visible player.
6. Do not fight browser autoplay policy with unreliable hacks.
7. After activation, audio position must still follow the authoritative sequence time.

## 24.12 Unified Audio Policy

This skill remains **NO-BGM by default**.

**Important terminology:** “SFX-only” describes the absence of background music.
It does **not** exclude voiceover. When narration is part of the format, VO sits
above the SFX hierarchy.

- Do not add or propose background music unless the user explicitly requests or
  overrides the no-music direction.
- When older motion references imply “music carries the emotion,” translate that
  principle into VO cadence, SFX rhythm, ambience, impacts, tails, tonal texture,
  and silence unless music has been authorized.
- Choose SFX by narrative function first: hero event, movement, support/UI,
  environment/texture, transition, impact, state change.
- For non-explainer work, “tech” is a material/character description rather than a complete SFX function.
- Do not compensate for weak visual rhythm with a constant tonal or musical bed.
- Silence is an authored beat.

## 24.12.1 Explainer Voiceover + Hi-Tech SFX Contract

For **all explainer work**, default to:

**VOICEOVER + HI-TECH SFX + CONTROLLED TECH AMBIENCE + SILENCE — NO BGM**

Voiceover is **required by default** for explainers unless the user explicitly
requests `NO_VO`, `TEXT_ONLY`, `SILENT`, or another narration-free format.

The hi-tech SFX material rule remains hard unless the user explicitly requests a
different sonic material.

### Core rule

Every explainer SFX should belong to a coherent **digital / technological /
electronic / interface / signal / data / precision-mechanical** sound world.

Choose the cue by **narrative function first**, then realize that function using
hi-tech sonic material.

Use this mapping:

| Narrative function | Preferred hi-tech material |
|---|---|
| hero reveal / major fact | focused digital impact, synthetic lock, compact sub-electronic hit, data-confirmation pulse |
| movement / travel | filtered digital air, servo sweep, electromagnetic pass, modulated signal movement |
| UI / support | tactile interface click, relay tick, soft key pulse, micro-servo, confirmation chirp without melody |
| transition | data sweep, signal tunnel, synthetic suction, spectral pass, digital riser that does not become music |
| scan / analysis | scanner pulse, radar-like tick, spectral scan, narrow-band sweep, data readout texture |
| connection / network | node ping, relay contact, electrical handshake, packet pulse, synchronized digital ticks |
| transformation | granular digital morph, synthetic material shift, bit-crush residue, spectral reshape |
| loading / processing | restrained compute texture, clocked pulse cluster, filtered machine chatter, data-stream texture |
| warning / error | short synthetic alert, gated low pulse, distorted data tick, controlled electronic fault cue |
| success / completion | compact confirmation lock, clean synthetic chime-like transient with no melodic sequence |
| ambience / texture | low-level server-room hum, electrical room tone, filtered broadband digital bed, sparse data noise |
| final landing | restrained branded digital signature, precision lock, short synthetic tail |

### Allowed hi-tech vocabulary

Prefer combinations of:

- digital clicks;
- relay ticks;
- servo movement;
- electromagnetic sweeps;
- scanner pulses;
- data pings;
- packet / node ticks;
- synthetic impacts;
- filtered noise bursts;
- spectral sweeps;
- granular digital textures;
- bit / glitch residue used sparingly;
- modem/data-like micro-textures without nostalgia unless appropriate;
- robotic mechanical locks;
- UI confirmation transients;
- electronic suction / reverse pulses;
- short sub-electronic contacts;
- signal tails;
- machine-room / server-room ambience;
- precision mechanical-electronic hybrids.

### Disallowed default explainer vocabulary

Do **not** use these as the default sonic material in explainers:

- natural Foley such as paper, wood, cloth, footsteps, doors, water, wind, or household-object sounds;
- cinematic trailer booms;
- orchestral hits;
- generic Hollywood whooshes;
- organic percussion;
- cartoon boings / pops / whistles;
- acoustic impacts;
- musical arpeggios;
- melodic synth beds;
- chord progressions;
- tonal loops that behave like background music;
- “epic” risers;
- random glitch spam.

If a visual object is physical, translate its action into the hi-tech vocabulary
instead of automatically using literal Foley.

Examples:

- paper card lands → **precision digital contact + tiny servo settle**
- map route draws → **signal trace + node ticks**
- chart rises → **filtered data sweep + compact confirmation pulse**
- photo locks into frame → **electromagnetic snap + short digital tail**
- historical date appears → **scanner acquisition tick**, not a typewriter key
- vehicle moves through a route → **modulated signal/servo travel**, not engine Foley, unless the user explicitly asks for realistic vehicle sound.

### Hi-tech does not mean noisy or futuristic cliché

Avoid filling every beat with bleeps.

The hierarchy remains:

**VO comprehension → hero hi-tech SFX → motion/support hi-tech SFX →
low-level technological texture → silence**

Use silence aggressively. Prefer one coherent cue cluster over many isolated
micro-sounds.

### Non-musical requirement

Explainer hi-tech SFX may contain pitch, resonance, or tonal color, but must not
accidentally form a musical bed.

Avoid:

- repeating notes on a grid;
- recognizable chord movement;
- looping tonal ostinatos;
- arpeggiated UI sequences;
- long pads that function as background music.

A tonal confirmation cue should behave as an **event**, not a song fragment.

### VO masking rule

When VO exists:

- hi-tech ambience must sit behind speech;
- high-frequency clicks must not compete with consonants;
- reduce scanner/data textures during dense sentences;
- place stronger digital impacts in phrase gaps or immediately after semantic landings;
- use pre-SFX 1–4 frames before a reveal only when anticipation helps;
- let short digital tails bridge scene continuity without masking the next phrase.

### Consistency rule

Choose one compact hi-tech family for the whole explainer, for example:

**PRECISION DIGITAL**
- dry relay ticks;
- narrow filtered sweeps;
- clean confirmation locks;
- restrained server-room texture.

**SOFT AI / DATA**
- granular data textures;
- soft synthetic pulses;
- spectral morphs;
