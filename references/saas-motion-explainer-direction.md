# SaaS Motion Graphic Explainer — Creative Direction

Task-specific art-direction module for SaaS-style motion graphic explainers in the
AMHFX Motion Render workflow. This module governs **what is on screen**: palette,
typography, surfaces, scene grammar, layout, depth, pacing, and anti-template quality.
Use `references/camera-movement.md` and `references/camera-motion.md` for **how the
camera moves through it**.

This is an art-direction module, not a code template. Decide the scene type, palette,
composition, hero motion, camera intention, and pacing before implementation.

## Integration / precedence rule

This module is a task-specific visual dialect layered on top of the repository-wide
quality gates.

When it appears to conflict with `references/visual-quality.md`:

- abstract SaaS geometry may use rounded boxes, soft spheres, torus-like forms, blobs,
  and other simple forms **when they are intentionally art-directed graphic elements**;
- the global anti-primitive rule still rejects raw/default Three.js output, tutorial
  geometry, primitive stand-ins for real-world objects, generic flying-cube filler,
  and unstyled materials;
- simple forms must earn their place through composition, material treatment, depth,
  lighting, motion role, or semantic function;
- an explicit user brief overrides the default profile when the requested visual
  language intentionally differs.

The practical test is not "was a primitive used?" but "does the frame look authored,
coherent, and specific rather than like default developer geometry?"

## 1. Visual language

### Color system

Pick **one palette per concept**. Never mix palettes within a single piece. A palette
contains one dark or light neutral base, one primary accent, and one secondary accent
used sparingly (target <=10% of screen area).

| Palette | Base | Primary accent | Secondary accent |
|---|---|---|---|
| Midnight Violet | `#0B0D17` | `#7C5CFF` | `#38E1C6` |
| Electric Teal | `#0A1414` | `#00E5B0` | `#3B82F6` |
| Warm Neutral | `#F5F3EE` | `#FF5A36` | `#1A1A1A` |
| Indigo Cloud | `#F4F5FA` | `#4F46E5` | `#F59E0B` |

Implement palettes as CSS custom properties (`--bg`, `--accent-1`, `--accent-2`,
`--fg`) so a concept can be re-skinned by swapping one token block instead of editing
every element.

Gradients should normally be two-stop, <=45 degrees, and reserved for emissive/glow
surfaces such as buttons, data lines, particle trails, or localized lighting. Do not
cover the full background with a generic rainbow/mesh gradient merely to make it feel
"modern."

### Typography

Reference direction: geometric/grotesk sans such as Inter, Sora, Space Grotesk, or
General Sans. Use no more than two weights per piece: one bold weight for headline
beats and one regular/medium weight for micro-labels.

- Hero line: 3–6 words, one idea, one animation in.
- Feature label: 2–4 words, paired with an icon or UI fragment, never a sentence.
- Do not animate full explanatory paragraphs into the frame. SaaS explainers read in
  fragments, not prose.
- Protect type during camera speed ramps with stable contrast and camera-space safe
  lanes; inspect both the fastest midpoint and the landing.

### Iconography and surfaces

- Choose one icon family: consistent 2px rounded line icons **or** soft duotone fills.
  Do not mix styles inside one piece.
- UI panels: soft shadow, 12–16px corner radius, and a 1px hairline border around
  8–12% opacity. Floating cards are valid SaaS language when hierarchy and depth are
  authored rather than repeated as interchangeable tiles.
- 3D abstract forms: rounded boxes and soft-shaded sphere/torus-like forms are allowed
  when they function as designed abstract graphics. Use flat/gradient-lit materials,
  restrained roughness/specular response, and deliberate lighting.
- Avoid default Three.js materials, harsh specular metal, checker textures, hard
  tutorial shadows, and generic primitives with no narrative connection.

## 2. Composition and layout

- Author to a fixed 1920x1080 (16:9) stage with roughly 80px inner safe margin.
- Keep hero content inside the central ~85% unless an intentional crop is part of the
  composition.
- Anchor the hero on a one-third or intentional center-grid point. Do not leave the
  entire shot dead-center-static.
- Held hero states may use 2–4px deterministic idle drift or equivalent low-amplitude
  motion, but this is ambient support, not a substitute for authored camera changes.
- Build at least three visual depth bands when useful:
  background atmosphere -> hero/UI midground -> foreground micro-UI, cursor, occluder,
  chip, or particle accent.
- Negative space needs a role: reading lane, landing zone, directional tension, or
  counterweight. Empty space without purpose is not composition.

## 3. Shot library — 10 recurring scene types

Use these as a vocabulary, not ten templates. Across a niche batch, vary shot types and
camera states instead of reusing one composition with different copy.

1. **Hero product reveal** — single UI panel or 3D wordmark assembles from fragments,
   settles, and holds.
2. **Isometric dashboard flythrough** — camera glides across a tilted UI plane with
   layered cards and meaningful depth.
3. **Data flow / pipeline diagram** — nodes connect via animated routes with pulses or
   packets traveling along paths.
4. **Before/after split** — chaotic or inefficient state transforms into an organized
   state with a visible causal bridge.
5. **Feature card carousel** — 3–4 cards enter in sequence with icon + 2-word labels and
   restrained parallax.
