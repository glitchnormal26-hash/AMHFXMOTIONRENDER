# Global Visual Quality Rules — Anti-Primitive / Premium Art Direction

These rules apply to **every visible visual output** in this repository unless the user explicitly overrides a specific rule for a deliberate style reason.

They apply to Three.js, DOM/SVG, Canvas, WebGL, R3F, motion graphics, backgrounds, environments, decorative elements, particles, product visuals, seasonal graphics, abstract graphics, and still frames extracted from motion.

The goal is simple: final output must look **art-directed and production-ready**, never like developer art, a coding tutorial, a primitive WebGL demo, generic clip-art, or placeholder geometry.

---

## 1. Absolute anti-primitive rule

Do not use recognizable default geometric primitives as finished visible artwork.

Forbidden as final visible representations:

- raw sphere;
- raw cube / box;
- raw cone;
- raw cylinder;
- raw torus;
- raw plane;
- raw triangle / circle;
- stacked primitives used directly as a real-world object;
- obvious default Three.js geometry.

Primitives are allowed only as **construction material**: hidden helpers, masks, emitters, collision geometry, deformation bases, boolean inputs, or meshes that are substantially redesigned before display.

If a viewer can immediately identify the original primitive, the asset fails.

`ANTI_PRIMITIVE_GATE=PASS|FAIL`

---

## 2. No symbolic shortcuts

Never reduce a real-world or organic object to one obvious primitive.

Examples of rejected shortcuts:

```text
tree != cone
head != sphere
gift != cube
cloud != circles
mountain != triangle
candle != cylinder
leaf != ellipse
snow != white dots
rock != low-poly sphere
shadow != black ellipse
ribbon != rectangle
flower != circles around a circle
```

Objects must be visually designed, not merely symbolized.

---

## 3. Custom silhouette first

Major visible objects require an intentional silhouette.

Prefer:

- custom paths and Bezier contours;
- ShapeGeometry / ExtrudeGeometry;
- spline-generated forms;
- custom BufferGeometry;
- SVG/path-derived geometry;
- custom lathe profiles;
- procedural contour generation;
- sculpted or displaced meshes;
- imported detailed assets when appropriate.

Avoid perfect geometric silhouettes unless geometric minimalism is explicitly part of the concept.

Natural or decorative subjects should use controlled asymmetry, edge breakup, shape variation, curvature variation, and non-uniform negative space.

---

## 4. Deform before display

Any primitive-derived visible object must receive meaningful design transformation before it can appear on screen.

Valid transformation includes:

- bend;
- twist;
- taper;
- vertex displacement;
- subdivision;
- silhouette noise;
- custom extrusion;
- boolean shaping;
- squash/stretch;
- spline deformation;
- asymmetrical scaling;
- surface sculpting;
- custom edge treatment.

Position, rotation, and uniform scale alone do **not** count as design transformation.

---

## 5. Still-frame quality is mandatory

Animation is not allowed to hide weak illustration, modeling, lighting, or composition.

Before motion is approved, freeze representative frames and ask:

> Would this frame still look premium if it were delivered as a static image?

If not, redesign the visual before polishing animation.

Inspect at minimum:

- opening frame;
- hero frame;
- one transition midpoint;
- one settled middle frame;
- final frame.

`STILL_FRAME_GATE=PASS|FAIL`

---

## 6. Hero object quality gate

Every major visible object must demonstrate at least **four** of the following:

1. custom silhouette;
2. depth or thickness;
3. surface detail;
4. material character;
5. lighting response;
6. controlled imperfection;
7. internal detail;
8. intentional edge treatment;
9. layered construction;
10. believable contact / shadow interaction.

If fewer than four are clearly present, redesign the hero asset.

`HERO_VISUAL_GATE=PASS|FAIL`

---

## 7. Material character is required

Important objects must not rely on a flat default material unless flatness is the explicit art direction.

Materials should communicate a specific visual or physical character such as:

- glass;
- frosted acrylic;
- metal;
- brushed metal;
- velvet;
- fabric;
- paper;
- ceramic;
- clay;
- ice;
- resin;
- pearl;
- wood;
- soft plastic;
- painted surface.

Use appropriate combinations of roughness, reflection, transparency, refraction impression, gradients, microtexture, normal variation, emissive accents, and subtle imperfections.

Default material settings are starting points, not finished art direction.

`MATERIAL_GATE=PASS|FAIL`

---

## 8. Shadow quality rule

Do not use a black or gray ellipse as the default shadow solution.

Shadows must respond to:

- object form;
- light direction;
- distance from receiver;
- depth;
- softness;
- contact area;
- atmospheric context.

Prefer contact shadows, soft projected shadows, gradient falloff, layered translucency, ambient-occlusion impression, and irregular edge response when appropriate.

A shadow should describe the object, not expose a shortcut.

---

## 9. Layered depth is mandatory

Scenes should not read as a pile of objects on one plane.

Use at least:

1. foreground;
2. midground / subject layer;
3. background / atmosphere.

Prefer more depth bands when the concept benefits from them.

Depth should be communicated through overlap, Z-position, scale, focus, parallax, atmospheric perspective, light separation, and occlusion.

`DEPTH_GATE=PASS|FAIL`

---

## 10. No clip-art composition

Do not arrange isolated symbols around the canvas like icons.

Prefer:

- cropped forms entering from edges;
- overlaps;
- partial silhouettes;
- visual clusters;
- asymmetric balance;
- layered environmental framing;
- negative space with a purpose;
- foreground occlusion;
- depth-based grouping.

