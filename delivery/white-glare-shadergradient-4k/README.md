# White Glare / Shine Overlays — ShaderGradient 4K

Ten monochrome glare/shine plates rendered with `@shadergradient/react` for compositing over footage.

## Output contract

- 10 unique stills
- 3840 × 2160 (UHD 4K)
- 16:9
- JPEG quality 96
- black background + white/gray light energy
- intended compositing mode: **Screen** or **Add / Linear Dodge**
- deterministic still render (`animate="off"` with fixed `uTime` per preset)

JPEG does not contain alpha. Black is intentional so the files behave as practical light overlays when composited with Screen/Add.

## Variants

1. Center Soft Bloom
2. Diagonal Sweep
3. Horizontal Anamorphic
4. Top-left Flare
5. Top-edge Glow
6. Bottom-right Glow
7. Vertical Light Leak
8. Crossed Double Streak
9. Halo Ring
10. Wide Haze Wash

## Render

```bash
npm install
npm run build
npm run render
```

The renderer launches the locally installed Chrome/Chromium through `puppeteer-core`, forces a 3840×2160 viewport, waits for the ShaderGradient WebGL canvas to settle, validates WebGL availability, then exports all ten JPEGs to `output/` plus a `manifest.json` containing dimensions and render diagnostics.

## Core ShaderGradient setup

The delivery pins:

- `@shadergradient/react` 2.4.20
- React 18.3.1
- `@react-three/fiber` 8.12.0
- Three.js 0.169.0

`ShaderGradientCanvas` uses `preserveDrawingBuffer`, `pixelDensity={1}`, `lazyLoad={false}`, and a fixed 4K browser viewport for capture consistency.
