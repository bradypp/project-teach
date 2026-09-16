# Switchboard: learn by building an incident agent

[Open the live notebook](https://bradypp.github.io/project-teach/).

An on-call engineer asks, “Why did checkout errors rise after release 42?” Switchboard is a fictional project built around that question: a Go API accepts the investigation, a LangGraph worker reads runbooks and deployment events, and an evaluation checks where the answer went wrong. The [project brief](PROJECT_PLAN.md) gives the teaching agent its starting context.

The notebook shows what the five teaching skills produce: lessons tied to a design decision, practice with feedback, and notes for the next session. Pages use the bundled templates and components, including a context-packing experiment. The initial lessons explain design mechanisms without framework research; the later recovery lessons include a [source-backed comparison of checkpoints and leases](.learning/research/checkpoints-and-leases.html). There is no running backend or measured application performance.

## Take a tour

1. [Where the agent ends and the platform begins](.learning/lessons/agent-runtime.html): the browser closes after acceptance. Follow which component still owns the investigation.
2. [Retrieve evidence before writing the answer](.learning/lessons/evidence-before-answers.html): the search finds a useful source. Work out why it might never reach the model.
3. [Context lab](.learning/quizzes/context-lab.html): increase retrieval depth while keeping the token budget fixed. Predict what changes before running the packer.
4. [An eval should tell you what broke](.learning/lessons/evals-that-find-the-failure.html): compare policies that answer more questions or make fewer unsupported claims.
5. [Incident room](.learning/quizzes/incident-room.html): inspect a wrong answer and its trace, choose the next experiment, then reveal the feedback.

For a second session, try [replay and changing evidence](.learning/lessons/replay-is-not-resume.html), [leases and deadlines](.learning/lessons/leases-and-deadlines.html), or [abstention and coverage](.learning/lessons/abstention-and-coverage.html). The [recovery drill](.learning/quizzes/recovery-drill.html) asks you to apply those distinctions.

Use the [topic page](.learning/topics/reliable-investigations.html) to connect the lessons, the [contract reference](.learning/references/investigation-contract.html) to look up a decision, and the [glossary](.learning/references/glossary.html) to revisit a term.

## What a session leaves behind

The [mission](.learning/MISSION.md) sets the learning goals. [Learning state](.learning/LEARNING_STATE.md) distinguishes introduced material from questions that still need checking. Neither file claims that someone read or understood the pages. Research notes describe sources and design choices, not learner achievements.

The public site is a static copy of `.learning/`. Interactive answers stay in the page; copy or save them before leaving. On your own machine, chat handoffs refer to local files. A public demo URL does not give a new agent access to your local project.

## Run locally

Open `.learning/index.html` directly, or serve it:

```sh
python3 -m http.server 8000 --directory examples/.learning
```

Run that command from the repository root. The previous [Lantern notebook](lantern/README.md) is preserved separately.
