# Explainer — Continuous Visual Argument

An explainer should carry one argument through an evolving world, not autoplay a
sequence of designed slides.

## Style families

1. **Cartoon collage** — warm paper, flat cutout illustration, hand-note accents.
2. **Visual journalism** — editorial field, sourced imagery, restrained annotation.
3. **White catalog** — white/grid surface, product/person cutouts, mixed typography.
4. **Vintage sketch** — sepia paper, engraving/sketch language, serif hierarchy.
5. **Continuous action** — persistent subject, moving world, route/process traversal,
   changing viewpoints and instruments.
6. **SaaS/product system** — tokenized palette, fragment typography, floating UI or
   abstract product surfaces, layered depth, concise feature beats, and camera moves
   paired to semantic reveals.

These are surface families, not templates.

When the brief calls for a modern SaaS/product explainer, load
`references/saas-motion-explainer-direction.md` as the task-specific art-direction
profile and pair it with `references/camera-movement.md` plus
`references/camera-motion.md`.

## Default production assumptions

Unless the user states otherwise:

- aspect: 16:9;
- duration: 30–90 seconds depending on requested depth;
- captions: off;
- visible player: off;
- master timeline: deterministic;
- background music: off unless explicitly requested;
- SFX: optional and **asset-only**;
- no voice-over requirement or voice-over workflow exists in this skill.

For short SaaS/product concept clips, the task-specific direction profile may define a
much shorter 6–10 second beat structure. Do not stretch those clips to the generic
30–90 second explainer range merely because this file contains the broader default.

SFX may only use real audio files supplied by the user or already present under
`assets/`. Do not generate, synthesize, search, scrape, or download SFX. If no suitable
asset exists, render silently.

## Visual argument rule

Each beat must advance the argument by changing at least one meaningful visual
relationship:

- framing;
- scale hierarchy;
- viewpoint;
- spatial relation;
- object state;
- typographic ownership;
- cause/result relationship;
- environment or product state.

Do not rely on copy replacement inside one static composition.

For SaaS/product work, a feature label is not itself a beat. The beat should visibly
change UI state, route data, resolve a before/after condition, hand off attention,
reframe the product, or otherwise make the label true in the world.

## Camera choreography

For collage and spatial explainers, prefer authored camera progression such as:

**CLOSE DETAIL → TRAVEL → SECOND DETAIL → PULL OUT → READABLE HOLD**

For continuous-action explainers:

- keep the hero subject present for a meaningful portion of the duration;
- let world distance / position be a deterministic function of time;
- change viewpoint before monotony forms;
- use camera follow, lead, catch-up, handoff, and reframe behavior when the hero moves;
- use instruments appropriate to the fact: map, profile, dashboard, head-on view,
  side view, interior, route, comparison.

Avoid three consecutive beats with the same effective viewpoint.

For SaaS/product clips, camera motion should stay restrained enough to preserve type
and UI readability. A low-amplitude micro-drift may support a hold, but it does not
count as the authored framing change required by the camera gate.

## Composition rule

Every key frame must have one clear attention owner.

Before export, inspect:

- foreground / hero / background separation;
- negative-space balance;
- edge tension and crop;
- local contrast under important type;
- collision between type, objects, UI, and frame edges;
- whether camera motion improves or damages the reading order.

If a frame could be rearranged randomly without changing its hierarchy, the
composition is not authored strongly enough.

For SaaS/product scenes, keep the main hero inside the fixed 1920x1080 safe composition
and use negative space as a deliberate reading lane or counterweight. Do not populate
empty areas with decorative cards simply because space exists.

## Kinetic typography rule

On-screen type should carry hooks, hero phrases, key numbers, names, comparisons,
warnings, or payoffs—not explanatory paragraphs.

When type becomes kinetic, vary motion by semantic role. Use combinations of attack,
replacement, crop/mask reveal, compression, overshoot, foreground invasion,
occlusion, camera targeting, semantic transformation, and type-to-product handoff.

A repeated word-by-word fade/slide/scale stagger is insufficient for a hero kinetic
passage.

For the SaaS profile, use short hero lines and 2–4 word feature labels. Do not animate a
paragraph just because the UI visual itself is minimal.

## Entity rule

When a person, product, place, company, vehicle, device, or other named entity is
materially discussed, show a visual representation of it in that beat when feasible.
Do not make the viewer read names while the visual remains generic.

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

For SaaS dashboards, the number should belong to a visible product state or data
relationship rather than floating as an unrelated giant metric card.

## Source and asset handling

Visual journalism:
- prefer licensable / public-domain sources;
- preserve source credit where required.

Cartoon/sketch:
- keep generated visual assets stylistically coherent across the piece.

Product/catalog:
- use real brand/product assets where available;
- do not invent product claims.

SaaS/product:
- choose one named palette per concept when using the SaaS direction profile;
- keep iconography and UI surface treatment internally consistent;
- use the starter only as architecture, never as a reusable finished visual identity.

Audio:
- use only existing user/repository SFX assets;
- keep audio subordinate to the visual event it supports;
- never add placeholder/generated SFX merely to make the export feel finished.

## Starter routing

Use the closest structural starter when useful, then replace all placeholder styling,
copy, geometry, composition, camera path, transition behavior, and timing from the
actual brief.

- `assets/starter-explainer.html` — generic continuous-action explainer architecture.
- `assets/starter-saas-explainer.html` — SaaS/product direction + camera architecture,
  demonstrating palette tokens, fragment type, layered depth, stagger/hold pacing,
  fixed viewport fit, and authored reframing.

A starter that still visibly determines the final look or choreography is a failed
skill-use case.

## Final explainer gate

Before `FINAL_VERIFIED`, require:

```text
SKILL_USAGE_GATE=PASS
CAMERA_GATE=PASS
COMPOSITION_GATE=PASS
KINETIC_GATE=PASS
ANTI_PPT_GATE=PASS
SAAS_DIRECTION_GATE=PASS|NOT_REQUIRED
SFX_MODE=ASSET_ONLY|NONE
```
