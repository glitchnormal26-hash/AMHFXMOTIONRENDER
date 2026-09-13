# AMHFX SFX Assets

This folder contains a curated motion/UI SFX starter set derived from the project-supplied `Motion Graphic SFX.zip`.

## Why curated

The uploaded archive contains 85 files (~64 MB), including many large button variants and two long music tracks. The repo keeps a small essential subset that is useful for deterministic product-motion work without adding tens of megabytes to source control.

The current pack covers mouse/UI clicks, typing, pop/approve feedback, kinetic text reveal, fast camera/scene whoosh, and camera shutter. See `index.json` for stable IDs, durations, tags, and original source filenames.

## Audio workflow

Treat SFX as authored timeline events, not background decoration. For final MP4 export, build the desired cues into `audio/sfx-mix.wav` (or another supported audio file) and let `scripts/export-mp4.mjs` mux it with VO/ambience. Browser screenshot capture itself does not record audio.

Keep SFX sparse: attach them to meaningful state changes, cursor actions, camera transitions, text reveals, confirmations, or captures. Avoid adding a sound to every animated object.

## Provenance

These files were supplied by the project owner. This repository records their original filenames for provenance but does not make a new claim about third-party licensing. Verify redistribution/use rights for the target project when required.
