# Motion Designer v3.8 — Merge Notes

## What changed

- Version bumped from 3.7 to 3.8.
- browser-production rules are no longer treated as a secondary precedence layer.
- Anti-PPT, deterministic browser architecture, explainer routing, starter usage,
  snapshot QA, direct-open delivery, and export rules are merged into the main
  `SKILL.md` as sections 24–25.
- Explicit conflict-resolution rules were added for music, missing brief data,
  camera motion, hard cuts, starter usage, dimensionality, delivery architecture,
  autoplay/audio, text density, captions, aspect ratio, and export strategy.
- The bundled `assets/`, `references/`, and `scripts/` remain as implementation
  resources and deeper examples.

## Important naming note

Inside an agent-skill folder the canonical entry file remains `SKILL.md` for
compatibility. A standalone copy named `SKILL-motion-designer-v3.8.md` is also
provided outside the package for easy identification.

## Explainer Hi-Tech SFX update

- Explainer sound direction is now **HI-TECH SFX ONLY by default**.
- Added digital/interface/signal/data/scanner/servo/relay/electromagnetic/synthetic sound families.
- Added function-to-hi-tech-material mapping.
- Natural Foley, cinematic trailer booms, generic Hollywood whooshes, cartoon sounds, acoustic percussion, and accidental musical synth beds are excluded from the default explainer vocabulary.
- Physical actions are translated into hi-tech sonic equivalents unless the user explicitly requests realistic Foley.
- VO intelligibility remains the top audio priority.
- SFX-only/no-BGM default remains unchanged.


## Voiceover reliability update

- Clarified that “SFX-only” means **no BGM**, not “no voiceover”.
- Explainer default is now **VO + hi-tech SFX + controlled tech ambience + silence**.
- Voiceover is required by default unless the user explicitly opts out.
- If TTS is available, actual narration must be generated rather than stopping at a script.
- Silent visual drafts are marked `DRAFT — VO_PENDING` and cannot be presented as final narrated explainers.
- Added browser audio-gesture rules that preserve VO instead of removing it.
- Added final-export rule: frame capture does not capture browser audio.
- Updated `export-frames.mjs` to mux `AUDIO`, or `VOICEOVER` + optional `SFX`, into the encoded video.

## Natural VO provider update

- Added final-quality voice provider hierarchy.
- Preferred final VO order: human/native recording → ElevenLabs → Google Gemini-TTS/Chirp 3 HD → Azure Neural HD.
- Browser/system TTS is preview-only and must not be used as final narration when an approved premium provider is available.
- Added Indonesian `id-ID` native-accent selection rules.
- Added mandatory voice auditioning with real project vocabulary.
- Added spoken-script normalization and natural narrator direction.


## Engine Selection Contract update

- Added mandatory capability checks before claiming an engine/provider is used.
- Added engine-selection matrix for GSAP, DOM/SVG, Three.js, R3F, shaders, image
  generation, VO, hi-tech SFX, browser QA, audio assembly, and export.
- Added explicit VO fallback chain:
  Human → ElevenLabs → Google Gemini-TTS/Chirp 3 HD → Azure Neural HD →
  `VO_PROVIDER_PENDING`.
- Browser/system TTS is final-output forbidden when an approved provider is available.
- Added engine lock-state block (`MOTION_ENGINE`, `VO_ENGINE`, `SFX_ENGINE`, etc.).
- Added production status states including `FINAL_VERIFIED`.
- Corrected the old “SFX-only wins” wording to **NO BGM + required explainer VO**.
- Added ffmpeg/audio-stream verification to the final-delivery contract.


## Direct one-command MP4 export update

- Added `scripts/export-mp4.mjs`.
- One command now performs deterministic browser frame capture, H.264 encoding,
  audio mix/mux, and ffprobe verification.
- Added `QUALITY=fast` (30 fps) and `QUALITY=final` (60 fps) presets.
- Added automatic discovery of final mix, VO, SFX, and ambience audio assets.
- Added `REQUIRE_AUDIO=1` and `REQUIRE_VO=1` finalization guards.
- Added `.verify.json` output and `FINAL_VERIFIED` stream checks.
- Updated the skill so an explicit MP4 request treats HTML/frame sequences as
  production intermediates rather than final delivery.


## Full Runtime + unified identity update

- Added `runtime/` modular production library.
- Added state-driven Three.js runtime with deterministic grid, dust, stars,
  nebula, tunnel, flow, camera state, hero state and selective bloom.
- Added reusable directional SVG motion blur and typography utilities.
- Added continuous-world camera helpers (`look`, `home`, `into`, `settle`,
  `pushThrough`) and 3D sentence-pan helper.
- Added explainer helpers (`say`, `unsay`, `draw`, `drawDash`, `extract`,
  proxy morph and scene registry).
- Added VO/SFX master-timeline audio runtime.
- Added `assets/starter-full-runtime.html`.
- Added `references/full-runtime.md`.
- Added package scripts/dependency metadata and a debranded README.
- Removed legacy source-project naming from skill text, references, starter
  comments, scripts and manifest-facing documentation.
- Kept the required MIT copyright/permission notice in
  `THIRD_PARTY_LICENSES.md`.


## AMHFXMOTIONRENDER repository packaging

- Prepared the full runtime as repository `AMHFXMOTIONRENDER`.
- Added repository README, `.gitignore`, `.env.example`, npm syntax-check command,
  and GitHub Actions QA workflow.
- Preserved Motion Designer v3.8 as the skill identity while using
  `AMHFXMOTIONRENDER` as the repository/package identity.
