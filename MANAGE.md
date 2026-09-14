# Repository management

AMHFXMOTIONRENDER is maintained as one Motion Designer v3.9.4 integration with one FFmpeg-first media pipeline.

## Single-source rule

- `SKILL.md` is the active router/integration contract.
- `skill-source/part-01.md` and `skill-source/part-02.md` are the canonical v3.9 source.
- `references/`, `runtime/`, `assets/`, and `scripts/` are the implementation modules.
- Do not keep parallel version trees, generated copies of the rulebook, compatibility manifests, duplicate reference aliases, or renderer-specific staging trees on `main`.
- Retired versions, retired renderer bridges, and retired examples belong in Git history, not beside production source.

## Branch and workflow rule

- Create feature, fix, chore, delivery, and render branches from current `main`.
- Merge changes through pull requests; CI must not commit or push generated media back to `main`.
- Fast QA runs for pull requests and pushes to `main`; avoid duplicate branch-push runs for commits already covered by a pull request.
- Expensive render QA should be path-scoped, cancellable when superseded, and use lightweight PR smoke tests with full regression on `main` or manual dispatch.
- Retire merged or abandoned branches after their work is preserved in `main` or Git history.

## Render-file ownership

- `assets/starter.html` is the neutral OPENER-compatible starter and E2E fixture.
- root `index.html` is only a lightweight launcher to the neutral starter for default CLI ergonomics.
- `scripts/export-mp4.mjs` is the canonical browser-capture + FFmpeg render path.
- `output/`, `frames/`, snapshots, hashes, audio fixtures, and rendered media are generated artifacts and should not be committed.
- Delivery workflows publish render evidence as GitHub Actions artifacts instead of force-adding media to the repository.

## Safe cleanup

Safe local cleanup targets include `node_modules/`, generated output/frame/snapshot directories, rendered media, checksum files, Python bytecode, OS metadata, and ignored environment files.

Do not remove active authored source from `skill-source/`, `references/`, `runtime/`, `scripts/`, `assets/`, or `.github/workflows/` unless the corresponding feature is intentionally retired.

## Verification

Run `npm run check` after source/runtime/render changes. For exporter or FFmpeg workflow changes, also run the project-agnostic E2E render workflow and inspect representative encoded output before using `FINAL_VERIFIED`.
