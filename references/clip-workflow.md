# Local clip workflow

This module implements the portable part of a template-driven motion-agent workflow inside AMHFXMOTIONRENDER. It deliberately does **not** depend on AutoAE APIs, accounts, hosted template IDs, payment/download flows, or external agent packages.

The adopted workflow is:

`brief -> match a local starter -> author editable content -> preview -> render -> verify`

It remains part of the single Motion Designer v3.9 integration routed by `SKILL.md`; do not create a second skill tree for clip selection.

## 1. Find a local clip architecture

Run:

```bash
npm run clip:plan -- --brief "SaaS launch showing browser UI and dashboard"
```

Useful options:

```bash
npm run clip:plan -- --brief "historical investigation opener" --duration 9 --format 16:9
npm run clip:plan -- --brief "friendly character explainer" --json
npm run clip:plan -- --brief "product feature comparison" --write clip-plan.json
```

The matcher only selects among authored starter architectures already in `assets/`. It is a deterministic routing aid, not a promise that a hosted third-party template was found.

Current archetypes:

- `assets/starter-full-runtime.html` — product, SaaS, browser, dashboard, and UI showcases;
- `assets/starter-explainer-jurnalisme.html` — journalism, documentary, evidence, investigation, and historical explainers;
- `assets/starter-explainer-katalog.html` — catalog, product-feature, lineup, and comparison sequences;
- `assets/starter-explainer-kartun.html` — character-led and playful explainers;
- `assets/starter-explainer-sketsa.html` — sketch, concept, diagram, and storyboard treatments;
- `assets/starter-explainer.html` — continuous-action explainers;
- `assets/starter.html` — neutral opener, title, bumper, hook, and reveal work.

## 2. Customize by authorship, not fake form fields

The plan emits suggested text, palette, media, camera, and audio targets. These are **authoring targets**. Do not claim a field is automatically wired unless the selected scene actually exposes that field in its runtime.

For a selected starter:

1. copy it to a working scene such as `motra-output/index.html`;
2. replace authored text and media directly in the scene;
3. adapt palette variables and typography without breaking contrast or safe lanes;
4. preserve the selected architecture's semantic motion instead of only reskinning colors;
5. load `references/camera-motion.md` whenever the sequence contains travel, follow, push-through, spatial UI, or a fast transfer.

Treat starters as architecture references, never as final visual templates.

## 3. Camera and timing contract

Every substantial semantic beat must declare one of `MOVING`, `TRACKING`, `REFRAME`, or `LOCKED_INTENTIONAL`.

For fast product/UI clips, prefer a framing change every 2–4 seconds. Moving attention owners should normally receive follow, lead, catch-up, handoff, push-through, or reframe behavior rather than being observed from one permanently fixed wide shot.

Speed ramps must be authored on the master timeline. Keep capture FPS fixed and preserve deterministic seeking. Inspect typography/object collisions at both the fastest midpoint and the landing frame.

## 4. Preview and render handoff

A plan prints the suggested starter plus the handoff commands. The default path is:

```bash
cp assets/<selected-starter>.html motra-output/index.html
QUALITY=fast npm run render:motra
npm run render:motra
```

The fast render is for iteration. The final render is only a delivery candidate after visual/audio inspection.

## 5. Verification

Always run:

```bash
npm run check
```

For cinematic, tracking, spatial, or fast-ramp clips also inspect:

- opening framing;
- first transfer/reframe;
- fastest ramp midpoint;
- ramp landing;
- hero follow or handoff when applicable;
- final framing;
- typography/media collisions during the fastest move.

Do not use `FINAL_VERIFIED` from syntax checks or a successful encoder exit alone.
