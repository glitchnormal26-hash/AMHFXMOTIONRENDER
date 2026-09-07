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

If the last answer is “no,” the explainer is not finished.


## 24.12.3 Natural Voice Provider Policy

For narrated explainers, do not treat all TTS engines as equivalent.
The final narration should sound like a **real narrator speaking naturally in
the target language**, not like generic system TTS.

### Provider hierarchy

When the user has not named a provider, prefer this order:

1. **Human / user-supplied native recording** — highest priority when available.
2. **ElevenLabs** — preferred premium TTS default for expressive, natural narration.
3. **Google Cloud Gemini-TTS / Chirp 3 HD** — strong alternative, especially when the Google ecosystem is already in use.
4. **Microsoft Azure AI Speech — Neural HD** — enterprise fallback with native-language neural voices.

For Indonesian, always audition a native/region-matched `id-ID` voice. Do not use
an English-native or foreign-accented voice merely because its timbre sounds good.

### Final-quality prohibition

Do **not** use the following as final narration when an approved premium provider is available:

- browser `speechSynthesis`;
- operating-system accessibility voices;
- generic offline/system voices;
- old robotic TTS engines;
- low-quality free web TTS chosen only for convenience;
- a voice with the wrong language accent;
- placeholder timing VO.

These may be used for timing previews only and must be marked:

`TEMP_VO — REPLACE_BEFORE_FINAL`

### Indonesian narrator rule

For Bahasa Indonesia:

`LANGUAGE = id-ID`

Prefer a voice trained, designed, recorded, or demonstrated with native Indonesian pronunciation.
Audition it with a 10–20 second sample containing real project vocabulary, including:

- formal and conversational Indonesian;
- numbers and dates;
- abbreviations;
- English product/technology terms;
- proper names;
- one neutral sentence and one emphasized sentence.

Reject a voice if it:

- sounds strongly foreign-accented;
- reads abbreviations unnaturally;
- changes accent on English terms;
- sounds like call-center IVR unless that is the brief;
- inserts unnatural pauses;
- has excessive breathiness, radio-announcer affect, or sing-song prosody.

### Provider selection must be audition-based

Do not hard-code one voice ID as universally best.
For substantial explainers:

1. shortlist 2–4 voices from the preferred provider;
2. synthesize the same representative sample;
3. compare pronunciation, accent, warmth, pacing, intelligibility, emotional fit,
   proper nouns, and English technical terms;
4. choose the best narrator for the project;
5. record provider/model/voice in production notes.

### Natural-delivery direction

Default general explainer character:

**smart, warm, conversational, credible, lightly energetic**

Direction should normally request:

- natural conversational delivery;
- confident but not announcer-like;
- medium energy;
- clear Indonesian diction;
- subtle emotional variation;
- short natural breaths;
- sentence-level phrasing rather than word-by-word emphasis;
- no exaggerated commercial smile;
- no melodramatic trailer cadence;
- no robotic metronomic timing.

### Script normalization for TTS

Maintain two forms when useful:

`VO_SCRIPT_DISPLAY` — readable production script.

`VO_SCRIPT_SPOKEN` — text optimized for the selected provider.

Normalize numbers, dates, acronyms, URLs, symbols, product names, and English technical terms into the way they should actually be spoken.
Do not blindly send display copy to TTS.

### Chunking and pacing

For longer narration, synthesize semantic chunks such as one paragraph, one scene,
or one coherent phrase group. Avoid tiny fragments that reset prosody every line.

If timing is too long, prefer:

1. rewrite the script;
2. slightly adjust speaking rate;
3. regenerate;
4. retime visuals to the real VO;
5. apply only subtle time-stretch as final correction.

Do not make speech unnaturally fast to rescue an overlong script.

### Loudness and cleanup

Before mixing with hi-tech SFX:

- remove obvious leading/trailing dead air;
- preserve natural micro-breaths unless distracting;
- use gentle cleanup and de-essing only when needed;
- avoid aggressive noise reduction artifacts;
- normalize narration consistently;
- keep VO perceptually dominant over SFX and ambience.

### Provider failure / fallback rule

If the preferred provider is unavailable, try the next provider in the hierarchy.
Do not silently downgrade to browser/system TTS for final.
If no acceptable premium/native voice is available, mark the result:

`VO_PROVIDER_PENDING`

and provide the finalized spoken script plus casting notes.

A low-quality synthetic voice is not considered completed final VO.

## 24.13 Explainer Style Routing

When an explainer needs a concrete visual family, choose from or hybridize these
starting systems:

1. **Cartoon collage** — warm paper, cutout illustration, hand-note accents.
2. **Visual journalism** — dark editorial field, sourced real imagery, restrained
   highlighter/source annotation.
3. **White catalog** — white/grid surface, product/person cutouts, mixed typography.
4. **Vintage sketch** — sepia paper, engraving/sketch language, classic serif hierarchy.
5. **Continuous action** — persistent subject, moving world/route/process, changing
   viewpoints and instruments.

These are **surface families and structural starting points, not locked templates**.

## 24.14 Explainer Story Rules

1. An explainer carries one argument, not a list of facts.
2. Build a visual chain such as hook → question → context → comparison/data → cause /
   mechanism → consequence → payoff / echo.
3. Scene count should match duration and reading complexity rather than a fixed deck.
4. Excess information should be cut, combined, or visualized rather than endlessly
   extending runtime.
5. Keep a hero subject, motif, route, object, or visual logic alive across multiple
   beats when possible.
6. Avoid three consecutive beats with the same viewpoint.
7. Use maps, charts, timelines, counters, profiles, dashboards, diagrams, and spatial
   instruments when they explain better than text.
8. Named people, products, places, companies, vehicles, or devices should receive a
   meaningful visual representation when feasible rather than remaining generic text.
9. Numbers should be embedded into the visual world when possible.
10. A final scene should echo the hook or resolve the visual question rather than
    arriving as an unrelated end card.

## 24.15 Missing-Brief Information: Ask vs Assume

Do not block unnecessarily.

Use this decision rule:

- If the missing information changes the fundamental deliverable or makes proceeding
  unsafe/impossible — ask.
- If the missing information is a normal production preference — choose a sensible
  default and state the assumption briefly.
- If the user already supplied platform, ratio, duration, VO, style, brand, or output
  format — do not ask for it again.
- For explainer work with no ratio, standard 16:9 is a reasonable default.
- For social work, infer from the named platform when reliable; otherwise choose a
  conventional ratio and state it.
- For sound, keep **no BGM** unless explicitly overridden; for **explainer work, VO is required by default and all non-VO SFX use hi-tech material by default**.
- For captions, keep them off unless requested/required.
- For 3D, do not assume it is required.

Do not make the user complete a questionnaire before useful work can begin.

## 24.16 VO Workflow and Retime Rules

For explainers, VO is part of the piece by default unless the user explicitly
requests a narration-free result.

1. Draft the scene-by-scene narration before final timing.
2. Use VO meaning, emphasis, pause, and stress as choreography anchors.
3. If the user did not provide recorded VO and a TTS/voice tool is available,
   generate the actual narration track.
4. Measure the real narration duration; do not time a final explainer only from
   estimated reading speed.
5. A silent/readable draft may exist temporarily, but it is `VO_PENDING`, not final.
6. Detect speech and longer paragraph pauses from the real recorded/generated VO.
