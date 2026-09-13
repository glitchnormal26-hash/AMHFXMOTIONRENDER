# Techniques — Authored Motion Recipes

Numbers below are starting points, not laws. The brief owns palette, type, surface,
movement character, hierarchy, and narrative rhythm.

## 1. Kinetic depth gate

Kinetic typography is not a repeated stagger.

A hero kinetic passage should combine **at least three distinct motion roles** when the
content supports them. Useful roles include:

- **attack** — abrupt scale/position/weight change that establishes priority;
- **replacement** — one word physically displaces or overwrites another;
- **crop reveal** — type is discovered through a moving mask or changing frame;
- **compression/release** — tracking, scale, or line spacing stores and releases energy;
- **overshoot/settle** — weight and impact without generic springiness;
- **foreground invasion** — type crosses the lens plane or occludes the world;
- **camera target** — camera reframes because a word becomes the attention owner;
- **transition plane** — a word or letter becomes the surface that carries the next shot;
- **semantic morph** — text geometry transforms according to meaning;
- **type-to-product handoff** — type establishes the claim, then becomes or reveals proof;
- **punctuation payoff** — final word/mark lands as a separate rhythmic event;
- **depth split** — foreground/midground/background type layers create parallax.

Fail `KINETIC_GATE` when the passage is mainly identical word-by-word fade/slide/scale,
one easing curve, one entry direction, or text moving independently from the camera and
world.

## 2. Kinetic phrase construction

Build phrases as non-uniform micro-events:

```text
ANTICIPATE → ATTACK → INTERRUPT → HANDOFF → LAND
```

Not every word needs animation. Give the strongest motion to the semantic owner.
Supporting words may lock, crop, compress, or remain still to create contrast.

Useful variation knobs:

- duration;
- delay spacing;
- entry direction;
- scale range;
- blur axis;
- mask geometry;
- origin point;
- easing family;
- camera response;
- overlap amount;
- hold length;
- exit logic.

Variation must follow hierarchy, not randomization.

## 3. Composition choreography

Motion should evolve composition, not merely animate objects inside a fixed layout.

Across consecutive beats, vary one or more of:

- dominant visual owner;
- center of gravity;
- crop;
- negative-space location;
- scale relationship;
- foreground/background relation;
- camera target;
- directional flow;
- text lane;
- object density.

Avoid repeating the same centered hero + subtitle + card stack composition.

Before export, freeze opening, hero impact, transition midpoint, landing, and final frame.
Each should work as a deliberate still composition.

## 4. Living typography entrances

Useful entrances:

- vertical rise + directional blur;
- lateral replacement;
- scale attack;
- mask/crop reveal;
- tracking compression/expansion;
- foreground type invasion;
- perspective sweep;
- letterform wipe;
- camera-discovered reveal.

Use identical treatment only when deliberate uniformity is the concept.

## 5. Directional motion blur

CSS blur is isotropic. SVG `feGaussianBlur` can create separate X/Y blur.

```js
blurNode.setAttribute("stdDeviation", `${x} ${y}`);
```

Horizontal travel → larger X than Y. Vertical travel → larger Y than X.
Expand the filter region to avoid clipped trails. Remove the filter after the event.

## 6. Camera-equivalent push-through

```js
function pushThrough(tl, rig, cut, {
  push=1.8, incoming=1.35, inDur=.45, outDur=.85
} = {}) {
  tl.to(rig, {scale:push, duration:inDur, ease:"power2.in"}, cut-inDur);
  tl.set(rig, {scale:incoming}, cut);
  tl.to(rig, {scale:1, duration:outDur, ease:"power3.out"}, cut);
}
```

Use only when the destination is conceptually inside/through the current subject. Do
not repeat it at every cut.

## 7. Transition vocabulary

Prefer a small authored vocabulary:

- element extraction → next-state material;
- subject tracking with camera lag;
- foreground object occlusion;
- semantic line/path transformation;
- depth-card turn / fold;
- typography as mask or transition surface;
- motivated push-through;
- hard geometry match cut;
- light-field/shader-state handoff;
- environment traversal through parallax.

Use at least two distinct transition logics in longer pieces.

Every transition should answer:

**CAUSE → ACTION → RESULT**

## 8. Type → product handoff

Strong SaaS pattern:

```text
TYPE OWNS FRAME
→ HERO WORD LOCKS
→ WORD/SHAPE CHANGES ROLE
→ CAMERA FOLLOWS THE CHANGE
→ PRODUCT WORLD IS REVEALED
→ PRODUCT BECOMES PROOF
```

Do not force UI to share the frame during the strongest kinetic passage.

## 9. Background motion

Background motion should be selected, not defaulted.

Options:

- gradient field shifts;
- slow mesh deformation;
- drifting large forms;
- subtle grain evolution;
- light sweep tied to state;
- restrained camera breathing;
- particles;
- grid breathing;
- ghost-type parallax;
- actual foreground/background parallax;
- shader parameter state changes.

Background movement must stay subordinate to the hero.

## 10. Selective glow / bloom

Glow is hierarchy, not decoration.

Prefer emissive hero objects, brief activation peaks, state-dependent glow, or bloom
after meaningful contact.

Avoid glow on every title, permanently luminous UI, low bloom thresholds that wash out
the frame, or using glow to rescue weak contrast.

## 11. Object performance

For 3D/2.5D hero objects:

- anticipation tilt;
- compress/release;
- reaction;
- lag/follow-through;
- magnetic assembly;
- hinge/fold/peel;
- collision response;
- authored landing pose.

Avoid perpetual showroom rotation.

## 12. Deterministic counters

```js
const n = {v:0};
tl.to(n, {
  v:350,
  duration:1,
  onUpdate() { el.textContent = Math.round(n.v); }
});
```

Use `font-variant-numeric: tabular-nums` and stable width.

## 13. Deterministic procedural motion

Good:

```js
const wobble = Math.sin(t * 2.1 + seed) * 4;
```

Bad in a seekable render path:

```js
x += velocity * dt;
x += Math.random();
```

## 14. Snapshot QA

Capture:

- first readable frame;
- hero impact;
- just before transition;
- middle of transition;
- transition landing;
- final CTA/brand frame.

Inspect:

- clipping;
- collision;
- hierarchy;
- composition;
- camera consequence;
- kinetic variation;
- contrast;
- continuity;
- anti-PPT symptoms.

## 15. Common traps

- future GSAP `from()` tween corrupts frame zero;
- CSS specificity reveals hidden elements;
- SVG filter region clips motion blur;
- bloom threshold washes out the frame;
- multiple clocks cause scrub/export mismatch;
- camera pose is calculated but never applied;
- a control system overwrites authored camera transforms;
- continuous random drift changes every capture;
- starter palette/font/motion survives into final work;
- every cut uses the same cinematic trick;
- all kinetic words use the same stagger/ease;
- camera moves but composition has no clear attention owner.

When a technique becomes visible as a reusable preset rather than a motivated event,
reduce, vary, or replace it.
