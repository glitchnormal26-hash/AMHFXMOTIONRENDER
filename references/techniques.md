# Techniques — Browser Motion Recipes

> 
Numbers below are starting points, not laws. The brief owns palette, type,
surface, movement character, and narrative rhythm.

## 1. Living typography

Use a small number of text behaviors, varied by semantic importance.

Useful entrances:
- vertical rise + directional blur;
- lateral replacement;
- scale attack;
- mask/crop reveal;
- tracking compression/expansion;
- foreground type invasion.

Use identical word treatment only when deliberate uniformity is the concept.

### One highlight language

Choose one highlight language per piece:
- underline;
- marker;
- outline box;
- color-only;
- strike/replace;
- filled block/pill;
- clipping mask.

Do not inherit a highlight shape from the starter.

## 2. Directional motion blur

CSS blur is isotropic. SVG `feGaussianBlur` can create separate X/Y blur.

```js
blurNode.setAttribute("stdDeviation", `${x} ${y}`);
```

Horizontal travel → larger X than Y.  
Vertical travel → larger Y than X.

Expand the filter region to avoid clipped trails. Remove the SVG filter after
the motion event so the element is not unnecessarily rasterized every frame.

## 3. Camera-equivalent push-through

A simple DOM camera rig can create a spatial handoff:

```js
function pushThrough(tl, rig, cut, {
  push=1.8, incoming=1.35, inDur=.45, outDur=.85
} = {}) {
  tl.to(rig, {scale:push, duration:inDur, ease:"power2.in"}, cut-inDur);
  tl.set(rig, {scale:incoming}, cut);
  tl.to(rig, {scale:1, duration:outDur, ease:"power3.out"}, cut);
}
```

Use only when the destination is conceptually “inside” or “through” the
current subject. Do not repeat this at every cut.

## 4. Transition menu

Prefer a small authored vocabulary:
- element extraction → next-scene material;
- subject tracking with camera lag;
- foreground object occlusion;
- semantic line/path transformation;
- depth-card turn / fold;
- typography as mask or transition surface;
- motivated push-through;
- hard match cut;
- light field / shader-state handoff;
- environment traversal through parallax.

Use at least two distinct transition logics in longer pieces when repetition
would feel templated.

## 5. Background movement menu

Background motion should be selected, not defaulted.

Options:
- gradient field shifts;
- slow mesh deformation;
- drifting large forms;
- subtle grain evolution;
- light sweep tied to scene state;
- low-amplitude camera breathing;
- rising particles;
- grid breathing;
- ghost type parallax;
- restrained Ken Burns + actual foreground parallax;
- shader parameter state changes.

Do not default to horizontal streaks / lanes unless the theme is speed or flow.

## 6. Background surface menu

Use at least two visual layers when depth/atmosphere is desired:
- base gradient + local light;
- paper + grain;
- color field + mesh blob;
- spotlight + tint;
- sky bands + haze;
- grid + soft lighting;
- image + tonal overlay;
- shader gradient + selective bloom.

A flat single-color field is valid only when deliberate brutal/minimal art
direction calls for it.

## 7. Selective bloom / glow

Glow is hierarchy, not decoration.

Prefer:
- emissive hero objects;
- brief activation peaks;
- state-dependent glow;
- bloom after a meaningful interaction.

Avoid:
- glow on every title;
- permanently luminous UI;
- low bloom thresholds that wash out the whole frame;
- using glow to rescue weak contrast.

## 8. Camera breathing

Breathing is low-amplitude authored change, not perpetual random drift.

Example:
- scale/FOV shift of only a few percent;
- one slow positional arc;
- pause or lock during a critical read.

Breathing should stop when stillness makes the idea stronger.

## 9. Type → product handoff

A strong SaaS pattern:

**TYPE OWNS FRAME → HERO WORD LOCK → WORD / SHAPE TRANSFORMS →
PRODUCT WORLD IS REVEALED → PRODUCT BECOMES PROOF**

