# Repository management

AMHFXMOTIONRENDER is maintained as one Motion Designer v3.9.4 integration with one FFmpeg-first media pipeline.

## Single-source rule

- `SKILL.md` is the active router/integration contract.
- `skill-source/part-01.md` and `skill-source/part-02.md` are the canonical v3.9 source.
- `references/`, `runtime/`, `assets/`, and `scripts/` are the implementation modules.
- Do not keep parallel version trees, generated copies of the rulebook, compatibility manifests, duplicate reference aliases, renderer-specific staging trees, or one-off video projects on `main`.
- Retired versions, renderer bridges, project-specific scenes, and completed delivery work belong in Git history or dedicated repositories, not beside production source.

## Branch and workflow rule

- Create feature, fix, chore, and render branches from current `main`.
- One-off client/delivery/video projects should live on temporary branches or in separate repositories and should not remain as project directories on `main` after delivery.
- Merge production-source changes through pull requests; CI must not commit or push generated media back to `main`.
- Fast QA runs for pull requests and pushes to `main`; avoid duplicate branch-push runs for commits already covered by a pull request.
- Expensive render QA should be path-scoped, cancellable when superseded, and use lightweight PR smoke tests with full regression on `main` or manual dispatch.
- Retire merged or abandoned branches after their reusable work is preserved in `main` or Git history.

## Render-file ownership

- `assets/starter.html` is the neutral OPENER-compatible starter and E2E fixture.
- root `index.html` is only a lightweight launcher to the neutral starter for default CLI ergonomics.
- `scripts/export-mp4.mjs` is the canonical browser-capture + FFmpeg render path.
- `output/`, `frames/`, snapshots, hashes, audio fixtures, and rendered media are generated artifacts and should not be committed.
- Project-specific render workflows and completed delivery scene trees should not be retained on `main`; reusable renderer QA belongs in `.github/workflows/qa.yml` and `.github/workflows/render-e2e.yml`.

## Safe cleanup

Safe local cleanup targets include `node_modules/`, generated output/frame/snapshot directories, rendered media, checksum files, Python bytecode, OS metadata, ignored environment files, and completed one-off project work after it is preserved in Git history.

Do not remove active authored source from `skill-source/`, `references/`, `runtime/`, `scripts/`, or the neutral reusable files in `assets/` unless the corresponding feature is intentionally retired.

`main` must not contain top-level `delivery/` or `videos/` project trees, project-specific top-level asset files, or project-specific delivery/render workflows. The QA hygiene gate enforces this boundary and only permits the project-agnostic `render-e2e` render workflow.

## Verification

Run `npm run check` after source/runtime/render changes. For exporter or FFmpeg workflow changes, also run the project-agnostic E2E render workflow and inspect representative encoded output before using `FINAL_VERIFIED`.
