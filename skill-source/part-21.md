
`assets/starter-full-runtime.html`

Reusable modules:

```text
runtime/motion-utils.js
runtime/camera-rig.js
runtime/explainer-helpers.js
runtime/three-scene.js
runtime/audio-runtime.js
runtime/index.js
```

### Escalation rule

Default:

`LITE_RUNTIME`

Escalate to:

`FULL_RUNTIME`

only when at least one full-runtime capability materially improves
communication, spatial continuity, or visual quality.

### Full-runtime deterministic state

The WebGL runtime exposes tweenable state for:

`grid, dust, nebula, stars, tunnel, flow`

`camX, camY, camZ, camRoll, bloom, shake`

`heroO, heroS, heroX, heroY, heroZ`

`heroRotX, heroRotY, heroRotZ`

GSAP may tween those values.

The WebGL renderer must not own an independent clock.

### Full-runtime helper inventory

The runtime provides:

- `splitChars`;
- `splitWords`;
- `blurTween`;
- directional blur presets;
- text entrance/exit choreography;
- highlight drawing;
- punctuation beats;
- deterministic type-on;
- deterministic counters;
- `look`;
- `home`;
- `into`;
- `settle`;
- `pushThrough`;
- 3D sentence pan;
- `say`;
- `unsay`;
- `draw`;
- `drawDash`;
- `extract`;
- proxy morphing;
- scene registry;
- voice/SFX timeline synchronization.

Read `references/full-runtime.md` when using FULL_RUNTIME.

### Styling prohibition

Full runtime is capability, not style.

Do not inherit:
- placeholder palette;
- generic geometry;
- sample headline;
- sample route/card;
- default glow amount;
- default background composition.

Replace those from the actual brief.


## 24.17 Starter Usage Rules

Bundled starters are **architecture, not art direction**.

- `assets/starter.html` — opener/promo/bumper/title/kinetic browser scaffold.
- `assets/starter-explainer.html` — continuous-action explainer scaffold.
- `assets/starter-explainer-kartun.html` — cartoon-collage scaffold.
- `assets/starter-explainer-jurnalisme.html` — visual-journalism scaffold.
- `assets/starter-explainer-katalog.html` — white-catalog scaffold.
- `assets/starter-explainer-sketsa.html` — vintage-sketch scaffold.

Before final delivery replace placeholder:

- palette;
- typography;
- copy;
- image/illustration assets;
- highlight shape;
- surface treatment;
- transition signature;
- background language;
- glow/bloom behavior;
- object choreography;
- camera path;
- timing;
- SFX mapping.

If the starter fights the concept, change the starter architecture instead of bending
art direction to the template.

## 24.18 Resource Reading Rules

The references remain useful as deeper implementation documents, but their rules are
already part of this main skill.

Read only when deeper detail is useful:

- `references/anti-ppt.md` — structural anti-slide verification;
- `references/architecture.md` — deterministic browser architecture;
- `references/full-runtime.md` — complete modular runtime inventory and selection rules;
- `references/explainer.md` — explainer production details;
- `references/techniques.md` — implementation recipes;
- `references/roadmap.md` — maintenance ideas for the bundled resources.

Do not treat a reference file as higher or lower authority. Interpret it through the
context conditions written in this main v3.8 rulebook.

## 24.19 Visual Verification Rules

After a substantial implementation batch, inspect representative moments whenever
render/preview tools allow it.

Capture at least:

- opening / first readable frame;
- first hero hit;
- one dense mid-sequence frame;
- pre-transition frame;
- middle of a major transition;
- transition landing;
- product/argument payoff;
- final brand/CTA frame.

Evaluate:

- hero identification speed;
- contrast;
- clipping;
- safe area;
- text collision;
- z-order;
- camera consequence;
- continuity;
- placeholder leakage;
- background competition;
- anti-PPT symptoms;
- readability after high-speed motion;
- UI integrity;
- audio/visual timing when audio is available.

Code that runs is not automatically motion that works.