6. **Abstract network / node cluster** — a loose lattice forms, breathes, or rotates
   gently without becoming generic flying-object filler.
7. **Device mockup stack** — laptop/phone/product surfaces show related UI with slight
   spatial separation and controlled camera tilt.
8. **Metric counter / growth chart** — counting numbers pair with a line/bar chart or
   other world-embedded measurement.
9. **Integration / connector** — two or three brand-agnostic systems visibly connect,
   transfer, slot, or hand off state.
10. **Icon choreography** — a compact set of icons or UI fragments orbit, sequence,
    sort, or assemble into a meaningful workflow.

## 4. Motion and pacing principles

### Easing vocabulary

Default GSAP vocabulary for SaaS work:

- `power2.out` for entrances;
- `power1.inOut` for holds, calm transfers, and idle/ambient motion;
- `back.out(1.4)` for at most one deliberate delight moment per piece;
- `linear` only for continuous background drift where constant velocity is itself the
  intended visual behavior.

Camera easing follows the more specific rules in `references/camera-movement.md` and
`references/camera-motion.md`.

### Beat timing

A useful default beat is:

```text
0.4–0.6s entrance
1.5–2.5s readable hold
0.3–0.4s exit / transfer
```

A 6–8 second concept is usually 2–3 meaningful beats, not a nonstop chain of micro
animations.

### Stagger and focus

- Stagger children by roughly 0.05–0.1s instead of firing everything on frame zero.
- One hero motion owns each shot. Supporting elements should be idle, ambient, or
  subordinate.
- Include at least one moment of stillness/settle. Constant motion reads anxious and
  unfinished.
- Camera and object motion should not always start simultaneously; offset their starts
  when it improves anticipation, causality, or readability.

## 5. Avoiding generic "AI slop"

Run every SaaS concept against this checklist before calling it complete:

- [ ] One named palette only; no uncontrolled rainbow/mesh-gradient treatment.
- [ ] Palette implemented through reusable tokens where practical.
- [ ] No default/unstyled Three.js materials or tutorial geometry.
- [ ] No generic flying cubes/spheres with no semantic role.
- [ ] Not everything animates at once; stagger and secondary idle behavior are present.
- [ ] At least one readable hold exists.
- [ ] One icon style is used consistently.
- [ ] Typography is fragmentary: headline, label, number, or hook—not a paragraph.
- [ ] Background, midground, and foreground separation are visible when depth is useful.
- [ ] The hero remains the attention owner during its key beat.
- [ ] Camera movement has a reason and lands; it does not drift endlessly.
- [ ] Consecutive beats do not behave like unrelated full-screen slide swaps.

## 6. Technical notes for AMHFX Motion Render

- Define each concept palette as CSS custom properties at the concept root.
- Author at fixed 1920x1080 (or an equivalent fixed stage) and separate viewport-fit
  scaling from the narrative camera transform.
- Prefer the structure:

```text
setup (stage / renderer / scene / camera)
build (objects / UI / materials from palette tokens)
timeline (GSAP master timeline with labeled semantic beats)
render(t) / idle (deterministic ambient motion)
verification (still frames + encoded playback)
```

- Keep Three.js polycount and particle counts modest for this stylized language. Spend
  performance headroom on stable 60fps motion, high-quality edges, antialiasing,
  readable type, and smooth camera updates rather than geometric detail for its own
  sake.
- Expose deterministic `seek(t)` / OPENER control for snapshots and frame export.

## 7. Explainer beat structure

For a single SaaS niche concept around 6–10 seconds:

1. **Hook (0–1s)** — abstract palette/shape establishes mood; usually no explanatory
   text yet.
2. **Reveal (1–3s)** — hero object or UI assembles using a shot type from the library.
3. **Highlight (3–6s)** — one or two feature labels or micro-interactions stagger in.
4. **Settle / loop point (6–8s)** — motion resolves to a clean idle state suitable for
   a loop, logo/product lockup, or CTA handoff.

The structure is a planning baseline. Extend or compress it only when the brief's
argument needs a different duration.

## 8. Camera pairing

Load `references/camera-movement.md` and `references/camera-motion.md` with this module.
The creative direction decides the hero, layout, visual depth, and beat purpose; the
camera modules decide push/pull, pan/tilt, capped orbit, truck/pedestal, parallax,
crane, whip-pan, micro-drift, follow/tracking, speed ramps, and framing continuity.

For short SaaS/product clips, aim for multiple visibly distinct framing states when the
concept benefits from an active camera, but protect the readable holds. A micro-drift
is support motion, not evidence that the camera gate passed.

## SaaS direction gate

For a task that claims this SaaS profile, `SAAS_DIRECTION_GATE=PASS` requires all of the
following to be truthful:

```text
ONE_NAMED_PALETTE=PASS
TYPE_FRAGMENT_GATE=PASS
DEPTH_LAYERING=PASS|NOT_REQUIRED
HERO_MOTION_GATE=PASS
STAGGER_HOLD_GATE=PASS
CAMERA_PAIRING=PASS|NOT_REQUIRED
ANTI_TEMPLATE_GATE=PASS
```

Use `SAAS_DIRECTION_GATE=NOT_REQUIRED` for work that is not using this SaaS visual
profile. Do not mark `PASS` from code inspection alone; representative stills and the
encoded playback remain the visual authority.
