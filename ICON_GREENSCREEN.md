# Icon Greenscreen Motion Pack

Ten individual Three.js icon motion graphics using the AMHFX Motion Designer render contract.

## Scenes

01 Heart, 02 Bell, 03 Chat, 04 Location Pin, 05 Camera, 06 Music Note, 07 Rocket, 08 Shopping Bag, 09 Check Badge, 10 Lightning.

All scenes use a pure `#00FF00` chroma background, 16:9 composition, 8-second duration, deterministic `window.OPENER.seek(t)`, custom extruded icon silhouettes, layered materials, and active camera choreography.

## Preview

Open `assets/icon-greenscreen.html?scene=1` through the repository server. Add `&debug=1` for the scene label. `?clean=1&scene=1` is the deterministic capture form.

## Export

Render all 10 scenes in both resolutions:

```bash
npm run render:icons
```

Render only one resolution:

```bash
RESOLUTION=1080p npm run render:icons
RESOLUTION=4k npm run render:icons
```

Render selected scenes or override frame rate:

```bash
SCENES=1,4,7 FPS=60 RESOLUTION=4k npm run render:icons
```

Outputs are written to `output/icon-greenscreen/1080p/` and `output/icon-greenscreen/4k/` with a manifest at `output/icon-greenscreen/manifest.json`.

The GitHub Actions workflow `Render icon greenscreen pack` runs 1080p and 4K as separate jobs and uploads each resolution as an artifact.
