---
name: motion-designer
description: Plan, implement, review, and render authored browser motion, kinetic typography, and narrated explainers with Motion Designer v3.8. Use for motion design, animation, deterministic browser capture, and MP4 export tasks.
---

# Motion Designer v3.8 — Full Runtime Router

This repository stores the complete v3.8 skill source losslessly in `skill-source/part-01.md` through `skill-source/part-21.md`.

## Mandatory loading rule

When this repository is used as an agent skill, treat the numbered files in `skill-source/` as one continuous `SKILL.md`, in numeric order. Do not skip a part when the task depends on the full motion-direction policy.

For lightweight repository browsing, this router establishes the highest-priority v3.8 defaults:

- one evolving visual world; avoid slide/presentation motion;
- use the simplest capable runtime: LITE_RUNTIME first, FULL_RUNTIME only when it materially improves communication;
- GSAP is the default deterministic DOM/SVG timeline engine;
- Three.js/R3F only when true spatial geometry/camera/light adds value;
- camera directions must become real camera/world transforms, or be explicitly `LOCKED_INTENTIONAL`;
- explainers default to **VOICEOVER + HI-TECH SFX + CONTROLLED TECH AMBIENCE + SILENCE — NO BGM**;
- explainer VO is required unless the user explicitly requests no narration;
- final VO preference: human/native recording → ElevenLabs → Google Gemini-TTS/Chirp 3 HD → Azure Neural HD → `VO_PROVIDER_PENDING`;
- browser/system TTS is preview-only, never silent fallback for final narration;
- user-supplied VO is timing authority; otherwise measure actual generated VO before final timing lock;
- direct requested video deliverable should be MP4 when render/export capability exists;
- use `scripts/export-mp4.mjs` for deterministic render → H.264 → audio mix/mux → ffprobe verification;
- an MP4 missing required VO/audio is not final;
- use `FINAL_VERIFIED` only after output QA;
- starters are architecture references, never visual templates;
- all placeholder palette, type, copy, geometry and motion signatures must be replaced from the actual brief;
- no legacy source-project branding should appear in outputs.

## Full source

Read in order:

1. `skill-source/part-01.md`
2. `skill-source/part-02.md`
3. `skill-source/part-03.md`
4. `skill-source/part-04.md`
5. `skill-source/part-05.md`
6. `skill-source/part-06.md`
7. `skill-source/part-07.md`
8. `skill-source/part-08.md`
9. `skill-source/part-09.md`
10. `skill-source/part-10.md`
11. `skill-source/part-11.md`
12. `skill-source/part-12.md`
13. `skill-source/part-13.md`
14. `skill-source/part-14.md`
15. `skill-source/part-15.md`
16. `skill-source/part-16.md`
17. `skill-source/part-17.md`
18. `skill-source/part-18.md`
19. `skill-source/part-19.md`
20. `skill-source/part-20.md`
21. `skill-source/part-21.md`

To reconstruct the original single-file skill locally:

```bash
node scripts/build-skill.mjs
```

Output:

`dist/SKILL.md`

The integrity target is recorded in `skill-source/manifest.json`.
