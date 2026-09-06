Do not move both camera and typography aggressively unless the relative motion remains readable.

### Selective Orbit / Arc Around Type

Use only when dimensional type or a typographic plane has meaningful geometry, layering, or a reverse side to reveal.

Do not orbit a word merely because it is 3D.

## 13.9 Typographic Camera Tracking

Typography may become a camera tracking target when a word, glyph, punctuation mark, or typographic object physically leads the viewer toward another state.

Use the same target logic as other 3D tracking:

**TYPE TARGET → SCREEN-SPACE ANCHOR → CAMERA RESPONSE → DEPTH / VECTOR CHANGE → HANDOFF → REACQUISITION / LANDING**

Possible targets:

- a hero word that leaves its line and becomes an object
- punctuation that detaches and travels into depth
- a letterform that expands into a portal
- a text block that becomes a spatial plane
- one word that slides past camera and becomes the transition occluder
- a typographic fragment that aligns with UI or 3D geometry in the next scene

For tracking, define:

1. **semantic owner** — which word or glyph matters and why
2. **screen-space anchor** — center, third, edge-biased, or intentionally drifting
3. **camera response** — locked, smooth, heavy, lead, lag, or snap reframe
4. **readable state** — when the word must be fully understood before stronger travel begins
5. **depth behavior** — approach, recede, cross foreground, flatten, or gain thickness
6. **handoff property** — shape, position, vector, crop, negative space, material, or meaning
7. **landing role** — readable type, graphic motif, UI element, environment surface, or descendant object

The camera should not begin following a word before the viewer has enough information to recognize what is being followed, unless deliberate partial recognition is the hook.

## 13.10 Typography → Scene Handoff

Typography may directly cause the next scene.

Prefer transitions such as:

- **word → foreground crop → frame coverage → next environment**
- **glyph counter → portal → camera traversal → next scene**
- **underline → spatial path → camera follows path → new environment**
- **letterform edge → architectural edge → next spatial system**
- **word block → 3D plane → camera moves around / through plane → product state on reverse side**
- **punctuation → node → tracked 3D element → network environment**
- **headline baseline → horizon → camera pullback reveals environment built from the same line**
- **oversized word → scale continues past readability → abstract shape match → next hero object**

A strong handoff preserves at least one recognizable continuity property:

- shape
- location
- scale trajectory
- movement vector
- negative space
- value / color relationship
- depth direction
- semantic meaning

Avoid:

**headline exits → empty frame → generic camera move → unrelated next scene**

Prefer:

**headline changes role → camera responds → typographic geometry creates the transition condition → next scene is discovered through that condition**

### 13.10.1 Speed-Ramp Handoff — Kinetic → Product

Use speed ramps as **energy transfer**, not as a decorative fast-slow loop.

A strong kinetic-to-SaaS ramp often follows:

**FAST KINETIC → MICRO HOLD → ACCELERATION → OCCLUSION / THRESHOLD → CONTROLLED DECELERATION → PRODUCT READ → FAST RESET**

The acceleration should have a clear cause, such as:

- a hero word or glyph escaping its typographic layout
- a bar or underline extending beyond the frame
- a camera commitment toward a typographic opening
- a word crossing foreground and becoming an occluder
- a semantic phrase such as faster, scale, instant, automate, or accelerate receiving a physically faster gesture

The deceleration should have a clear result:

- dashboard reaches a readable hero pose
- workflow structure becomes understandable
- extracted element locks into its SaaS role
- camera settles after entering the product environment
- important UI labels receive enough time to read

Do not repeat:

**fast → slow → fast → slow → fast**

at a predictable cadence. Repeated ramps flatten hierarchy because every movement begins to feel equally important.

Prefer one pronounced ramp for a hero handoff, then use snaps, normal easing, hard holds, or quieter motion for surrounding events.

During the fastest phase, motion blur, distortion, or full-frame occlusion may support perceived velocity, but they must not hide weak spacing or destroy the identity of the transition object. Preserve at least one trackable property through the ramp.

For VO-driven work, place the peak acceleration around the semantic turn or transition phrase, then let the product landing breathe. A short hold after a high-energy ramp is part of the ramp design, not dead time.

## 13.11 Typography + Parallax Environment Traversal

Typography may participate in the parallax environment system introduced earlier.

Examples:

- foreground word passes close to camera while a distant phrase becomes the next hero
- camera advances through multiple typographic depth planes until the final plane resolves into UI
- a large background word becomes increasingly legible as camera approaches, then its internal negative space exposes the next environment
- support copy remains on a shallow screen-space layer while the product environment travels in deeper parallax
- one large word acts as a threshold plane; crossing it changes the world behind it

