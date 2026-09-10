# Motra Studio output bridge

Live generator: https://motra-studio-d13ehp.v2.appdeploy.ai/

This folder is the handoff point between the AppDeploy prompt-to-motion studio and the deterministic AMHFXMOTIONRENDER MP4 pipeline.

## Workflow

1. Open Motra Studio and generate the scene.
2. Use **Unduh HTML**. The app downloads a standalone `index.html`.
3. Save or copy that file to `motra-output/index.html` in this repository.
4. Install dependencies with `npm install` and ensure `ffmpeg` + `ffprobe` are on PATH.
5. Run `npm run render:motra` for the default final-quality export.

The bridge uses `INDEX=motra-output/index.html` internally, so the repository's existing root `index.html` is not overwritten.

Advanced overrides remain available, for example:

```bash
QUALITY=fast npm run render:motra
INDEX=/absolute/path/custom.html QUALITY=final npm run render:motra
```

Final video output follows the existing renderer defaults (`output/final.mp4` unless overridden).
