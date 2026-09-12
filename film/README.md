# From text to motion

32-second portrait SaaS concept ad, authored specifically for the Indonesian brief.
Master: 1080 × 1920, 60 fps, H.264 CRF 16, stereo AAC.

Uses AMHFXMOTIONRENDER v3.9.2 at bcfbda29facd42c5d1e3b755165772879abef304,
including its world-camera rig, deterministic OPENER timeline, screenshot tool,
and original MP4 exporter. The canonical skill and renderer are unchanged.

The story begins in a real authored chat UI, types the requested Flappy Bird prompt,
follows a hand cursor dragging the exact amhfxmotionrender skill card from the
GitHub repository panel into the chat, sends the prompt, extracts the selected
words, builds an original bird and game environment, then pulls back to an output
preview and the CTA. The UI is a visual concept for this film.

Design: condensed brutal typography, charcoal/ivory/acid-lime palette, purposeful
camera ramps and readable holds. Original vector character and environment.
No stock game screenshots or third-party film footage are included.

Reference research informed the construction of the visual world:
- Ordinary Folk, Webflow: A New Era of No-Code:
  https://www.ordinaryfolk.co/project/webflow-a-new-era-of-no-code
  Its published process frame was inspected for UI planes and spatial continuity.
- ManvsMachine, Flyknit: https://mvsm.com/project/flyknit
  The project describes a unified motion identity and typography; the film uses
  its own materials and motif, with no copied assets or choreography.

Audio: id-ID-ArdiNeural narration generated through edge-tts, edited from measured
speech (outer silence and long gaps only), plus deterministic original electronic
contact, cursor, processing, travel and completion sounds. No background music.
The voice-generation script also auditions id-ID-GadisNeural.

Fonts: Barlow Condensed (OFL), Inter (OFL). Fonts are fetched during the workflow.

Run the workflow on this branch for render QA. Adding `film/FINAL_RENDER` selects
the narrated 1080p/60 final render. Generated media and audio are workflow artifacts,
not committed to the repository. Inspect snapshots and the finished audio/video
before calling any export visually or aurally verified.
