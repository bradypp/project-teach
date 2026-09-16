# Switchboard: learn by building an incident agent

[Open the live notebook](https://bradypp.github.io/project-teach/).

Switchboard is a fictional applied AI and platform project: a Go API accepts investigations, a LangGraph worker gathers evidence from runbooks and deployment events, and evaluations help locate failures. The [project brief](PROJECT_PLAN.md) supplies the context a teaching agent would normally read.

The notebook was created from scratch using the five-skill system's setup, teaching, quiz and update guidance. Pages use the bundled library helper, page templates and practice components, with an authored context-packing experiment. There is no custom demo theme. Research was deliberately skipped; the lessons describe design mechanisms, not verified framework APIs.

## Take a tour

1. [Where the agent ends and the platform begins](.learning/lessons/agent-runtime.html): follow a request through a Go API, durable job and graph worker.
2. [Retrieve evidence before writing the answer](.learning/lessons/evidence-before-answers.html): inspect retrieval, context packing and citations.
3. [Context lab](.learning/quizzes/context-lab.html): predict what fits, change the inputs and compare the result.
4. [An eval should tell you what broke](.learning/lessons/evals-that-find-the-failure.html): separate failure stages and choose a useful test.
5. [Incident room](.learning/quizzes/incident-room.html): debug a plausible wrong answer and copy your reasoning back to chat.

The [system synthesis](.learning/topics/reliable-investigations.html) connects the lessons. The [contract reference](.learning/references/investigation-contract.html) keeps implementation decisions close at hand.

## What a session leaves behind

The [mission](.learning/MISSION.md) defines the intended capabilities. [Learning state](.learning/LEARNING_STATE.md) records introduced material and questions worth checking. It makes no claim that a learner read or understood these pages. There are no invented evidence records, glossary achievements or research notes.

The public site is a static copy of `.learning/`. Interactive answers stay in the page; copy or save them before leaving. On your own machine, chat handoffs refer to local files. A public demo URL does not give a new agent access to your local project.

## Run locally

Open `.learning/index.html` directly, or serve it:

```sh
python3 -m http.server 8000 --directory examples/.learning
```

Run that command from the repository root. The previous [Lantern notebook](lantern/README.md) is preserved separately.
