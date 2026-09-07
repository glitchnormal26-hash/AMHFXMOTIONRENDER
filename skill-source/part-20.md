7. Retime scene anchors to VO rather than rebuilding the entire animation system.
8. Preserve authored transition durations where possible while remapping scene starts.
9. Sync VO and SFX to the master timeline, including after seeks and pauses.
10. Review with sound and without sound.
11. Mux the final VO/SFX mix into exported video; frame capture alone does not carry audio.
12. Do not claim final sync or final audio quality if the actual narration track was
    not available for review.


## 24.16.1 Engine Selection & Capability Contract

Do not choose production engines by convenience alone.

For every substantial motion/explainer job, resolve the runtime stack before
final implementation.

The required sequence is:

**CAPABILITY CHECK → ENGINE SELECTION → QUALITY GATE → PRODUCTION →
VERIFY REAL OUTPUT → FALLBACK OR BLOCK FINALIZATION**

### A. Capability check

Before claiming an engine/provider is being used, verify that the current
environment actually has access to it.

Check for:

- available tool / plugin / SDK / API;
- valid account or credential access when required;
- supported language / format / codec;
- network or local-runtime requirements;
- export compatibility;
- commercial / licensing constraints when relevant.

Do not write “generated with ElevenLabs”, “rendered with Three.js”, or
“exported with ffmpeg” unless that engine was actually used.

If the preferred engine is unavailable, move to the next approved engine.
Never silently substitute an unapproved low-quality engine for final delivery.

---

### B. Motion engine selection

Use the simplest engine that can faithfully execute the authored motion.

| Need | Preferred engine/runtime | Use when | Avoid when |
|---|---|---|---|
| DOM / typography / UI / 2D motion | **GSAP** | deterministic timeline, kinetic type, UI choreography, masks, transforms, CSS/SVG | simple CSS alone can fully solve a tiny interaction |
| SVG illustration / diagrams | **SVG + GSAP** | draw-on, path morphing, route animation, labels, charts, vector explainers | raster imagery is the actual content |
| 2.5D spatial composition | **DOM/SVG + GSAP world rig** | depth, parallax, camera-equivalent push/pull without true 3D | real geometry/material interaction is required |
| true 3D | **Three.js or React Three Fiber** | geometry, lighting, spatial camera, occlusion, 3D product/system worlds | 2D/2.5D communicates more clearly |
| declarative React 3D | **React Three Fiber** | reusable 3D components, React project integration, interaction | standalone HTML does not need React |
| shader gradient / luminous field | **ShaderGradient / custom WebGL shader when available** | gradient is part of atmosphere, material, light, or state transition | a CSS gradient is visually sufficient |
| bloom / depth / post FX | **Three/R3F post-processing** | optical glow, DOF, fog, motion hierarchy | effect does not improve hierarchy or meaning |

Default selection:

`2D / DOM / SVG → GSAP`

Escalate to:

`2.5D world rig → Three.js / R3F`

only when the concept gains meaningful spatial value.

Do not use R3F merely because it is available.

---

### C. Image / visual asset engine selection

For generated visual assets, prefer the highest-quality image-generation
capability actually available in the host environment.

Selection order:

1. **user-supplied / official / licensed real asset** when authenticity matters;
2. **native high-quality image-generation engine available to the agent**;
3. **connected premium image-generation provider** that supports consistent style;
4. **public-domain / properly licensed source imagery**;
5. manual SVG/vector construction when it is more appropriate than raster generation.

For an explainer, generated assets must pass:

- subject accuracy;
- style consistency across scenes;
- clean silhouette;
- appropriate aspect/crop;
- no accidental text artifacts;
- no invented brand/product facts;
- enough resolution for the final frame;
- transparent/clean background when cutout use requires it.

Do not switch image engines mid-project if it causes obvious style discontinuity
unless the difference is intentional.

---

### D. Voiceover engine contract

For final explainer narration, use:

`HUMAN_NATIVE_RECORDING`
→ `ELEVENLABS`
→ `GOOGLE_GEMINI_TTS / CHIRP_3_HD`
→ `AZURE_NEURAL_HD`
→ `VO_PROVIDER_PENDING`

For Bahasa Indonesia:

`VOICE_LOCALE = id-ID`

Final-quality rules:

- audition 2–4 candidate voices;
- use actual project vocabulary;
- prefer native/region-matched pronunciation;
- generate a real audio file;
- verify the file is audible and non-corrupt;
- measure actual duration;
- retime visual anchors to the real narration;
- do not use browser/system TTS as final VO.

Explicitly forbidden for final narration when an approved provider is
available:

`BROWSER_SPEECH_SYNTHESIS`

`OS_SYSTEM_TTS`

`GENERIC_ROBOTIC_TTS`

These are:

`TEMP_VO_ONLY`

If no approved final provider is accessible:

`FINAL_STATUS = VO_PROVIDER_PENDING`

Do not silently downgrade.

---

### E. Hi-tech SFX engine contract

For explainers, the sonic architecture remains:

**VOICEOVER + HI-TECH SFX + CONTROLLED TECH AMBIENCE + SILENCE — NO BGM**

