# Repository management

AMHFXMOTIONRENDER is maintained as one Motion Designer v3.9 integration.

## Single-source rule

- `SKILL.md` is the active router/integration contract.
- `skill-source/part-01.md` and `skill-source/part-02.md` are the canonical v3.9 source.
- `references/`, `runtime/`, `assets/`, and `scripts/` are the implementation modules.
- Do not keep parallel version trees, generated copies of the rulebook, compatibility manifests, duplicate reference aliases, or project-specific example source on `main`.
- Retired versions and retired example projects belong in Git history, not beside production source.

## Render-file ownership

- `assets/starter.html` is the neutral OPENER-compatible starter and E2E fixture.
- root `index.html` is only a lightweight launcher to the neutral starter for default CLI ergonomics.
- `motra-output/index.html` is the Motra Studio handoff scene used by `npm run render:motra`.
- `output/`, `frames/`, snapshots, audio fixtures, and rendered media are generated artifacts and should not be committed.
- Preserve `motra-output/README.md`.

## Safe cleanup

Safe local cleanup targets include `node_modules/`, generated output/frame/snapshot directories, rendered media, Python bytecode, OS metadata, and ignored environment files.

Do not remove active authored source from `skill-source/`, `references/`, `runtime/`, `scripts/`, `assets/`, or `.github/workflows/` unless the corresponding feature is intentionally retired.

## Verification

Run `npm run check` after source/runtime/render changes. For export changes, also run the project-agnostic E2E render workflow and inspect representative output before using `FINAL_VERIFIED`.
