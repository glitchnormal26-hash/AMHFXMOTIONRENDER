# AMHFXMOTIONRENDER

Production-oriented motion rendering runtime built around **Motion Designer v3.8 Full Runtime**.

## Capabilities

- deterministic GSAP timeline motion;
- DOM / SVG / 2.5D continuous-world animation;
- selective Three.js full runtime with bloom/post-processing;
- natural voiceover workflow;
- hi-tech explainer SFX with no-BGM default;
- browser snapshot QA;
- direct deterministic MP4 export with Puppeteer + ffmpeg + ffprobe;
- `LITE_RUNTIME` and `FULL_RUNTIME` engine selection.

## Main entry points

- `SKILL.md` — Motion Designer v3.8 rules and engine-routing contract
- `assets/starter.html` — lightweight starter
- `assets/starter-full-runtime.html` — full runtime starter
- `runtime/` — reusable motion, camera, Three.js, explainer and audio modules
- `scripts/export-mp4.mjs` — one-command direct MP4 exporter
- `scripts/snap.mjs` — deterministic snapshot QA
- `scripts/serve.py` — local no-cache server
- `references/` — detailed production guidance

## Setup

```bash
npm install
```

`ffmpeg` and `ffprobe` must also be available on `PATH` for final MP4 export.

## Preview

```bash
python scripts/serve.py
```

## Export MP4

Fast path:

```bash
QUALITY=fast node scripts/export-mp4.mjs
```

Final-quality path:

```bash
QUALITY=final node scripts/export-mp4.mjs
```

Narrated explainer guard:

```bash
REQUIRE_VO=1 QUALITY=fast node scripts/export-mp4.mjs
```

## Explainer audio default

**VOICEOVER + HI-TECH SFX + CONTROLLED TECH AMBIENCE + SILENCE — NO BGM**

A narrated explainer is not `FINAL_VERIFIED` unless the actual MP4 contains the required audio stream.

## Runtime selection

Use `LITE_RUNTIME` when DOM/SVG/GSAP is sufficient.

Escalate to `FULL_RUNTIME` only when true 3D, state-driven WebGL, post-processing,
or the full continuous-world helper stack materially improves the result.

## License

See `THIRD_PARTY_LICENSES.md` for required third-party notices.
