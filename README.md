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

- `manifest.yaml`: setup and integration settings.
- `MISSION.md`: purpose, goals and scope.
- `TEACHING_STYLE.md`: readable, editable preferences.
- `LEARNING_STATE.md`: current understanding, uncertainty, opportunities and links.
- `records/`: selective learning insights with evidence.
- `GLOSSARY.md`: useful vocabulary, created when needed.
- `lessons/`, `quizzes/`, `references/`, `assets/`, `index.html`: the browsable local library.

Research, topic synthesis and resource lists appear only when useful. There is no global store or automatic cross-project synchronisation.

## Teaching and presentation

Short explanations can stay in chat. Substantial gaps produce HTML automatically; worthwhile short explanations can also be retained as compact HTML. Tiny clarifications need not become artifacts.

The bundled HTML/CSS supplies a lean base. Lessons can use diagrams, visualisations, simulations and custom widgets suited to the concept. Shared components keep the library consistent without imposing fixed layouts. Quizzes offer optional Markdown copy/download; they do not automatically update learning state.

Setup offers customisation of the [default teaching style](.agents/skills/learning/teach/references/TEACHING_STYLE.md). Skipping the questions keeps the defaults. Optional integration adds project awareness or passive teaching. User-selected workflows can receive small new wrappers; original skills remain untouched.

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
- [Validation](validation.md)

Helper tests: `python3 -m unittest discover -s tests/learning -p 'test_*.py'`. Routine lessons need only a quick content/link check; browser tests are available for changes to shared controls.
