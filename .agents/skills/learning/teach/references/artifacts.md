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

## Dates, tags and home navigation

- The helper automatically records creation time in UTC and displays it beneath the page title. Keep this timestamp stable when editing; there is no updated-time field.
- Add subject tags with `--tags "queues,reliability"`; maintain the comma-separated `tags` meta value when content changes. Reuse a small set of existing tags.
- The home page lists Lessons, Topics, Quizzes, References, then Glossary, omitting empty sections. Type filters sit above subject filters; select one value per row, including All. A page must match both selected values. Tags and newest/oldest/alphabetical sorting apply to the first four; the glossary stays accessible below.
- Keep descriptive filenames stable. Rebuild the index after changing titles, tags or pages.

## Page opening

The helper inserts the shared [page-intro component](../assets/templates/page-intro.html) after the title and creation date in every content shell:

- Tags are populated from page metadata and hidden when absent.
- Give a short summary connecting the idea to the project or current decision.
- For longer pages, add optional contents linking to real section IDs. Keep labels descriptive and the layout flexible.
- Keep the short summary; omit contents when unnecessary. Use stable IDs on useful sections even without contents. The glossary can use term navigation instead. Quiz introductions must preserve the challenge; answer-bearing links belong with feedback.

Shared CSS owns language-label styling, pointer cursors, home dividers and quiz-action spacing. Apply presentation fixes there and in reusable components, then synchronise example assets; avoid example-only style patches.

## Code and visual components

- Use the [code block component](../assets/templates/code-block.html) for explicitly labelled languages. Locally bundled Highlight.js supplies syntax highlighting; shared controls add a language label and Copy code button. Use `language-text` for plain text or ASCII.
- Read [Mermaid authoring guidance](mermaid.md) for syntax examples, dynamic theming and troubleshooting. Prefer the [Mermaid component](../assets/templates/diagram.html) for supported diagrams: flowcharts, sequences, classes, states, git graphs, pie/bar charts and related structures. Keep the source in `pre.mermaid` inside `figure.diagram`, with a useful caption.
- The [component script](../assets/components.js) applies the shared theme tokens and re-renders diagrams on theme changes. Keep diagram colours in the shared integration rather than embedding light-only styles or Mermaid theme directives.
- Use ASCII when a small text diagram communicates better. Use custom SVG/canvas for visuals Mermaid cannot express well; use CSS theme tokens for fills, lines, backgrounds and labels.
- Reuse the existing quiz controls, native revealable explanations and semantic comparison tables. Layout remains flexible; components do not require surrounding cards.
- Follow explicit visualisation frequency/style preferences in `PREFERENCES.md`. Select visuals for explanatory value rather than adding one to every section.
- Markdown export retains Mermaid source and captions. Give other visuals meaningful textual export descriptions; verify code exports preserve their language and content.

## Choose the form

The shell provides typography, navigation and a content region. Design that region around the lesson: short prose, a worked example, diagram, comparison, simulator or custom quiz widget. Sections, cards and text boxes are optional components, not a required recipe.

- Inspect `.learning/assets/` before creating new components.
- Adapt the shared CSS and HTML where useful; preserve other pages when changing shared assets.
- Use semantic HTML, readable labels and useful visual hierarchy.
- Prefer local resources and lightweight browser controls over frameworks or external dependencies.
- Keep explanations readable even when an optional interaction is unavailable.

A worthwhile chat explanation can be saved as a compact HTML lesson using the same shell. This keeps one browsable version without a Markdown-rendering pipeline. Tiny clarifications need not be saved; consolidate related material only when it improves the explanation.

## Topic pages

Create a current synthesis with the [topic shell](../assets/templates/topic.html):

```sh
python3 /path/to/teach/scripts/library.py new /project/.learning topic queues --title "Understanding queues"
```

It lives under `topics/` with shared theme/export controls and a notebook link. The index shows a Topics section only while topic pages exist. Follow [topic synthesis guidance](learning-system.md#topic-synthesis) for content and maintenance; update the existing page rather than generating competing summaries.

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

Every page loads shared theme controls. Content pages also show footer navigation and Copy/Save Markdown; the home page omits that toolbar. Theme storage is best-effort for local files; internal HTML links carry the choice. The default follows the system preference.

Export converts the main content using locally bundled Turndown and its GFM plugin. It preserves headings, lists, code, tables, sources and current responses, omits controls and unrevealed exercise feedback, and resolves relative links against the original page. Exported local links refer to that machine's files; moving the Markdown alone does not copy those assets.

For a custom visual or simulator, add `data-export-text="A useful textual explanation"` to its container, or an accessible label for a simple SVG/canvas. Use `data-export-ignore` for purely decorative content. A textual snapshot cannot preserve an interactive simulation. Keep core content in semantic HTML so layout changes do not affect conversion.

The [browser controls](../assets/index.js) perform conversion; the Python helper only generates pages. Vendor versions and licenses are recorded in [vendor notes](../assets/vendor/README.md). Customised existing assets are preserved by the helper; review and deliberately copy updated shared files when upgrading an existing library.

## Connect and deliver

- Inspect related lessons, topics, quizzes and references when adding material. Add useful links in both directions where the relationship warrants it, and repair affected links over time.
- Link the first meaningful occurrence of a known glossary term to its stable anchor. Keep answer-revealing quiz links inside feedback.
- Add meaningful sources and real section anchors where useful.
- Include a recommended primary resource and an invitation to ask follow-up questions.
- Quickly check content and answer keys. Run the [link checker](../scripts/check_links.py) with `python3 /path/to/teach/scripts/check_links.py /project/.learning` after updating related links. Repair reported missing files, broken HTML anchors and duplicate IDs. This does not verify external URLs or judge which reciprocal links are useful. Routine artifacts need no exhaustive browser test procedure.
- Rebuild the index and link useful lessons from learning state or their supporting record.
- Return an absolute clickable file link that can be opened from the chat; open it automatically with an available host/browser tool if possible; try launching into an extrenal browser via cli if possible.

When delivering an HTML artifact, give a short summary, link and relevant pending question in chat; let the artifact carry the detailed explanation. The user can continue the conversation without completing the artifact. Tests for changes to shared helper code are separate from routine lesson creation.