Do not force UI to share the frame during the strongest kinetic passage.

## 10. Deterministic counters

```js
const n = {v:0};
tl.to(n, {
  v: 350,
  duration: 1,
  onUpdate() {
    el.textContent = Math.round(n.v);
  }
});
```

Use:

```css
font-variant-numeric: tabular-nums;
```

and a stable width so the layout does not jitter.

## 11. Deterministic procedural motion

Good:

```js
const wobble = Math.sin(t * 2.1 + seed) * 4;
```

Bad in a seekable render path:

```js
x += velocity * dt;
x += Math.random();
```

## 12. Light leak

Treat it as a lens-space event above the world, not an object inside the world.
Use sparingly. A leak at every cut becomes an editor preset.

## 13. Collage camera helpers

Conceptual helpers:

```js
look(at, x, y, z, dur)
home(at, dur)
into(cutAt, x, y, z)
settle(cutAt, x, y, z)
```

The important idea is choreography:
- close inspection;
- travel;
- landing;
- text/readable information after the move.

## 14. Object performance

For 3D or 2.5D hero objects:
- anticipation tilt;
- compress/release;
- reaction;
- lag/follow-through;
- magnetic assembly;
- hinge/fold/peel;
- collision response;
- authored landing pose.

Avoid perpetual turntable rotation.

## 15. Snapshot QA

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
- camera consequence;
- contrast;
- continuity;
- unintended visible placeholders;
- anti-PPT symptoms.

## 16. Common traps

- future GSAP `from()` tween corrupts frame zero;
- CSS specificity reveals supposedly hidden elements;
- SVG filter region clips motion blur;
- WebGL bloom threshold washes out the frame;
- local module caching makes edits look ignored;
- multiple clocks cause scrub/export mismatch;
- camera pose is calculated but never applied to the active camera;
- control system overwrites authored camera transforms;
- 3D geometry rotates edge-on and becomes a line;
- continuous random drift changes every capture;
- starter palette/font survives into final work;
- every cut uses the same “cinematic” trick.

When a technique becomes visible as a reusable preset rather than a motivated
event, reduce or replace it.


## 17. Full typography highlight menu

Choose one highlight family for a piece:

| Variant | Character | Typical fit |
|---|---|---|
| `pill` | assertive, product-like | app / SaaS / tech |
| `under` | editorial, calm | finance / journalism / productivity |
| `marker` | human, educational | community / education |
| `box` | technical, precise | developer / hardware |
| `color` | luxury, minimal | automotive / fashion / property |
| `strike` | contrast / correction | before-after / misconception |

One keyword highlight per sentence is a strong default. The shape itself is not
a universal signature and must be derived from the project.

## 18. Contrast pocket

When white type sits on a busy dark world, create a local luminance pocket
under the reading area rather than adding glow to the letters.

The background should become quieter exactly where comprehension happens.

For light scenes, reverse the strategy: high-luminance surface + dark ink.

## 19. Dashed-line drawing

Do not reveal a dashed line by animating `stroke-dashoffset` if that makes the
dashes visibly walk.

Reveal the already-dashed line using `clip-path` / masking from the intended
drawing direction.

`runtime/explainer-helpers.js` provides `drawDash()` for this use case.

## 20. Full state-driven WebGL pattern

A reusable state object may include:

```js
{
  grid, dust, nebula, stars, tunnel, flow,
  camX, camY, camZ, camRoll, bloom, shake,
  heroO, heroS, heroX, heroY, heroZ,
  heroRotX, heroRotY, heroRotZ
}
```

Tween state values from GSAP. Recompute visual positions from state + stable
seeds during render.

Do not integrate velocity over frame time in a seekable/exportable scene.

## 21. Bloom pipeline

When true WebGL bloom is justified, the full runtime includes:

- `EffectComposer`;
- `RenderPass`;
- `UnrealBloomPass`;
- `OutputPass`.

Keep threshold/strength restrained. Bloom belongs to hierarchy and activation,
not every surface.
