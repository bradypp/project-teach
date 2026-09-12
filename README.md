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
- `lessons/`, `quizzes/`, `references/`, `assets/`, `index.html`: the browsable local library.

Topic syntheses live in `topics/*.html`, with their own home-page section once one exists. Research and resource lists appear only when useful. There is no global store or automatic cross-project synchronisation.

## Teaching and presentation

Teaching inspects prerequisites across the active plan/spec, teaches upcoming concepts broadly and goes deeply into what is needed next. The mission guides direction; state and records guide known understanding and gaps. Substantive teaching includes research and useful further reading.

Detailed HTML lessons are the default for substantial topics, with readable headings, bullets, worked examples and application. Short explanations can stay in chat. Substantial gaps produce HTML automatically; worthwhile short explanations can also be retained as compact HTML. Tiny clarifications need not become artifacts.

The bundled HTML/CSS supplies a lean base. Lessons can use diagrams, visualisations, simulations and custom widgets suited to the concept. Shared components keep the library consistent without imposing fixed layouts. Every page offers system/light/dark themes; content pages also offer Markdown copy/download. Export preserves teaching content and current responses; custom visuals can supply textual summaries. Theme storage is best-effort for local files, with the choice carried through internal navigation. Exports do not automatically update learning state.

Setup offers optional customisation through the [teaching-style template](.agents/skills/learning/teach/references/PREFERENCES.md). Skipping the questions creates no style file; you can add your own later. The skills and references supply the full baseline. Preferences can override teacher personality, depth, pace and presentation. Optional integration adds a brief project purpose, learning-oriented development rules and a marked passive-teaching block together in `AGENTS.md`. Removing that block disables passive teaching. User-selected workflows can receive small new wrappers; original skills remain untouched.

Teaching and reviews finish by using the `teach-update` skill to reconcile affected learning files; no changes are needed when nothing meaningful changed. Quizzes retain their optional, manual follow-up. Artifacts alone never demonstrate understanding.

## Example notebook

Open [the example notebook](examples/.learning/index.html) to try the theme, diagrams, highlighted code, quizzes, tags and sorting. Its content is synthetic, not learning evidence.

The helper adds creation timestamps automatically. The homepage shows nonempty Lessons, Topics, Quizzes and References sections with shared tag filtering and newest/oldest/alphabetical sorting. The glossary stays unfiltered at the bottom. Use `--tags "subject,another-subject"` when creating pages.

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
- [Artifacts and components](.agents/skills/learning/teach/references/artifacts.md)

Helper tests: `python3 -m unittest discover -s tests/learning -p 'test_*.py'`. Routine lessons need only a quick content/link check; browser tests in `tests/learning/test_browser.cjs` and `test_notebook.cjs` cover shared controls, exports and themes (Playwright and a Chromium browser required).
