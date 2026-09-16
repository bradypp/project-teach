# Maintaining project-teach

The reusable package is `.agents/skills/learning/`. Its five skill folders must remain siblings: supporting skills refer to shared guidance, templates and helpers in `teach/`.

## Install from a checkout

```sh
python3 scripts/install.py /path/to/project/.agents/skills
```

The installer copies the five teaching skills and refuses to overwrite existing destinations. Generated libraries preserve their authored assets; review and copy shared asset updates deliberately.

Python 3 runs the library helper. Generated pages open directly in a browser. The optional transcript helper uses `youtube-transcript-api`; ordinary teaching pages do not need it.

## Guidance

- [Learning state and evidence](../.agents/skills/learning/teach/references/learning-system.md)
- [Teaching methods](../.agents/skills/learning/teach/references/teaching.md)
- [Research](../.agents/skills/learning/teach/references/research.md)
- [Artifact workflow](../.agents/skills/learning/teach/references/artifacts.md)
- [Visual language](../.agents/skills/learning/teach/references/visual-language.md)
- [Practice components](../.agents/skills/learning/teach/references/quiz.md)
- [Writing](../.agents/skills/learning/teach/references/writing.md)
- [Optional integrations](../.agents/skills/learning/teach/references/integrations.md)

## Checks

```sh
python3 -m unittest discover -s tests/learning -p 'test_*.py'
python3 .agents/skills/learning/teach/scripts/check_links.py examples/.learning
```

The `test_*.cjs` scripts under `tests/learning/` cover browser controls, themes, notebook navigation, components, practice and exports. They require Playwright and Chromium; `CHROMIUM_PATH` can select a browser executable. Routine authored pages need content and link checks. New interactions also need response/export checks before and after feedback, as described in the artifact guidance.

The examples are synthetic teaching artifacts, not learning evidence or backend benchmarks. Current verification results belong in the change report; the presence of a test file does not establish that it ran.

## Publishing

[The Pages workflow](../.github/workflows/examples-pages.yml) checks local links and publishes `examples/.learning/` at the site root on relevant pushes to `main`. It can also be run manually. Repository Pages settings must use GitHub Actions. The archived Lantern notebook and repository instruction files are outside the published artifact.

Rebuild the notebook index after changing page titles, tags or membership:

```sh
python3 .agents/skills/learning/teach/scripts/library.py index examples/.learning
```

Keep README screenshots in `docs/images/` representative of the live pages. The title card combines browser captures of the notebook, architecture lesson and context lab.

With Playwright installed, regenerate those captures with:

```sh
node scripts/capture_examples.cjs
```

Set `CHROMIUM_PATH` if using a system Chromium browser. The title card's composition is in `docs/title-card.html`; the capture script renders it after capturing the actual example pages.
