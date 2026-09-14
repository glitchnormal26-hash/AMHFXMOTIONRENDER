# UI Greenscreen Motion Pack

Ten individual 10-second 16:9 Three.js UI motion graphics for chroma-key workflows.

**Delivery:** native 3840×2160 30fps H.264 MP4 plus 1920×1080 30fps H.264 MP4, no audio, pure `#00FF00` background.

Scenes: Command Palette, Notifications, Analytics Dashboard, Media Player, Team Chat, Security Scan, Climate Control, Checkout, Motion Timeline, Navigation.

Preview any scene with `index.html?scene=scene-01-command-palette`. All scenes expose deterministic `window.OPENER = {DURATION, ready, seek(), play()}` for AMHFX capture. Visible UI surfaces use custom rounded/extruded geometry and authored camera paths rather than raw default Three.js primitives.