## 24.20 Snapshot vs Full Export

Snapshot verification and full export are different tasks.

- Use `scripts/snap.mjs` or equivalent key-frame capture for iteration and QA.
- Use `scripts/export-frames.mjs` only when deterministic frame export is useful.
- Do not render thousands of frames merely to inspect a draft.
- When frame accuracy matters, seek the authoritative timeline to each output frame.
- Allow render state to settle before capture in mixed DOM/WebGL projects.
- When MP4 delivery is requested and the environment supports it, prefer `scripts/export-mp4.mjs` so rendering, H.264 encoding, audio mix/mux, and stream verification happen in one command.


## 24.20.1 Direct MP4 Delivery Contract

When the user explicitly requests a video / MP4 deliverable and the environment
has the required render/export capabilities:

`FINAL_DELIVERABLE = MP4`

Do not stop at:
- `index.html`;
- a frame sequence;
- a VO script;
- SFX files;
- an ffmpeg command the user must run manually.

Those are production intermediates.

Use the bundled one-command exporter:

`scripts/export-mp4.mjs`

Default execution:

```bash
node scripts/export-mp4.mjs
```

Quality modes:

```bash
QUALITY=fast node scripts/export-mp4.mjs
QUALITY=final node scripts/export-mp4.mjs
```

Recommended meaning:

- `QUALITY=fast` — 30 fps, faster H.264 encode, suitable for normal explainers
  and rapid iteration;
- `QUALITY=final` — 60 fps, higher-quality encode, use when motion density,
  typography, 3D, or the user's delivery requirement materially benefits.

For narrated explainers:

```bash
REQUIRE_VO=1 QUALITY=fast node scripts/export-mp4.mjs
```

The exporter should:

1. load the OPENER-compatible HTML;
2. wait for assets/fonts and `window.OPENER.ready`;
3. seek the authoritative timeline frame-by-frame;
4. render deterministic PNG frames;
5. encode H.264 MP4;
6. auto-detect or accept `AUDIO`, `VOICEOVER`, `SFX`, and `AMBIENCE`;
7. mix/mux real audio;
8. verify the final file with `ffprobe`;
9. emit a verification report;
10. only report `FINAL_VERIFIED` when the relevant streams exist.

Conventional auto-detected audio locations include:

- `audio/final-mix.wav|mp3|m4a|aac|flac|ogg`
- `audio/voiceover.wav|mp3|m4a|aac|flac|ogg`
- `audio/sfx-mix.wav|mp3|m4a|aac|flac|ogg`
- `audio/ambience.wav|mp3|m4a|aac|flac|ogg`

### MP4 finalization gate

If MP4 was requested:

`HTML_ONLY = NOT_FINAL`

`FRAME_SEQUENCE_ONLY = NOT_FINAL`

`SILENT_MP4_WHEN_REQUIRED_VO = NOT_FINAL`

`PLACEHOLDER_VO = NOT_FINAL`

`MP4_WITH_VERIFIED_VIDEO_AND_REQUIRED_AUDIO = FINAL_VERIFIED`

If the environment lacks Puppeteer, ffmpeg, ffprobe, or a required final VO
provider, do not fake success. Use the appropriate pending status and preserve
the production assets.


## 24.21 Anti-PPT Mechanical Gate

Before approving a browser motion piece, reject and rebuild if several of these are true:

- three or more full-screen scenes are only toggled by opacity;
- repeated kicker/title/body/badges shell;
- every cut uses the same transition;
- camera/world is static while text repeatedly enters/exits;
- no subject, object, vector, shape, or sound carries continuity;
- backgrounds are generic or inherited from the starter;
- the composition is readable as a corporate slide without temporal context;
- every object animates independently with no primary event;
- transitions reveal no new relationship;
- the world fully resets between beats;
- motion effects are more memorable than the message;
- fake editorial/technical metadata has been added as decoration.

Passing this gate does not guarantee quality, but failing it is a strong signal that the
piece still behaves like a presentation.

