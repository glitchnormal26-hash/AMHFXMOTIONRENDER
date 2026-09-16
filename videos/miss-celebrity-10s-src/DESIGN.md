# DESIGN.md — Miss Celebrity 10s Vertical Product Promo

## Style Prompt
A polished kawaii beauty-commercial world inspired by the supplied Miss Celebrity contact-lens packaging: candy-pink lacquer, pearly light, soft studio depth, pop-star star motifs, graceful ribbon curves, and crisp mobile-first typography. The product box is always the visual authority. Motion feels buoyant and playful but controlled, with premium easing, clear settles, and three distinct camera/framing states.

## Colors
- `#FFF8FC` — porcelain white canvas / highlight
- `#FFD1E7` — blush atmosphere
- `#F33B96` — hero hot pink
- `#D81B72` — deep magenta structure / accents
- `#45122F` — plum ink for high-contrast copy
- `#FFD23F` — star-yellow micro-accent
- `#1C4F9A` — packaging-blue micro-accent

## Typography
- Display: `Trebuchet MS`, rounded fallback sans-serif; heavy, friendly, compact.
- Supporting copy: Arial / system sans-serif; clean and highly readable on mobile.
- Keep copy short: no paragraphs, no tiny metadata.

## Surface & Depth
- Product: supplied packaging image, treated as a glossy hero object with layered rim-light and shaped contact shadow.
- Background: radial light fields and curved ribbon bands, never a flat generic gradient.
- Depth: foreground spark/ribbon accents, product midground, background light architecture.
- Shadows: soft multi-layer contact shadow with directional falloff; no flat black ellipse.

## Motion Language
- Burst → breath → burst → lock.
- Framing state 1: centered reveal with a controlled push.
- Framing state 2: lateral/vertical inspection reframe with the product offset and copy revealed.
- Framing state 3: detail push then pull-back into the final centered packshot.
- Use varied easing families (`power3.out`, `expo.inOut`, `sine.inOut`, `back.out(1.25)`) rather than one repeated recipe.
- No perpetual rotation, no infinite repeats, no random motion.

## What NOT to Do
- No generic tech/HUD styling.
- No raw circles/cubes/primitive demo art as visible hero content.
- No slide-deck/card-swap structure.
- No full 360° product spin.
- No constant camera drift with no landing.
- No text competing with or covering the package front.