Every frame must feel composed, not populated.

---

## 11. Controlled imperfection

Perfect repetition and mathematical symmetry create a synthetic primitive look.

Introduce deliberate subtle variation in:

- scale;
- rotation;
- spacing;
- curvature;
- silhouette;
- surface response;
- opacity;
- orientation;
- depth;
- animation phase;
- lighting response.

Randomness must stay art-directed rather than chaotic.

Repeated objects must not be exact clones when visible together.

---

## 12. Particle quality rule

Do not default to generic circles or PointsMaterial dots for snow, dust, sparks, stars, confetti, atmosphere, or bokeh.

Particles should vary in:

- shape;
- size;
- blur;
- opacity;
- focus;
- depth;
- rotation;
- velocity;
- trajectory;
- lifetime;
- phase.

Use layered particle systems and custom sprites / alpha shapes where appropriate.

The audience should notice the atmosphere, not the particle implementation.

---

## 13. Optical bokeh rule

Bokeh must not look like randomly placed transparent circles.

Use depth-dependent blur, uneven exposure, partial cropping, overlap, focus variation, bloom variation, and occasional aperture-shape variation.

Bokeh should support optical depth and atmosphere.

---

## 14. Lighting must sculpt form

Lighting is part of the design system.

Use it to reveal:

- silhouette;
- curvature;
- depth;
- texture;
- transparency;
- edge separation;
- material response.

When appropriate, combine key, fill, rim, environment, emissive, bounce impression, and localized glow.

Do not rely on object color alone to describe form.

---

## 15. Edge quality rule

Major visible forms require deliberate edge treatment.

Depending on style this can include:

- bevels;
- softened transitions;
- rough organic edges;
- hand-cut contours;
- frosted boundaries;
- layered outlines;
- translucent edges;
- controlled irregularity.

Raw computer-perfect edges are only acceptable when explicitly required by the art direction.

---

## 16. Detail hierarchy

Do not give every object equal visual density.

Use:

- highest detail on hero / attention owner;
- medium detail on supporting objects;
- simplified but elegant treatment in the background.

Detail must reinforce hierarchy instead of becoming noise.

---

## 17. Designed copyspace

When copyspace is requested, empty space must be intentionally designed rather than accidentally unused.

Copyspace should have:

- low edge density;
- stable contrast;
- controlled particle traffic;
- minimal hero intrusion;
- subtle atmosphere;
- stable readability through the animation;
- intentional framing around it.

Default target when copyspace is a primary requirement: roughly **35–55% calm usable area**, unless the brief requires a different balance.

`COPYSPACE_GATE=PASS|FAIL|NOT_REQUIRED`

---

## 18. One coherent visual language

Every scene should declare a clear art direction such as:

- premium glass;
- paper-cut editorial;
- soft sculpted 3D;
- cinematic realism;
- clay;
- luxury metallic;
- handcrafted textile;
- painterly illustration;
- frosted acrylic;
- organic procedural;
- minimal editorial.

Geometry, materials, particles, lighting, shadows, and motion must belong to the same visual language.

Reject accidental mixtures such as premium glass beside raw low-poly primitives or photoreal lighting on generic developer geometry.

`ART_DIRECTION_GATE=PASS|FAIL`

---

## 19. Motion must follow form

Do not apply one generic floating animation to everything.

Motion should respect the object's visual character:

- fabric -> flowing deformation;
- foliage -> bending and layered response;
- glass ornament -> weighted pendulum / inertia;
- smoke -> turbulent continuous motion;
- paper -> light flutter;
- liquid -> viscous deformation;
- heavy object -> slower acceleration and settle.

Animation should strengthen material and form perception.

---

## 20. Thumbnail test

Inspect representative still frames at full resolution, 1080p, approximately 25% scale, and thumbnail size.

If major objects collapse into obvious circles, cubes, cones, triangles, cylinders, or generic blobs, their silhouettes are too primitive and must be redesigned.

`THUMBNAIL_GATE=PASS|FAIL`

---

## 21. Automatic rejection conditions

Reject and redesign before final render if any major visible element resembles:

- a default primitive;
- Three.js example code output;
- a WebGL tutorial;
- developer placeholder art;
- generic clip-art;
- an emoji-like object when not intended;
- a generic particle demo;
- a low-effort low-poly placeholder;
- a mathematically perfect natural object;
- a symbolic shortcut standing in for an illustrated/modelled object.

The phrase **"looks like a Three.js demo"** is an automatic failure condition.

---

## 22. Implementation convenience never outranks visual quality

Do not choose a primitive simply because it is fast to code.

Use the simplest implementation that can still achieve the required **visual quality**. If the simplest geometry produces weak art direction, use a more capable construction method.

For hero assets, visual quality takes priority over implementation convenience.

---

## Final visual verification block

A substantial visual should not be approved unless the applicable fields are truthful:

```text
ANTI_PRIMITIVE_GATE=PASS
STILL_FRAME_GATE=PASS
HERO_VISUAL_GATE=PASS
MATERIAL_GATE=PASS
DEPTH_GATE=PASS
ART_DIRECTION_GATE=PASS
THUMBNAIL_GATE=PASS
COPYSPACE_GATE=PASS|NOT_REQUIRED
```

These gates are in addition to the existing camera, composition, kinetic, continuity, playback, payoff, and export gates.

The encoded video remains the final motion authority, but **playback approval does not override weak still-frame visual design**.
