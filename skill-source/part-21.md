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
- airy electromagnetic movement;
- gentle node pings.

**INDUSTRIAL TECH**
- servo movement;
- electromechanical relays;
- compact low electronic contacts;
- machine lock sounds;
- restrained electrical hum.

Do not mix radically different hi-tech families without a narrative reason.

### Explainer SFX QA

Before final delivery, verify:

- Is every explainer SFX recognizably part of the selected hi-tech family?
- Does each cue still have a narrative function?
- Is any cue merely a generic “futuristic whoosh”?
- Has literal Foley slipped into the explainer unnecessarily?
- Has a tonal sequence become accidental music?
- Are VO consonants being masked by clicks or bright transients?
- Can at least 20–40% of proposed micro-SFX be removed without losing meaning?
- Does the final piece remain understandable with all SFX muted?


## 24.12.2 Mandatory Explainer Voiceover Delivery Contract

An explainer is **not audio-complete** merely because a VO script exists.

### Default state

Unless the user explicitly opts out of narration:

`EXPLAINER_VO = REQUIRED`

`EXPLAINER_AUDIO = VO + HI_TECH_SFX + TECH_AMBIENCE + SILENCE`

`BGM = OFF`

### Required behavior

1. Write the narration script before final timing is locked.
2. Use the language requested by the brief. If no language is specified, use the
   user's working language when it is clear from context.
3. If a TTS / voice-generation capability is available and the user did not supply
   recorded narration, **generate the actual voiceover audio** rather than stopping
   at a script. Prefer **ElevenLabs**, then **Google Gemini-TTS / Chirp 3 HD**, then
   **Azure Neural HD**, using a native/region-matched voice for the target language.
4. Do not ask for a voice preference when a reasonable neutral default voice can
   satisfy the brief. Ask only when identity, gender, accent, character, or brand
   voice materially matters and cannot be inferred.
5. If the user provides VO, use it as the timing authority.
6. If generated VO is used, measure its real duration before finalizing scene
   anchors.
7. Store or expose the real narration track as an audio asset, for example:
   `audio/voiceover.wav`, `audio/voiceover.mp3`, or an equivalent embedded audio
   source.
8. Synchronize narration to the same master time/frame authority as the visuals.
9. Seek, pause, resume, restart, and export must preserve VO synchronization.
10. The final QA pass must be performed with the real narration audible.

### No voice-generation capability

If the runtime genuinely has no TTS/audio-generation capability and the user has
not supplied narration:

- do not pretend the explainer contains voiceover;
- do not label the output “final audio”;
- create the complete VO script;
- mark the audiovisual result **`DRAFT — VO_PENDING`**;
- provide the exact narration script and timing targets needed to generate or
  record VO;
- final audio delivery requires an actual narration file.

A silent draft may be useful for visual development, but it must not silently
become the final explainer when `EXPLAINER_VO = REQUIRED`.

### Browser playback rule

Browser autoplay restrictions do not justify removing VO.

If a gesture is required:
- show a minimal `Start` / `Enable Audio` affordance;
- unlock the audio context;
- start VO, SFX, and the master timeline from the same authored start point.

### Final export rule

**Frame-by-frame video capture does not capture browser audio.**

Therefore:
- PNG/JPEG frame export alone is never sufficient for an audio explainer;
- render/prepare the narration and SFX audio mix separately;
- mux the final audio mix into the encoded video;
- verify the resulting MP4/MOV/WebM contains an audio stream before delivery.

For ffmpeg-style workflows, final encoding conceptually follows:

`FRAMES → VIDEO STREAM`

`VOICEOVER + HI-TECH SFX → FINAL AUDIO MIX`

`VIDEO STREAM + FINAL AUDIO MIX → FINAL VIDEO`

Do not call a muted H.264 export “final” when the explainer is supposed to have VO.

### Single-file HTML exception

A direct-open `index.html` requirement must not delete narration.

Prefer, in order:
1. embed or package the VO audio in a technically reliable way;
2. keep a relative `audio/voiceover.*` asset beside the HTML;
3. embed as a data URI only when size/performance remains practical.

If strict one-file portability conflicts with reliable voice playback, preserve
the voiceover and disclose the small multi-file delivery rather than silently
dropping audio.

### Voiceover QA

Before approval, verify:

- Is a real VO audio track present, not only a script?
- Does the spoken language match the brief?
- Does VO begin at the intended authored moment?
- Do scene changes follow phrase/semantic timing?
- Does seeking keep VO aligned?
- Is VO louder/clearer than hi-tech ambience and support SFX?
- Are bright digital clicks masking consonants?
- Does the exported video actually contain an audio stream?
- If narration is absent, did the user explicitly request a narration-free mode?
- Was the final VO generated with an approved natural provider rather than browser/system TTS?
- Was the selected voice auditioned using actual project vocabulary and proper names?
