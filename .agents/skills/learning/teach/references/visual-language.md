# Artifact visual language

Read when authoring learning HTML or changing shared assets. This file owns page composition, component usage and theme-token guidance. [Artifact guidance](artifacts.md) owns creation, export and delivery; [Mermaid guidance](mermaid.md) owns diagram syntax and troubleshooting. `assets/index.css` remains the implementation source for literal token values.

## Compose a personal notebook

- Keep the reading path primary: one clear page title, a short project-grounded opening and sections that follow the idea's mechanism.
- Choose the form that exposes the idea—a worked example, comparison, diagram, practice interaction or compact reference. A page need not use every component.
- Use semantic HTML first, then apply the shared class. Let headings, paragraphs, lists and whitespace carry most of the hierarchy.
- Reserve raised surfaces for meaningful boundaries. Repeated cards make every passage look equally important.

## Author-facing primitives

| Primitive | Use |
| --- | --- |
| `page-intro` | Opening summary, metadata tags and optional section links. The helper inserts the [page-intro template](../assets/templates/page-intro.html). Write the summary as an ordinary paragraph inside the shared surface; omit contents on short pages. |
| `callout` | One high-value definition, warning, decision rule or application prompt that deserves a pause in the reading flow. |
| `blockquote` | A short learner statement or source excerpt whose voice matters. Attribute sources and respect quotation limits. |
| `table` | A real comparison or repeated field mapping. Use row and column headers that make the relationship explicit. |
| `details` | Optional hints, worked reasoning or secondary detail that benefits from progressive disclosure. |
| `muted` | Supporting metadata or guidance that should remain readable without competing with the main explanation. |
| `page-list` | A compact list of navigational links, such as glossary terms or a reference index. |
| `actions` | A wrapping row of related buttons. Use the `secondary` button class for the less prominent action. |
| `footer` | End with one to three useful continuation routes: the previous or next lesson, the current topic, the glossary or a working reference. Omit generic and link-dump footers. |

The callout is already a shared CSS component. Keep its simple markup inline:

```html
<p class="callout">
  A core idea, useful rule, and/or relevant consequences.
</p>
```

Choose the element by meaning. A central takeaway can be a paragraph; genuinely supplementary material can use `<aside class="callout">`. Prefer one focused thought over a miniature section inside the surface.

## Enhanced components

- **Code:** Start from the [code-block template](../assets/templates/code-block.html). Use `language-*` on the `code` element; `language-text` keeps plain text or ASCII unhighlighted. The component script adds the label and Copy code control.
- **Diagrams:** Start from the [diagram template](../assets/templates/diagram.html) and follow [Mermaid guidance](mermaid.md). Keep themes and palette directives out of individual diagrams.
- **Choice practice:** Start from [choice-question.html](../assets/templates/choice-question.html). Use a unique radio name and IDs, one `data-correct="true"` option, feedback and a hidden explanation; enable the fieldset after authoring.
- **Written practice:** Start from [open-question.html](../assets/templates/open-question.html). Use a unique textarea ID and revealable worked reasoning.
- **Custom interactions:** Keep the core explanation usable without JavaScript. Put reusable behaviour in `assets/components.js`; use semantic HTML and shared tokens for its static state.

## Theme tokens

Use the semantic custom properties already defined in `assets/index.css`:

- Text: `--ink`, `--ink-soft`, `--muted`, `--muted-strong`
- Canvas and surfaces: `--paper`, `--paper-deep`, `--surface`, `--surface-raised`, `--surface-soft`, `--surface-accent`
- Meaning and interaction: `--accent`, `--accent-hover`, `--secondary`, `--focus`, `--success`, `--danger`
- Structure: `--line`, `--line-strong`, the `--shadow-*` tokens and the `--radius-*` scale
- Specialised visuals: the `--code-*` and `--chart-*` groups

Shared tokens supply both light and dark values. Add a semantic token when a recurring meaning is missing; keep one-off layout rules near their custom component and avoid inline colour values.

## Extend deliberately

- Keep obvious one-element patterns such as callouts inline and document their usage here.
- Add a template when repeated structure or required attributes are easy to get wrong, as with diagrams and quiz questions.
- Add shared CSS or JavaScript when the same visual meaning or behaviour recurs across pages. Preserve existing pages and synchronise maintained examples after shared asset changes.
- Give custom SVG, canvas or simulators accessible text and the export fallback described in [artifact guidance](artifacts.md#markdown-export).

After introducing a component or changing shared presentation, check light and dark themes, a narrow viewport, keyboard-visible states and Markdown export. Routine use of an established primitive follows the quick checks in [artifact guidance](artifacts.md#maintain-and-verify).