When type is used as environment, do not require every layer to be read as copy.

Explicitly distinguish:

- **must-read language**
- **recognizable motif**
- **spatial texture / architecture**

Do not sacrifice message comprehension for depth spectacle.

## 13.12 Camera-Driven Reading Order

The camera may control **when** information becomes available.

Use this carefully.

Possible sequence:

1. show a readable anchor word
2. imply additional language beyond the crop
3. move or reframe toward that unresolved region
4. reveal the second phrase
5. allow a readable hold
6. let the second phrase cause the next framing event

This creates:

**partial information → camera question → reveal → readable meaning → new spatial question**

Do not hide ordinary text simply to manufacture difficulty.

The withheld information should create useful anticipation.

## 13.13 VO + Camera + Typography Choreography

For VO-driven typography, camera events should follow phrase hierarchy rather than every spoken word.

A useful hierarchy:

- **establish phrase** → stable or slowly resolving framing
- **hero word** → strongest scale, crop, camera, or depth event
- **support phrase** → secondary reveal or reaction
- **semantic turn / contrast** → reframe, direction change, interruption, or perspective reset
- **transition phrase** → typography may become the object or spatial route that carries camera forward

Example:

VO: “Your workflow / does not need / another dashboard.”

Possible choreography:

- “Your workflow” → camera is already traveling across a cropped WORKFLOW field
- “does not need” → camera locks; support words compress toward the hero plane
- “another dashboard” → DASHBOARD appears far behind the current type; camera pushes through the foreground letters toward it; the word flattens into the actual dashboard UI

Do not create a camera hit for every syllable.

## 13.14 Anti-PPT Typographic Failure Modes

Avoid repeated patterns such as:

- centered headline fades in
- subtitle rises 20 px
- everything holds in a balanced card-like layout
- text fades out completely before the next shot
- each sentence receives a fresh empty background
- every hero word scales from 90% to 100%
- camera slowly pushes on every title regardless of meaning
- all text remains parallel to screen with no relationship to depth even when the world is spatial
- type, camera, and background begin and end motion on the same frames repeatedly
- typography is replaced rather than transformed, carried, cropped, or spatially related
- a 3D camera is used but typography behaves like a 2D overlay pasted above the scene

Instead, favor continuity, asymmetry, start-in-progress states, persistent type, camera-led discovery, role transfer, occlusion, and meaningful depth changes.

## 13.15 Kinetic Typography Camera QA

For substantial camera-driven typography, inspect at least:

- initial crop / hook
- first fully readable state
- camera commitment
- midpoint of the largest camera move
- maximum typography crop or foreground proximity
- handoff / threshold frame
- first readable state in the next composition
- camera landing

Check:

- can must-read words still be recognized at normal playback speed?
- does camera movement reveal information or merely create activity?
- does the reading direction agree with camera direction?
- is a hero word readable before it becomes abstract transition material?
- do foreground glyphs create useful occlusion without hiding essential copy too long?
- do parallax layers maintain clear hero ownership?
- does typography remain spatially related to the environment instead of looking like a HUD pasted over it?
- if type becomes 3D, does added depth improve the idea?
- does the next scene grow from the outgoing type, vector, crop, depth, or negative space?
- are start, midpoint, and landing compositions all intentional?

Do not approve a typographic camera move from start and end frames only.

The path between them determines readability, crop quality, parallax, hierarchy, and whether the sequence feels cinematic or merely animated.

---

# 14. VO Sync Skill

Voiceover is not merely audio underneath animation.

Treat VO as a **semantic timing map**.

The animation should react to what is being said, how it is being said, and what the viewer needs to understand next.

## 14.1 Analyze the VO

Before animating, mark:

- sentence boundaries
- phrase boundaries
- stressed words
- nouns
- verbs
- contrast words
- emotional shifts
- pauses
- breath points
- punchlines
- reveals
- CTA

Do not sync every word.

Create hierarchy inside the spoken sentence.

## 14.2 VO Priority Levels

### Level A — Hero Words

Words carrying the main idea.

Examples:

- key noun
- surprising number
- contradiction
- claim
- reveal
- CTA

Give these the strongest visual event.

### Level B — Action Words

Verbs or directional language.

Use motion that reflects the meaning when appropriate.

Examples:

- “drop” → downward displacement
- “expand” → scale / width growth
- “split” → separation
- “connect” → joining forms
- “stop” → abrupt freeze

Avoid literal animation when it becomes cheesy.

### Level C — Support Words

Do not animate every support word independently.

Use them to maintain context and readability.

## 14.3 Sync Windows

Visual events may happen:

### Before the word

Use for anticipation.

Typical offset:
