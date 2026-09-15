# Production Verification — Creative + Technical Finalization

A technically correct encode is not proof of a production-ready motion piece.
Substantial final delivery therefore uses two independent verification tracks:

1. `TECHNICAL_VERIFIED` — deterministic capture, valid duration, codec/stream checks,
   requested dimensions/FPS, and required audio presence when applicable.
2. `CREATIVE_VERIFIED` — the production manifest proves that styleframes,
   proof-of-motion, camera energy, hero authority, continuity material, anti-PPT,
   art direction, still-frame quality, and payoff gates were explicitly reviewed.

Only the combination of both states may produce `FINAL_VERIFIED`.

## Required production sequence

Do not jump directly from brief to a 30–90 second final render.

### 1. Production plan

Create a project-specific production manifest from
`references/production-manifest.example.json`.

The manifest must declare:

- one visual language;
- one visible continuity carrier;
- semantic beats/scenes;
- hero visual for each beat;
- camera mode for each beat;
- depth plan;
- typography role;
- `CAUSE → ACTION → RESULT` for every major transition;
- the visible material/property that survives each transition.

### 2. Styleframe gate

Create and inspect at least five representative still compositions before committing
to final animation. Required coverage includes opening, hero impact, transition
midpoint, a settled middle frame, and final payoff.

Animation must not be used to hide weak illustration, primitive hero design, poor
material response, flat depth, or generic composition.

### 3. Proof-of-motion gate

Before an expensive long-form render, prove the most difficult 8+ second section.
Choose the section with the hardest continuity handoff, camera choreography, kinetic
causality, or material transformation.

Review it at normal speed and, when useful, reduced speed. The proof must demonstrate
readable acceleration, impact, transfer, and settle.

### 4. Creative verification

Run:

```bash
MANIFEST=path/to/production-manifest.json npm run check:creative
```

A failed creative gate blocks production rendering.

### 5. Production render

Run the official production path:

```bash
MANIFEST=path/to/production-manifest.json \
INDEX=path/to/scene.html \
OUT_VIDEO=output/final.mp4 \
npm run render:production
```

`render:production` executes creative verification first. It does not spend time
capturing final frames when the creative manifest is unresolved.

After the MP4 is encoded, the historical stream report is normalized to:

```text
status=DRAFT
technical_status=TECHNICAL_VERIFIED
creative_status=NOT_COMBINED
```

The final combiner then joins technical and creative reports. Only both passing yields:

```text
status=FINAL_VERIFIED
technical_status=TECHNICAL_VERIFIED
creative_status=CREATIVE_VERIFIED
```

## Direct renderer status

`render:ffmpeg` / `export:mp4` remain useful as renderer smoke tests, previews, and
technical diagnostics. Their successful stream verification alone must never be used
as creative approval for a substantial delivery.

For client/final work, `render:production` is authoritative.

## Review principle

The manifest is not permission to rubber-stamp weak art. Gate values must be truthful.
If representative stills look like developer art, generic cards, clip-art, tutorial
geometry, repeated screens, or weak compositions, mark the relevant gate `FAIL`, keep
the work as `DRAFT`, and redesign before rendering.
