# Repository management

AMHFXMOTIONRENDER is maintained as one Motion Designer v3.9 integration.

## Single-source rule

- `SKILL.md` is the active router/integration contract.
- `skill-source/part-01.md` and `skill-source/part-02.md` are the canonical v3.9 source.
- `references/`, `runtime/`, `assets/`, and `scripts/` are the implementation modules.
- Do not keep parallel version trees, generated copies of the rulebook, compatibility manifests, or duplicate reference aliases on `main`.
- Retired versions belong in Git history, not beside production source.

## Render-file ownership

- `index.html` is the repository root scene.
- `motra-output/index.html` is the Motra Studio handoff scene used by `npm run render:motra`.
- `output/`, `frames/`, and rendered media are generated artifacts and should not be committed unless explicitly needed as fixtures.
- Preserve `motra-output/README.md`.

## Safe cleanup

Safe local cleanup targets include `node_modules/`, generated output/frame directories, rendered media, Python bytecode, OS metadata, and ignored environment files.

Do not remove active authored source from `skill-source/`, `references/`, `runtime/`, `scripts/`, `assets/`, `.github/workflows/`, or the root scene unless the corresponding feature is intentionally retired.

## Verification

Run `npm run check` after source/runtime/render changes. For export changes, also render representative media and inspect the result before using `FINAL_VERIFIED`.
