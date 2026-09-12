# SaaS Ads Explainer — From Text to Motion

Production branch for the vertical AMHFXMOTIONRENDER SaaS ad explainer.

## Delivery spec

- Format: 9:16 MP4
- Resolution: 1080×1920
- Frame rate: 30 fps
- Duration: 16.0 s
- Video: H.264 / yuv420p / CRF 16
- Audio: AAC stereo 48 kHz, hi-tech SFX only, no BGM

## Story

1. **Hook — TEXT → MOTION**
   Brutal kinetic type establishes the promise immediately.
2. **Chat prompt**
   User types: `Buatkan animasi Flappy Bird menggunakan skill amhfxmotionrender.`
3. **Cursor drag/drop**
   A hand cursor grabs `prompt.txt`, accelerates toward the composer, and the camera tracks the drag owner.
4. **Build state**
   The drop target activates and transforms into the generated motion viewport.
5. **Flappy Bird proof**
   The generated game runs inside the same visual world as proof that text became authored motion.
6. **Object relay**
   The bird exits the viewport, becomes a motion glyph, and UI fragments relay into the next semantic object.
7. **CTA**
   Fragments assemble into a folder/file illustration named `AMHFXMOTIONRENDER`; final CTA: **Build Now**.

## Motion Designer v3.9.2 production gates

- `REFERENCE_GATE = PASS`
- `CAMERA_GATE = PASS`
- `CAMERA_FOLLOW = USED`
- `SPEED_RAMP = ACTIVE`
- `WORLD_CONTINUITY = CONTINUOUS`
- `ANTI_PPT_GATE = PASS`
- `AUDIO_MODE = NO_BGM / HI-TECH_SFX`
- `VO_STATUS = VO_PROVIDER_PENDING`

Camera framing changes across semantic beats; the drag journey receives subject-aware tracking, gameplay uses a short intentional comprehension hold, and the final CTA uses a motivated dark settle rather than a hard slide reset.

## Final render QA

Verified stream targets:

- H.264 video stream: 1080×1920, 30/1 fps
- AAC audio stream: stereo, 48 kHz
- Duration: 16.0 seconds

The rendered MP4 is delivered separately from this source-control branch.