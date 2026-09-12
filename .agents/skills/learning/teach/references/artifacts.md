# Learning artifacts

Use the bundled shell and components to make enjoyable, directly browsable learning material.

## Start with the lean base

Resolve [library helper](../scripts/library.py) from the installed teach skill:

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

## Glossary

Create the vocabulary page with the [library helper](../scripts/library.py):

```sh
python3 /path/to/teach/scripts/library.py new /project/.learning glossary glossary --title "My glossary"
```

The [glossary shell](../assets/templates/glossary.html) lives at `references/glossary.html`, appears in the library index and uses the shared theme and Copy/Save Markdown controls. Fill its term navigation and stable term sections with actual vocabulary. Update that page in place and link directly to term anchors from lessons or learning state.

## Optional quiz components

`assets/templates/choice-question.html` and `open-question.html` can be inserted into the quiz form and customised. Choice questions need unique radio names, exactly one `data-correct="true"` option, feedback and an explanation. Enable the choice scaffold after authoring it. Written questions need unique textarea IDs and a revealable worked answer.

The shared script offers feedback, hints and optional Markdown copy/download for these components. Custom widgets may provide their own small feedback loop. No server, persistent answer storage or learning-state synchronisation is required.

## Theme and Markdown export

Every page loads the shared controls for system/light/dark themes and Copy/Save Markdown. Theme storage is best-effort for local files; internal HTML links carry the choice. The default follows the system preference.

Export converts the main content using locally bundled Turndown and its GFM plugin. It preserves headings, lists, code, tables, sources and current responses, omits controls and unrevealed exercise feedback, and resolves relative links against the original page. Exported local links refer to that machine's files; moving the Markdown alone does not copy those assets.

For a custom visual or simulator, add `data-export-text="A useful textual explanation"` to its container, or an accessible label for a simple SVG/canvas. Use `data-export-ignore` for purely decorative content. A textual snapshot cannot preserve an interactive simulation. Keep core content in semantic HTML so layout changes do not affect conversion.

The [browser controls](../assets/index.js) perform conversion; the Python helper only generates pages. Vendor versions and licenses are recorded in [vendor notes](../assets/vendor/README.md). Customised existing assets are preserved by the helper; review and deliberately copy updated shared files when upgrading an existing library.

## Connect and deliver

- Add meaningful sources, related lesson links and real section anchors where useful.
- Include a recommended primary resource and an invitation to ask follow-up questions.
- Quickly check content, answer keys and local links. Routine artifacts need no exhaustive browser test procedure.
- Rebuild the index and link useful lessons from learning state or their supporting record.
- Return an absolute clickable file link; open it with an available host tool or suitable CLI when possible.

The user can continue the conversation without completing the artifact. Tests for changes to shared helper code are separate from routine lesson creation.
