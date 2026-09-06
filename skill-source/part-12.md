
- 2–6 frames before stressed word

Useful when the viewer should anticipate the spoken idea.

### On the word

Use for impact.

The visual peak and stressed syllable align closely.

Useful for:

- numbers
- punchlines
- CTA
- major claims
- hard transitions

### After the word

Use for comprehension or reaction.

Typical offset:

- 2–8 frames after the word

Useful for:

- illustration reaction
- secondary motion
- comedic response
- visual consequence

Do not place every visual peak exactly on every spoken syllable.

## 14.4 Phrase-Based Choreography

Think in phrases, not isolated words.

For each phrase:

1. establish
2. emphasize
3. resolve
4. transition

Example:

VO:
“Most people / think faster editing / means better retention.”

Possible choreography:

- “Most people” → establish composition
- “faster editing” → accelerate cuts / compress spacing
- “better retention” → freeze or contradict visual expectation

Use contrast to make the sentence visually memorable.

## 14.5 Breath and Pause

Do not fill VO pauses automatically.

A pause can be used for:

- hold
- visual punchline
- illustration reaction
- framing change
- silent reveal
- anticipation before next sentence

Silence plus a static frame can become a major beat.

## 14.6 VO-to-Scene Mapping

For each VO segment, identify:

- spoken phrase
- semantic purpose
- hero word
- visual subject
- primary motion
- transition
- SFX cue
- hold duration

Recommended format:

| VO phrase | Purpose | Hero visual | Motion | SFX | Transition |
|---|---|---|---|---|---|
| phrase | establish / contrast / reveal | main object | behavior | cue | next scene logic |

## 14.7 Do Not Karaoke Animate

Avoid highlighting or animating every word **with the same treatment** simply because it is spoken.

Rapid word-by-word or character-by-character sequencing is allowed — and in `KINETIC_TYPE_MODE = FAST` may be preferred — when the gestures, durations, scale, hierarchy, and semantic roles vary intentionally.

Avoid:

- one identical animation repeated on every word
- equal visual emphasis on every syllable
- mechanically matching every spoken unit with the same motion event
- perpetual bouncing captions
- sound hit on every word

The animation should interpret language, not transcribe it mechanically. **Anti-karaoke protects hierarchy; it must not be used as a reason to make requested kinetic typography static.**

---

# 15. VO + SFX Sonic Storytelling Skill — No BGM Default

Sound design should make motion feel **tactile, dimensional, memorable, rhythmic, and intentional without relying on BGM**.

In this skill, SFX is not a layer added after animation.

SFX is part of blocking, timing, transition, material, and attention direction.

Do not use SFX as random decoration.

Every sound should serve at least one role:

- anticipation
- launch / departure
- travel / spatial movement
- impact / contact
- material definition
- transformation
- interface feedback
- reaction
- tension
- release
- scene continuity
- brand punctuation
- environmental depth

## 15.1 No-BGM Default

Default audio architecture:

**VO + SFX + controlled ambience + silence**

Do not add a musical bed merely because the sequence feels empty.

If energy is missing, first inspect:

- visual pacing
- event timing
- SFX contrast
- transient placement
- sound tails
- ambient depth
- silence placement
- VO phrasing

Tonal SFX are allowed when they behave like effects or brand cues.

Do not quietly turn tonal SFX into a continuous melody, beat, pad, or score unless the user explicitly requests music.

## 15.2 SFX Hierarchy

Use four functional layers.

### HERO SFX

For major state changes and hero visual events.

Examples:

- deep impact
- dimensional suction
- signature snap
- broad but short whoosh
- resonant activation
- branded tonal strike
- heavy material lock

Hero SFX should be rare enough to remain meaningful.

### MOTION SFX

For travel, acceleration, rotation, expansion, folding, or perspective movement.

Examples:

- short air pass
- filtered sweep
- mechanical glide
- servo movement
- friction pass
- spatial swish
- low pressure movement

Do not place a whoosh on every transform.

Choose motion sounds only when the movement benefits from perceived mass, direction, or speed.

### SUPPORT / UI SFX

For secondary interaction and confirmation.

Examples:

- click
- tick
- soft lock
- digital blip
- restrained pop
- small mechanical response
- short data pulse

Keep these quieter and spectrally smaller than hero sounds.

### TEXTURE / AMBIENCE SFX

For environmental and material depth.

Examples:

- low room tone
- quiet system hum
- electrical texture
- air movement
- paper friction
- subtle servo noise
- soft digital residue
- restrained environmental resonance

Texture should be felt more than noticed.

Ambience is not BGM.

It should not establish a song-like groove or melodic progression.

### 15.2.1 UI-SFX vs “Tech” SFX — Function Before Aesthetic Label

Do not choose between **UI-SFX** and **tech SFX** as if they are two mutually exclusive sound categories.

Choose the **functional role first**, then choose a sonic material or character that fits the visual world.

For kinetic typography → speed-ramp → SaaS reveal, a useful mapping is:

- **kinetic typography** → primarily HERO + MOTION SFX; dry snaps, compact body, short filtered air, suction, friction, or sharp movement texture
- **speed-ramp / spatial handoff** → primarily MOTION SFX with a technical material character; filtered sweep, low-pressure movement, relay-like anticipation, electrical residue, servo or mechanical glide when visually justified
- **SaaS interaction / confirmation** → primarily SUPPORT / UI SFX; clean click, tick, soft lock, digital blip, restrained pop, short data pulse
- **AI processing / automation / system depth** → primarily TEXTURE / AMBIENCE; quiet system hum, restrained electrical texture, soft digital residue, subtle servo noise
- **major product state reveal** → HERO SFX may punctuate the landing, but it should remain rarer and larger than UI feedback

Treat **tech** as a descriptor of material, timbre, or system character — precise, electrical, relay-like, digital, mechanical, filtered, data-like — not as permission to add generic futuristic sounds everywhere.

The transition from kinetic type to product should often sound like a role transfer:

**pre-suction / pressure cue → accelerated movement texture → compact contact or cut → short digital residue → restrained UI ticks / locks**

Do not make every kinetic word sound like a UI button. Do not make every SaaS motion sound like a cinematic sci-fi transition. The change in sonic scale should help the viewer feel:

**verbal energy → spatial travel → product precision**

When several UI events happen close together, cluster them under one motion phrase with only a few confirmation details rather than assigning an independent click to every micro-action.

## 15.3 SFX Sentence — Anticipation → Travel → Contact → Settle → Tail

Think of a major motion event as a sonic sentence.

Possible stages:

1. **anticipation** — inhale, suction, pre-click, pressure rise
2. **travel** — directional movement or material motion
3. **contact** — transient that defines exact landing
4. **settle** — short mechanical, elastic, or resonant response
5. **tail** — controlled decay that provides space or continuity

Do not use all five stages automatically.

A premium event may be stronger as:

**pre-suction → impact → short tail**

A UI micro-event may need only:

**clean click**

A fast transition may be:

**air pass → cut**, with no impact.

Design the minimum sonic sentence that makes the motion believable.

## 15.4 Pre-SFX and Audio-Led Motion

Sound may arrive before the visual to create expectation.

Starting offsets at 30 fps:

- micro anticipation: 1–2 frames early
- readable anticipation: 2–4 frames early
- major reveal tension: 4–8 frames early when the buildup is justified

Examples:

- tiny relay click before a UI module locks into place
