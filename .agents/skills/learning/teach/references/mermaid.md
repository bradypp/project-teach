# Mermaid diagrams

Read when creating or changing a Mermaid visual. Use the bundled [diagram component](../assets/templates/diagram.html); put escaped Mermaid source inside `pre.mermaid` within `figure.diagram`, followed by a descriptive `figcaption`.

## Choose a form

Use a diagram to expose a relationship or sequence that prose alone obscures.

- Use `flowchart LR` for up to four or five horizontal stages. For six or more, use `TD`/`TB` or split the sequence into connected diagrams with at most five stages per row. Count the longest horizontal path, not just top-level groups. Mermaid does not wrap a chain onto another row.
- Give each diagram one explanatory job. Split a large architecture into an overview and focused flows; use matching names and captions to connect them. A tall unreadable diagram also needs splitting.
- Keep labels to a short phrase. At around 24 characters, use Markdown labels (`A["`Authorise the request`"]`) so the shared 180px wrapping width breaks them at word boundaries (the character count is an authoring cue, not an exact pixel measure). Put qualifications, long identifiers and implementation details in nearby prose or a table.
- Shorten edge labels as carefully as node labels. Branches, cross-links and subgraphs can make a vertical diagram wide too. Preserve relationships when changing layout; never reorder a process simply to fit it.
- Diagrams shrink to fit the reading column without horizontal scrolling. Choose short labels and a suitable direction before relying on scaling; on narrow screens, split or simplify a diagram if its text becomes too small.

```mermaid
flowchart LR
  Request["`Request`"] --> Retrieve["`Retrieve`"] --> Pack["`Pack context`"]
  Pack --> Answer["`Answer`"] --> Check["`Check support`"]
```

```mermaid
sequenceDiagram
  Client->>Worker: Submit job
  Worker-->>Client: Accepted
```

```mermaid
stateDiagram-v2
  [*] --> Pending
  Pending --> Running
  Running --> Ready
```

```mermaid
classDiagram
  class Job {
    +string id
    +run()
  }
```

```mermaid
pie title Example work mix
  "Exports" : 60
  "Previews" : 40
```

```mermaid
xychart-beta
  x-axis [A, B, C]
  y-axis "Jobs" 0 --> 10
  bar [3, 8, 5]
```

```mermaid
gitGraph
  commit
  branch experiment
  checkout experiment
  commit
  checkout main
  merge experiment
```

These chart values are illustrative. Use supported syntax for the bundled version; consult [official Mermaid documentation](https://mermaid.js.org/intro/) for additional forms or syntax you have not verified.

## Shared theming and export

- [components.js](../assets/components.js) configures Mermaid from the active CSS tokens at render time and re-renders when the theme changes. Agents author the diagram, not a new palette.
- Keep colour settings and theme directives out of individual diagram definitions. Improve shared configuration when a diagram family needs additional tokens.
- The renderer uses natural size when it fits and scales down to the available width otherwise. There is no horizontal scroll region or minimum-scale cutoff. Markdown flowchart labels wrap using shared configuration; ordinary plain labels should be converted to Markdown form when long.
- Captions explain the visual's meaning. Markdown export retains the Mermaid source and caption; it does not preserve an interactive renderer.
- Use ASCII for a simpler text relationship, or themed custom SVG/canvas for visuals Mermaid cannot express well.

## Check and repair

- Check rendering and readability in both themes after introducing a new diagram form or changing shared rendering code. Routine diagrams need a quick visual/content check.
- If parsing fails, inspect the visible source fallback. Check diagram type, arrows, quoted labels and HTML escaping first; reduce to a small valid example before restoring complexity.
- Inspect a new diagram at its actual reading width and a narrow viewport. Labels must be readable without browser zoom, remain inside their nodes, and have no overlaps or clipped arrowheads. Confirm the complete diagram fits the column without horizontal scrolling.
- If a visual is too wide, shorten or wrap labels, change direction, or split the diagram. Check the result rather than assuming `TD` or a larger font fixes the layout. Keep the caption useful as a textual explanation of the complete diagram.
- If colours clash, inspect shared theme variables rather than applying white backgrounds or inline colour patches to the page.
