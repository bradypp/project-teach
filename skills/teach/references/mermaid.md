# Mermaid diagrams

Read when creating or changing a Mermaid visual. Use the bundled [diagram component](../assets/templates/diagram.html); put escaped Mermaid source inside `pre.mermaid` within `figure.diagram`, followed by a descriptive `figcaption`.

## Choose a form

Use a diagram to expose a relationship or sequence that prose alone obscures.

- Use `flowchart LR` for compact flows of up to five nodes. Prefer `flowchart TD` for more than five nodes so the path reads without horizontal scrolling. Count nodes across branches and subgraphs, then check the actual rendered width; the threshold is a preference, not a hard limit.
- If the vertical flow is still too wide, shorten or wrap labels first. Local horizontal scrolling is a fallback when one continuous diagram explains the relationship best. Split into connected figures only when distinct stages have separate explanatory jobs; use matching names and captions to preserve the connection.
- Keep labels to a short phrase. Use Markdown labels (`A["`Authorise the request`"]`) so the shared 180px width wraps long phrases at word boundaries. For an intentional break, place an actual line break inside the quoted Markdown label. A literal backslash-n is text and can appear inside Mermaid's generated paragraph instead of breaking it. Never put a backtick inside a Markdown label: the label is fenced by backticks, so a stray one closes the fence early and the diagram fails with a lexical error. Put qualifications, long identifiers and implementation details in nearby prose or a table.
- Shorten edge labels as carefully as node labels. Branches, cross-links and subgraphs can make a vertical diagram wide too. Preserve relationships when changing layout; never reorder a process simply to fit it.

```mermaid
flowchart LR
  Request["`Request`"] --> Retrieve["`Retrieve`"] --> Pack["`Pack context`"]
  Pack --> Answer["`Answer`"]
```

For a deliberate two-line node label, use a physical newline in the Mermaid source:

```mermaid
flowchart TD
  Input["`OTLP
  encoding + transport`"] --> Collector["`Collector`"]
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

- [components.js](../assets/components.js) configures Mermaid from the active CSS tokens at render time and re-renders when the palette or light/dark appearance changes. Agents author the diagram, not a new palette.
- Keep colour settings and theme directives out of individual diagram definitions. Improve shared configuration when a diagram family needs additional tokens.
- The renderer uses natural size when it fits, scales to 87.5% when necessary, then offers local horizontal scrolling rather than making text smaller. Markdown flowchart labels wrap using shared configuration; ordinary plain labels should be converted to Markdown form when long. Shared subgraph-title margins keep cluster labels clear of borders and nodes.
- Captions explain the visual's meaning. Markdown export retains the Mermaid source and caption; it does not preserve an interactive renderer.
- Use ASCII for a simpler text relationship, or themed custom SVG/canvas for visuals Mermaid cannot express well.

## Check and repair

- Check rendering and readability in both appearances and affected palettes after introducing a new diagram form or changing shared rendering code. Routine diagrams need a quick visual/content check.
- If parsing fails, inspect the visible source fallback. Check diagram type, arrows, quoted labels and HTML escaping first; reduce to a small valid example before restoring complexity.
- Inspect a new diagram at its actual reading width and a narrow viewport. Labels must be readable without browser zoom, remain inside their nodes, and have no overlaps or clipped arrowheads. For a scrolling figure, check that its start is reachable, its hint appears and keyboard focus allows reading the rest without widening the page.
- If a visual is too wide to read comfortably, shorten or wrap labels and recheck the chosen layout. Keep the caption useful as a textual explanation of the complete diagram.
- If colours clash, inspect shared theme variables rather than applying white backgrounds or inline colour patches to the page.
