# Learning artifacts

Use the bundled shell to create and deliver directly browsable learning material. Read the [artifact visual language](visual-language.md) before composing page content or changing shared presentation.

## Choose a page

| Page | Use it for |
| --- | --- |
| Lesson | A substantial explanation with mechanisms, examples and application |
| Topic | One current synthesis across accumulated lessons and application |
| Research | A reusable, question-driven investigation with evidence, implications and limitations |
| Quiz | Optional retrieval and transfer practice with feedback |
| Reference | Concise lookup answers, checklists, algorithms or comparisons |
| Glossary | Vocabulary the learner can use meaningfully, with concise definitions and lesson links |
| Resource | Annotated tutorials, courses, videos, articles, documentation, books and practical tools worth studying or using |

Glossary and resource pages belong to the Reference section. Use their dedicated templates and follow [collection scope and maintenance](learning-system.md#reference-collections). These distinctions guide authoring; keep instructional hints out of finished page content.

## Start with the lean base

Resolve [library helper](../scripts/library.py) from the installed teach skill:

```sh
python3 /path/to/teach/scripts/library.py new /project/.learning lesson queue-backpressure --title "Queues and backpressure"
python3 /path/to/teach/scripts/library.py new /project/.learning quiz queue-practice --title "Queue practice"
python3 /path/to/teach/scripts/library.py new /project/.learning reference queues --title "Queue reference"
python3 /path/to/teach/scripts/library.py new /project/.learning research retry-identity --title "Which retry identity should we preserve?"
python3 /path/to/teach/scripts/library.py index /project/.learning
python3 /path/to/teach/scripts/library.py theme /project/.learning ocean
```

- `new` creates a shell, copies missing shared assets and refreshes the index, preserving existing pages and assets. When upgrading a library, review and deliberately copy updated shared files.
- `init ROOT` creates an empty library. `index ROOT` regenerates navigation from actual HTML files. Keep authored material in content pages; generated index content is replaceable.
- `theme ROOT {parchment,ocean,forest,plum,graphite}` selects the project default, compiles the five built-ins into one managed bundle, preserves an unmarked custom theme and adds the stylesheet to legacy pages. New libraries default to Parchment. The legacy names `warm` and `blue` remain aliases for Parchment and Ocean. Setup owns the default; it is not a teaching-style preference.

## Compose the page

The helper inserts the shared page opening after the title and creation date. Follow the [artifact visual language](visual-language.md) for its summary, optional contents, callouts, tables, code, diagrams, practice components and theme tokens. Use stable IDs on useful sections and keep quiz introductions free of answer-bearing links.

A worthwhile chat explanation can be saved as a compact HTML lesson using the same shell. This keeps one browsable version without a Markdown-rendering pipeline. Tiny clarifications need not be saved; consolidate related material only when it improves the explanation.

### Topic pages

Create a current synthesis with the [topic shell](../assets/templates/topic.html):

```sh
python3 /path/to/teach/scripts/library.py new /project/.learning topic queues --title "Understanding queues"
```

It lives under `topics/`. Follow [topic synthesis guidance](learning-system.md#topic-synthesis) for content and maintenance; update the existing page rather than generating competing summaries.

### Glossary

Create the vocabulary page with the [library helper](../scripts/library.py):

```sh
python3 /path/to/teach/scripts/library.py new /project/.learning glossary glossary --title "My glossary"
```

The [glossary shell](../assets/templates/glossary.html) creates `references/glossary.html` by default with the command above. Fill its term navigation and stable term sections with actual vocabulary. Update entries in place and link directly to term anchors from lessons or learning state. For a useful category split, use a descriptive slug such as `glossary-networking`.

### Resource pages

Create an annotated collection with the [resource shell](../assets/templates/resource.html):

```sh
python3 /path/to/teach/scripts/library.py new /project/.learning resource resources --title "Useful resources"
```

This creates `references/resources.html`. Use a descriptive slug for a useful category split. Follow [collection guidance](learning-system.md#reference-collections) for selection, annotations and maintenance.

## Metadata and navigation

- The helper records creation time in UTC and displays it beneath the title. Keep it stable when editing; there is no updated-time field.
- Add subject tags with `--tags "queues,reliability"`; maintain the comma-separated `tags` meta value as content changes. Reuse a small set of existing tags. The helper adds mandatory `glossary` and `resource` tags for those page kinds; preserve them during edits and include them on manually authored pages.
- Keep descriptive filenames stable.
- The home page uses collection labels Lessons, Topics, Quizzes, Reference and Research for sections and type filters. Research appears last when retained investigations exist. Individual page labels stay singular. It groups actual HTML files by folder; all glossary and resource pages appear under Reference and can be filtered by their mandatory tags.

## Shared controls and export

- All pages start with the setup-selected project palette. The palette dropdown can store a browser-local override or return to the project default; internal HTML links carry an active override. The adjacent appearance control defaults to the system preference and switches light/dark independently. Local-file storage is best-effort.
- Content pages include a notebook link in the footer toolbar and Copy/Save Markdown. The home page omits this toolbar.

### Markdown export

Copy/Save Markdown preserves headings, lists, code, tables, sources and current responses, omits action controls and unrevealed exercise feedback, and resolves relative links against the original page. The same exporter serves every content page and quiz Copy for chat, including embedded practice and custom components. Exported local links refer to that machine's files; moving the Markdown alone does not copy those assets.

For custom visuals and simulators:

- Keep prompts, context, labels and live results in semantic HTML. Native inputs/textareas export their current values; choices retain selection marks and selects export selected option labels. Hidden inputs and action controls are omitted.
- For state held only in JavaScript, synchronise `data-export-summary="Current settings and latest result"` on the widget container whenever state changes. Export adds that text while retaining the container's semantic content and responses. Put prediction/reflection in labelled inputs; keep any answer-bearing summary inside the question's feedback area until revealed.
- Use `data-export-text="A useful textual explanation"` on a visual-only container to replace its contents, or use an accessible label for a simple SVG/canvas. Keep response fields outside that replacement boundary. The exporter preserves semantic content if an older replacement container encloses responses, but a narrowly scoped fallback is clearer.
- Use `data-export-ignore` for decoration or graphics whose meaning is already fully represented by a textual result. It removes the whole marked subtree, so keep useful answers and results outside it.
- A result must identify the settings that produced it when controls can change before the next run. Include the current result, learner prediction/reflection and hint/feedback disclosure; include action history only when the sequence is educationally relevant.

A textual snapshot cannot preserve an interactive simulation. Check new/custom widgets by filling answers, changing settings and copying before and after feedback. Confirm context, live values, results and disclosure are retained; unrevealed solutions should be absent. Layout changes alone should not affect conversion.

- The [browser controls](../assets/index.js) convert the main content using bundled Turndown and its GFM plugin; the Python helper generates pages.
- Bundled dependency versions and licenses are documented in [vendor notes](../assets/vendor/README.md).

### Continue in chat

The user pastes the copied prompt into an existing conversation or a new local chat:

- **Copy follow-up** on lessons, topics, references, resource and research pages asks to use the `teach` skill with the page kind, title, optional tags and absolute local file path. The receiving chat needs access to that file.
- **Copy for chat** on quizzes includes a discussion prompt, the absolute local HTML file path and the current responses.

Both actions offer manual copying if clipboard access fails. They do not send messages or update learning records. Glossaries retain only the Markdown actions.

## Maintain and verify

- Follow [retention and connection guidance](learning-system.md#retain-and-connect) for which learning material warrants a link and where quiz or glossary links belong. Inspect related lessons, topics, quizzes and references when adding material, and repair affected links over time.

After changing an authored HTML page, local link or ID:

1. Quickly check the content and any answer keys.
2. Run the [link checker](../scripts/check_links.py) with `python3 /path/to/teach/scripts/check_links.py /project/.learning` and repair missing files, broken HTML anchors and duplicate IDs. The checker does not verify external URLs or decide which reciprocal links are useful.
3. Rebuild the index after manually adding, moving, renaming or removing pages, or changing page titles or tags. The `new` command already refreshes it; content-only edits do not require a rebuild.

Routine artifacts need no exhaustive browser testing. After changing shared helpers, components or presentation, run the relevant helper or browser tests and the additional visual checks in [visual-language.md](visual-language.md#extend-deliberately).

## Deliver

Return an absolute clickable file link with a short summary and relevant pending question. Open the page with an available host/browser tool or launch an external browser through the CLI when possible. Let the artifact carry the detailed explanation; the user can continue without completing it.
