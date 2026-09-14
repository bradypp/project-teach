# Teach through projects

A small, project-based teaching system: build useful things, understand consequential ideas and retain enough learning to guide the next session.

## Commands

| Skill | Purpose |
| --- | --- |
| `teach [question]` | Learn in context or discover a worthwhile topic |
| `teach-setup` | Establish the project mission, preferences and optional integrations |
| `teach-update [account]` | Reconcile meaningful learning and its evidence |
| `teach-review` | Review understanding, uncertainty and useful next practice |
| `teach-quiz [topic]` | Create enjoyable practice with feedback and lesson links |

Use your host's skill syntax or point the agent at the relevant `SKILL.md` in [.agents/skills/learning](.agents/skills/learning). Teaching works before setup. Ordinary implementation stays quiet unless passive teaching is enabled.

## Project files

Everything lives under `.learning/`:

- `MISSION.md`: purpose, goals and scope.
- `PREFERENCES.md`: optional, editable preference overrides.
- `LEARNING_STATE.md`: current understanding, uncertainty, opportunities and links.
- `records/`: selective learning insights with evidence.
- `references/glossary.html`: useful vocabulary, created when needed.
- `lessons/`, `topics/`, `quizzes/`, `references/`, `assets/`, `index.html`: the browsable local library.

Research and resource lists appear only when useful. There is no global store or automatic cross-project synchronisation.

## Teaching and presentation

Teaching inspects prerequisites across the active plan/spec, teaches upcoming concepts broadly and goes deeply into what is needed next. The mission guides direction; state and records guide known understanding and gaps. Substantive teaching includes research and useful further reading.

Detailed HTML lessons are the default for substantial topics; short explanations can stay in chat. Worthwhile short explanations may also be retained as compact HTML, while tiny clarifications need not become artifacts.

The bundled HTML/CSS supplies a lean base. Lessons can use diagrams, visualisations, simulations and custom widgets suited to the concept. Shared components keep the library consistent without imposing fixed layouts. Content pages support themes, Markdown export and clipboard handoffs for continuing in chat; standalone pages never submit or update learning state directly.

Setup offers optional customisation through the [teaching-style template](.agents/skills/learning/teach/references/PREFERENCES.md). Skipping the questions creates no style file; you can add your own later. The skills and references supply the full baseline. Preferences can override teacher personality, depth, pace and presentation. Optional integration adds a brief project purpose, learning-oriented development rules and a marked passive-teaching block together in `AGENTS.md`. Removing that block disables passive teaching. User-selected workflows can receive small new wrappers; original skills remain untouched.

Teaching and reviews finish by using the `teach-update` skill to reconcile affected learning files; no changes are needed when nothing meaningful changed. Quizzes retain their optional, manual follow-up. Artifacts alone never demonstrate understanding.

## Example notebook

Open [the example notebook](examples/.learning/index.html) to try the theme, diagrams, highlighted code, quizzes, tags and sorting. Its content is synthetic, not learning evidence.

The helper adds creation timestamps automatically. The home page groups nonempty content types and supports type, subject and sort controls. Use `--tags "subject,another-subject"` when creating pages.

Mermaid and Highlight.js are bundled locally. Supported diagrams and code blocks inherit the notebook theme; custom layouts remain flexible. Diagram source and code survive Markdown export.

## Install elsewhere

From this repository:

```sh
python3 scripts/install.py /path/to/project/.agents/skills
```

The installer copies only the five sibling teach skills and preserves existing destinations.

Python 3 runs the artifact helper; the generated library opens directly in a browser. The optional transcript helper uses [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api). No server or build pipeline is required.

## Maintenance

- [State and records](.agents/skills/learning/teach/references/learning-system.md)
- [Teaching guidance](.agents/skills/learning/teach/references/teaching.md)
- [Research guidance](.agents/skills/learning/teach/references/research.md)
- [Artifact mechanics](.agents/skills/learning/teach/references/artifacts.md)
- [Artifact visual language](.agents/skills/learning/teach/references/visual-language.md)
- [Writing guidance](.agents/skills/learning/teach/references/writing.md)
- [Optional integrations](.agents/skills/learning/teach/references/integrations.md)

Helper tests: `python3 -m unittest discover -s tests/learning -p 'test_*.py'`. Browser tests in `tests/learning/test_browser.cjs`, `test_follow_up.cjs` and `test_notebook.cjs` cover shared controls, exports and themes (Playwright and a Chromium browser required). Routine pages and link-checking conditions are defined once in [artifact maintenance and verification](.agents/skills/learning/teach/references/artifacts.md#maintain-and-verify).
