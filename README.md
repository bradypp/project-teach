# Teach through projects

Learn the ideas behind the code you're building. Your AI coding agent keeps a project notebook you can return to later.

[![Project Teach: lessons, an interactive context lab and a browsable learning notebook](docs/images/title-card.png)](https://bradypp.github.io/project-teach/)

**[Explore the live example](https://bradypp.github.io/project-teach/)**

An agent can build a working RAG pipeline while leaving you unsure why it retrieves the wrong evidence. These skills let you pause at that decision, work through an explanation tied to your project, and try the idea yourself.

The agent saves substantial lessons as readable HTML pages, connects related topics, and creates practice with feedback. It records what's been introduced and what your own reasoning has demonstrated, giving the next session a useful starting point.

## Try it

From the project you want to learn in, install all five skills:

```sh
npx skills@latest add bradypp/project-teach \
  --skill teach teach-setup teach-quiz teach-review teach-update
```

Choose your coding agent when prompted. The skills share templates and references, so install the whole set. You need Node.js for the installer and Python 3 for the notebook helper. The generated pages open in a browser without a server.

Then ask your agent:

```text
Use the teach skill to explain how retrieval and context packing
should work in this project. Help me reason about what to keep
when the evidence doesn't fit.
```

Teaching works before setup. If you'd like to establish a learning goal first:

```text
Use the teach-setup skill. I'm building an incident-investigation
agent with a Go API and LangGraph. I want to understand the
architecture decisions as I implement them.
```

Setup helps you define the mission and choose optional teaching preferences. You can also enable teaching during ordinary development. It stays off until you choose it.

## See what you'd get

The [Switchboard example](https://bradypp.github.io/project-teach/) follows a fictional incident agent through decisions about runtime design, retrieval, context engineering and evals. It uses the templates that ship with the skills.

| Open an example | What you can do |
| --- | --- |
| [Where the agent ends and the platform begins](https://bradypp.github.io/project-teach/lessons/agent-runtime.html) | Follow a Go request into a durable job and graph worker; reason through lease expiry. |
| [Context lab](https://bradypp.github.io/project-teach/quizzes/context-lab.html) | Change chunk sizes and token budgets, predict what fits, then inspect the result. |
| [Incident room](https://bradypp.github.io/project-teach/quizzes/incident-room.html) | Debug a plausible wrong answer, reveal feedback, and copy your reasoning back to chat. |
| [An eval should tell you what broke](https://bradypp.github.io/project-teach/lessons/evals-that-find-the-failure.html) | Separate retrieval, packing and answer failures before changing a prompt. |

[![Context lab with token controls, an evidence-packing result and a reflection prompt](docs/images/context-lab.png)](https://bradypp.github.io/project-teach/quizzes/context-lab.html)

The example is a teaching notebook, not a running incident-agent backend. Research was skipped for this demonstration, and no learner achievements are invented. [Read the project brief and tour](examples/README.md).

## Use it while you build

Ask for a lesson when a design choice feels fuzzy, then keep coding once you understand enough to proceed. Later, you can ask for a quiz or bring back a debugging experience to work through.

```text
Use the teach-quiz skill to test whether I can distinguish
retrieval failures from context-packing failures.
```

```text
Use the teach-update skill. I found that our retry created a
second investigation. Here's why I think the request key needs
to be scoped by tenant: ...
```

| Skill | When to use it |
| --- | --- |
| `teach` | Explain a project question or find a useful topic to explore. |
| `teach-setup` | Set a mission, preferences and optional workflow integrations. |
| `teach-quiz` | Practise with predictions, debugging scenarios and experiments. |
| `teach-review` | Revisit understanding and choose useful next practice. |
| `teach-update` | Reconcile what you've studied or demonstrated with the learning files. |

Use your agent's skill picker or ask for the skill by name. Lessons include follow-up controls, and quizzes can copy your current responses for discussion. Copying prepares text to paste into chat. It doesn't send anything or mark a topic as learned.

## A notebook that stays with the project

Everything is stored under `.learning/`: the mission, a short learning-state summary, lessons, quizzes and supporting references. The agent keeps selective evidence records for meaningful insights. Generating a lesson records that the material was introduced; it doesn't count as understanding.

Open `.learning/index.html` to browse by topic or page type, switch themes, or save a page as Markdown. The HTML and Markdown files are yours to edit and track in Git. There's no separate learning account or global progress store.

For installation from a checkout, optional integrations and contributor checks, see the [maintenance guide](docs/maintenance.md). The reusable package lives in [.agents/skills/learning](.agents/skills/learning).