Preferred SFX source order:

1. **premium text-to-SFX / sound-design engine available to the environment**;
2. **curated licensed hi-tech SFX library**;
3. **purpose-built procedural synthesis / edited source layers**;
4. manually designed combinations of clicks, servo, signal, data, scanner,
   relay, electromagnetic, synthetic impact, and machine-room textures.

When a premium generative SFX provider is available, prefer one that can
produce isolated non-musical sound effects rather than full music beds.

SFX provider selection must not override the sonic-function rule.

The question is always:

**What narrative function does this cue perform?**

then:

**How should that function sound inside the selected hi-tech family?**

Do not use a music-generation engine to fake hi-tech SFX.

Do not let tonal effects become a melodic loop or BGM.

---

### F. Audio assembly engine

Use an audio-capable editor/mixer or deterministic command-line workflow that
can produce a real final mix.

Preferred deterministic final assembly when available:

**ffmpeg**

Expected pipeline:

`VOICEOVER`
+
`HI-TECH SFX`
+
`TECH AMBIENCE`
→
`FINAL AUDIO MIX`
→
`MUX WITH VIDEO`

Do not assume browser playback audio is captured by screenshot/frame rendering.

A frame sequence contains no sound.

---

### G. Snapshot / visual QA engine

Preferred browser QA path:

- Chromium/Chrome-compatible browser;
- Puppeteer or equivalent deterministic browser automation when available;
- `window.OPENER.seek(t)` / master-time seek;
- screenshots at authored key moments;
- contact-sheet review.

`scripts/snap.mjs` is the bundled reference implementation.

Do not substitute “code compiled successfully” for visual inspection.

---

### H. Final render/export engine

For deterministic browser-motion video:

1. authoritative timeline;
2. frame-accurate browser seek;
3. image-frame capture;
4. encode video stream;
5. mix/mux real audio;
6. verify streams.

Preferred direct export path when available:

**`scripts/export-mp4.mjs` → Puppeteer + ffmpeg + ffprobe**

Minimum final verification:

- correct resolution;
- correct FPS;
- expected duration;
- no dropped/missing frames;
- audio stream exists when VO/SFX is required;
- audio duration matches video;
- VO intelligibility is preserved;
- output opens successfully.

If ffmpeg is unavailable, use another verified encoder/muxer capable of
preserving frame timing and audio.

Do not call a screen recording “deterministic export”.

---

### I. Engine lock states

Record engine decisions internally using a compact state block when useful:

```text
MOTION_ENGINE = GSAP
SPATIAL_ENGINE = NONE | DOM_2_5D | THREE_JS | R3F
SHADER_ENGINE = NONE | CSS | SHADERGRADIENT | CUSTOM_WEBGL
IMAGE_ENGINE = OFFICIAL_ASSET | HOST_IMAGE_GEN | CONNECTED_PROVIDER | LICENSED_SOURCE
VO_ENGINE = HUMAN | ELEVENLABS | GOOGLE_TTS | AZURE_TTS | PENDING
VO_LOCALE = id-ID
SFX_ENGINE = PREMIUM_GENERATIVE_SFX | LICENSED_LIBRARY | PROCEDURAL | MANUAL_LAYERING
AUDIO_MIX_ENGINE = FFMPEG | OTHER_VERIFIED
QA_ENGINE = BROWSER_MANUAL | PUPPETEER
EXPORT_ENGINE = FFMPEG | OTHER_VERIFIED
```

These states describe what is actually used, not what would ideally be used.

---

### J. Final-engine prohibition

A project must not be presented as final when:

- the specified premium VO provider was unavailable and system TTS was used instead;
- required VO is still placeholder audio;
- SFX are missing but the brief requires them;
- the final exported video is silent despite required VO/SFX;
- image placeholders remain;
- a camera direction was authored but no active camera/world transform executes;
- export was never inspected;
- the claimed engine/provider was not actually accessible or executed.

Use an explicit production status instead:

`DRAFT`

`TEMP_VO`

`VO_PROVIDER_PENDING`

`SFX_PENDING`

`EXPORT_PENDING`

`FINAL_VERIFIED`

Only use:

`FINAL_VERIFIED`

after the actual deliverable has passed the relevant output checks.



## 24.16.2 Full Runtime Selection Contract

The package contains both a lightweight starter and a full modular runtime.

Do not load the heaviest engine merely because it exists.

### Runtime levels

**LITE_RUNTIME**

Use when the project can be expressed clearly with:
- DOM;
- SVG;
- CSS;
- GSAP;
- simple 2D/2.5D world transforms.

Primary starter:

`assets/starter.html`

**FULL_RUNTIME**

Use when the project materially benefits from:
- state-driven Three.js;
- true 3D camera/light/geometry;
- selective bloom/post-processing;
- deterministic dust/stars/grid/tunnel fields;
- reusable directional motion blur;
- continuous-world camera helpers;
- explainer draw/say/unsay/extract choreography;
- synchronized VO/SFX runtime;
- richer browser-motion QA/export behavior.

Primary starter:
