# Explainer — Continuous Visual Argument

> 
An explainer should carry one argument through an evolving world, not autoplay
a sequence of designed slides.

## Style families bundled here

1. **Cartoon collage**
   - warm paper;
   - flat cutout illustration;
   - hand-note accents;
   - suitable for education/science/light topics.

2. **Visual journalism**
   - dark editorial field;
   - real sourced imagery;
   - source tags and restrained annotation;
   - suitable for news/current issues.

3. **White catalog**
   - white/grid surface;
   - product/person cutouts;
   - strong mixed typography;
   - suitable for product/brand/company stories.

4. **Vintage sketch**
   - sepia paper;
   - engraving/sketch visual language;
   - classic serif hierarchy;
   - suitable for history/biography.

5. **Continuous action**
   - one persistent subject;
   - moving world / route / process;
   - changing viewpoints and instruments;
   - suitable for speed, transport, routes, processes, sports.

These are surface families, not templates to copy unchanged.

## Default production assumptions

Unless the user states otherwise:
- aspect: 16:9;
- duration: 30–90 seconds depending on requested depth;
- captions: off;
- visible player: off;
- master timeline: deterministic;
- music: **off by default in Motion Designer v3.8**; enable background music only after explicit user override;
- explainer SFX material: **HI-TECH ONLY by default** — digital, electronic, interface, signal, data, scanner, servo, relay, electromagnetic, synthetic, and precision-mechanical families;
- literal/natural Foley is not the explainer default; translate physical actions into the chosen hi-tech family unless the user explicitly requests realism;
- tonal hi-tech cues may be used as short events, but must not form a musical bed, melody, arpeggio, or chord loop;
- VO: **required by default for explainers** unless the user explicitly requests no narration; generate or obtain the actual narration track, not only a script.

## Scene count

A useful starting point:
- 30 s → around 5 major beats;
- 60 s → around 8–10 major beats;
- 90 s → around 12–15 major beats.

Do not extend runtime merely to preserve excess information. Cut, combine, or
visualize information.

## Camera choreography

For collage explainers, prefer camera choreography such as:

**CLOSE DETAIL → TRAVEL → SECOND DETAIL → PULL OUT → READABLE HOLD**

Text should often arrive after the spatial move settles, not compete with the
move.

For continuous-action explainers:
- keep the hero subject present for a meaningful portion of the duration;
- let world distance / position be a deterministic function of time;
- change viewpoint before monotony forms;
- use instruments appropriate to the fact: map, profile, dashboard,
  head-on view, side view, interior, route, comparison.

Avoid three consecutive beats with the same viewpoint.

## Entity rule

When a person, product, place, company, vehicle, device, or other named entity
is materially discussed, show a visual representation of it in that beat when
feasible. Do not make the viewer read names while the visual remains generic.

## Text rule

VO carries explanation; on-screen text carries:
- hook;
- hero phrase;
- key number;
- place/name label;
- comparison;
- warning;
- payoff.

Avoid explanatory paragraphs.

## Data / number rule

Prefer numbers embedded in the world:
- station sign;
- route marker;
- dial;
- map label;
- depth plane;
- product state;
- physical tag.

Use tabular numerals for animated counters.

## Source and asset handling

Visual journalism:
- prefer licensable / public-domain sources;
- preserve source credit where required.

Cartoon/sketch:
- keep generated assets stylistically coherent across the piece.

Product/catalog:
- use real brand/product assets where available;
- do not invent product claims.

## VO workflow

Default explainer audio is:

**VOICEOVER + HI-TECH SFX + CONTROLLED TECH AMBIENCE + SILENCE — NO BGM**

Unless the user explicitly requests no narration:

1. Write a scene-by-scene VO script.
2. If a TTS/voice-generation tool is available, generate the actual narration audio.
3. If the user supplied VO, treat that file as the timing authority.
4. Measure the actual audio duration.
5. Detect segment/paragraph boundaries.
6. Retime scene anchors to VO.
7. Keep transition durations authored; remap scene positions rather than rebuilding
   all animation logic.
8. Synchronize VO/SFX to the master timeline.
9. Verify with actual audio and without audio.
10. During MP4 export, mux the actual narration/SFX mix into the encoded video.

A silent draft is permitted only as `DRAFT — VO_PENDING`. A final narrated
explainer must contain a real audio track, not merely the written script.

A useful script structure:

```text
Scene 1 — ...
Scene 2 — ...
Scene 3 — ...
```

If no TTS/audio-generation capability exists, provide the script and request WAV/MP3/M4A/OGG narration; do not present the silent version as final.

## Starter routing

Use:
- `../assets/starter-explainer-kartun.html`
- `../assets/starter-explainer-jurnalisme.html`
- `../assets/starter-explainer-katalog.html`
- `../assets/starter-explainer-sketsa.html`
- `../assets/starter-explainer.html`

Start from the closest structural mode, then replace all placeholder styling,
copy, geometry, and timing with the actual brief.


## Hi-Tech SFX-only explainer rule

For explainers, keep all non-VO sonic material inside one coherent hi-tech family.

Recommended functions and materials:

- reveal → digital impact / synthetic lock;
- travel → filtered signal pass / servo sweep;
- UI → interface click / relay tick / confirmation pulse;
- scan → scanner pulse / spectral sweep;
- network → node ping / electrical handshake;
- transform → granular digital morph / spectral reshape;
- processing → restrained compute/data texture;
- warning → short synthetic alert / gated electronic fault cue;
- completion → compact digital confirmation;
- ambience → subtle server-room / electrical / filtered digital room tone.

Do not default to natural Foley, cinematic trailer impacts, cartoon sounds, acoustic percussion, generic Hollywood whooshes, or musical synth beds.

When a physical object appears, sonify its **narrative function** using the selected hi-tech family unless literal realism is explicitly requested.

Keep VO above the SFX hierarchy and use silence as an authored part of the sound design.


## Natural VO provider selection

For final narrated explainers, provider quality is part of production quality.

Preferred order:

1. human/native recorded VO when available;
2. ElevenLabs;
3. Google Gemini-TTS / Chirp 3 HD;
4. Azure AI Speech Neural HD.

For Indonesian narration, use `id-ID` / Indonesian-native voice material where possible. Do not finalize with browser `speechSynthesis` or a generic system voice when an approved premium provider is available.

Before selecting the final narrator, audition the same representative 10–20 second sample across 2–4 voices. Include actual proper names, numbers, abbreviations, and English technology terms from the project.

Default delivery: **smart, warm, conversational, credible, lightly energetic**.
Avoid radio-announcer delivery, melodramatic trailer narration, call-center IVR cadence, sing-song prosody, word-by-word overemphasis, and unnaturally fast TTS.

Maintain a spoken-version script with numbers, dates, acronyms, symbols, and technical names normalized for the selected provider.


## Explainer engine stack

Preferred default stack when capabilities exist:

```text
VISUAL MOTION = GSAP + DOM/SVG
TRUE 3D = Three.js/R3F only when needed
VO = Human → ElevenLabs → Google Gemini-TTS/Chirp 3 HD → Azure Neural HD
VO LOCALE (Indonesian) = id-ID
SFX = premium/curated hi-tech SFX source
QA = Chromium + Puppeteer key-frame capture
FINAL MIX/MUX = ffmpeg or another verified audio-capable encoder
```

If an approved VO engine is unavailable, use `VO_PROVIDER_PENDING`; do not use
browser/system TTS as final narration.

A narrated explainer may only be marked `FINAL_VERIFIED` after the exported
video has been checked for a real audio stream.
