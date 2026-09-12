# Learning artifacts

Use the bundled shell and components to make enjoyable, directly browsable learning material.

## Start with the lean base

Resolve `scripts/library.py` from the installed teach skill:

```sh
python3 /path/to/teach/scripts/library.py new /project/.learning lesson queue-backpressure --title "Queues and backpressure"
python3 /path/to/teach/scripts/library.py new /project/.learning quiz queue-practice --title "Queue practice"
python3 /path/to/teach/scripts/library.py new /project/.learning reference queues --title "Queue reference"
python3 /path/to/teach/scripts/library.py index /project/.learning
```

`new` copies missing shared assets and creates a shell; existing pages and assets are preserved. `init ROOT` creates an empty library. `index ROOT` regenerates navigation from actual HTML files. Generated index content is replaceable; keep authored material in lessons/reference pages.

## Choose the form

The shell provides typography, navigation and a content region. Design that region around the lesson: short prose, a worked example, diagram, comparison, simulator or custom quiz widget. Sections, cards and text boxes are optional components, not a required recipe.

- Inspect `.learning/assets/` before creating new components.
- Adapt the shared CSS and HTML where useful; preserve other pages when changing shared assets.
- Use semantic HTML, readable labels and useful visual hierarchy.
- Prefer local resources and lightweight browser controls over frameworks or external dependencies.
- Keep explanations readable even when an optional interaction is unavailable.

A worthwhile chat explanation can be saved as a compact HTML lesson using the same shell. This keeps one browsable version without a Markdown-rendering pipeline. Tiny clarifications need not be saved; consolidate related material only when it improves the explanation.

## Optional quiz components

`assets/templates/choice-question.html` and `open-question.html` can be inserted into the quiz form and customised. Choice questions need unique radio names, exactly one `data-correct="true"` option, feedback and an explanation. Enable the choice scaffold after authoring it. Written questions need unique textarea IDs and a revealable worked answer.

The shared script offers feedback, hints and optional Markdown copy/download for these components. Custom widgets may provide their own small feedback loop. No server, persistent answer storage or learning-state synchronisation is required.

## Connect and deliver

- Add meaningful sources, related lesson links and real section anchors where useful.
- Include a recommended primary resource and an invitation to ask follow-up questions.
- Quickly check content, answer keys and local links. Routine artifacts need no exhaustive browser test procedure.
- Rebuild the index and link useful lessons from learning state or their supporting record.
- Return an absolute clickable file link; open it with an available host tool or suitable CLI when possible.

The user can continue the conversation without completing the artifact. Tests for changes to shared helper code are separate from routine lesson creation.
