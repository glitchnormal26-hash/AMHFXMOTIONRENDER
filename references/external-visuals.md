# Optional external visual modules

AMHFXMOTIONRENDER may use external visual libraries when a brief explicitly benefits from them, but they are **optional capabilities**, not part of the canonical Motion Designer source. The default remains DOM/SVG/GSAP and the repository's own runtime.

The local clip planner may recommend the integrations below by keyword. A recommendation means “consider this capability during authorship”; it does not mean the dependency is already installed or that third-party source has been copied into this repository.

## Selection rules

Use an external module only when it materially improves the requested visual language. Do not add WebGL/shader cost to a scene merely because the library exists.

Prefer progressive enhancement:

1. author a deterministic AMHFX baseline;
2. add the optional visual effect behind a clear adapter boundary;
3. keep timing controlled by the AMHFX master timeline;
4. verify deterministic seeking at arbitrary timestamps;
5. provide a reduced/fallback treatment when WebGL or the external module is unavailable.

External effects must never take over camera choreography. Camera movement remains authored through the AMHFX camera/world rig.

## ShaderGradient — animated gradients

Source: `https://github.com/ruucm/shadergradient`

Recommended for briefs containing concepts such as animated gradient, mesh gradient, aurora, shader gradient, iridescent background, or fluid color field.

The published `shadergradient` package identifies itself as MIT. The repository root metadata does not expose a repository-wide license, so use the published package/API rather than copying arbitrary monorepo source files.

Integration guidance:

- use as a background or bounded visual layer, not as the scene timeline authority;
- pause autonomous animation where possible and derive visual state from deterministic AMHFX time;
- if deterministic external seeking is not practical, recreate the required gradient motion with local shader/CSS primitives instead;
- preserve typography contrast and camera-space safe lanes over high-frequency color changes.

## liquid-glass-js — frosted / refractive glass

Source: `https://github.com/dashersw/liquid-glass-js`

License: MIT.

Recommended for briefs containing frosted glass, refractive glass, translucent panel, glass card, liquid glass, lens/refraction, or glass UI.

The library is WebGL-powered and supports real-time refraction, blur, masking, tinting, and rounded/circle/pill glass shapes. It uses `html2canvas` for page sampling in its documented setup.

Integration guidance:

- use for hero panels, navigation capsules, glass controls, or short UI emphasis—not every surface;
- pin effect parameters to authored values on the master timeline instead of uncontrolled realtime interaction;
- capture-test the effect in the actual Chromium/Puppeteer render path before delivery;
- provide a CSS backdrop-filter/opacity fallback for unsupported or unstable WebGL capture;
- do not let glass blur reduce text legibility below the scene's contrast requirements.

## paper-design/liquid-logo — liquid-metal logo reference

Source: `https://github.com/paper-design/liquid-logo`

License: PolyForm Shield 1.0.0.

The repository demonstrates a liquid-metal logo treatment and depends on Paper Design shader packages. Because PolyForm Shield contains non-compete restrictions, AMHFXMOTIONRENDER must **not vendor, copy, or automatically install this repository as a default dependency**.

Recommended use is reference-only for briefs containing liquid logo, liquid metal logo, molten chrome, metallic logo, or fluid emblem.

Safe implementation guidance:

- treat the repository as visual/reference research unless the project owner has separately reviewed and accepted its license for the intended product;
- by default, author an original AMHFX effect using local SVG masks, displacement, gradients, specular layers, or an independently authored shader;
- never claim the resulting AMHFX implementation is Paper Design's implementation;
- if a project explicitly elects to use Paper Design code after license review, keep its notices and dependency boundary intact.

## Planner contract

`npm run clip:plan` returns `visualEffects` recommendations when relevant keywords are present. Each recommendation includes an integration mode:

- `optional-package` — may be integrated as an external dependency after normal compatibility/license review;
- `reference-only` — do not copy/install by default; create an original local implementation or obtain explicit project-level license approval.

No external effect recommendation changes `FINAL_VERIFIED` requirements. Visual capture, timing, camera, typography, and audio QA still apply.