## 24.22 v3.8 Conflict Resolution Matrix

Use these unified outcomes when older rules appear to conflict:

| Apparent conflict | v3.8 unified rule |
|---|---|
| Background music can carry emotion vs no-BGM direction | **NO BGM wins as the default.** For explainers, VO remains required unless explicitly disabled; rhythm comes from VO + hi-tech SFX + ambience + silence. Music is allowed only after explicit user override. |
| Ask explainer setup questions vs do not block on missing info | **Ask only for fundamental blockers.** Otherwise use sensible defaults and state assumptions. |
| Camera motion expected vs do not move camera unnecessarily | **Execute camera motion when authored or narratively useful; otherwise `LOCKED_INTENTIONAL` is valid.** |
| One evolving world vs hard cuts | **World continuity is the default, but motivated hard cuts are valid when continuity is preserved through shape, vector, sound, framing, semantics, or contrast.** |
| Use starter for correct rig vs do not copy templates | **Starter supplies architecture only; all visual skin and motion signature are replaced from the brief.** |
| 3D/R3F/shaders supported vs do not default to 3D | **Use them only when dimensionality materially improves communication or experience.** |
| Single `index.html` delivery vs multi-file architecture | **Develop multi-file when useful; consolidate to single-file only when portability/direct-open delivery is desired.** |
| Autoplay/no player vs browser audio gesture restrictions | **Keep player hidden, but allow a minimal start/audio-enable interaction when browser policy requires it.** |
| Social text should be extremely short vs explainer may contain more information | **Text-density rules are format-specific.** Social is ultra-sparse; explainer may use sentence + number/annotation; real UI can remain dense as image content. |
| Captions off by default vs accessibility/platform needs | **Captions remain off by default but become required when requested, platform-mandated, or accessibility is a stated goal.** |
| 16:9 explainer default vs platform-specific aspect ratio | **Explicit user/platform ratio always wins; 16:9 is only the fallback when unspecified.** |
| Visual-only autoplay loop vs VO/SFX sync | **Visual autoplay may remain; audio must obey browser permission and master-timeline sync.** |
| Verify with snapshots vs export every frame | **Snapshots are for iteration; full frame export is for requested/needed final delivery.** |

---

# 25. v3.8 Browser Motion Production Path

For substantial browser motion:

**BRIEF → DEFINE MESSAGE / RETENTION GOAL → MOTION DIRECTION → STYLE/WORLD RULES →
RUNDOWN → CHOOSE/ADAPT STARTER → AUTHOR ONE EVOLVING WORLD → APPLY CAMERA / HERO /
TRANSITION CAUSALITY → ENGINE LOCK → VO/SFX CHOREOGRAPHY → ANTI-PPT GATE → SNAPSHOT QA → REFINE →
DIRECT-OPEN DELIVERY WHEN NEEDED → DETERMINISTIC EXPORT ONLY WHEN REQUESTED**

For explainers:

**ARGUMENT / SOURCES → VISUAL FAMILY → VIEWPOINT PLAN → ENTITY ASSETS → VISUAL
INSTRUMENTS → VO SCRIPT → ENGINE CAPABILITY CHECK → GENERATE/OBTAIN REAL VO → BUILD / RETIME TO REAL VO →
HI-TECH SFX DESIGN → AUDIO MIX / MUX → FINAL VISUAL + AUDIO QA → FINAL_VERIFIED**

For cinematic SaaS/product work:

**CLAIM / PRESSURE → TYPE OWNS FRAME → HERO WORD / OBJECT → ELEMENT EXTRACTION →
CAMERA OR WORLD HANDOFF → PRODUCT-WORLD ASSEMBLY → READABLE PRODUCT PROOF → BREATH →
NEXT TRIGGER → BRAND / CTA RESOLUTION**

The goal remains:

**maximum clarity, curiosity, character, continuity, and impact with the minimum
motion, dimensional complexity, and sound necessary.**
