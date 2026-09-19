---
name: teach-setup
description: Set up or revise a project's learning mission, notebook theme, optional preferences and integrations.
disable-model-invocation: true
---

Make a new or existing project learning-aware with a small local setup. Read [writing guidance](../teach/references/writing.md) before drafting project Markdown or wrappers.

## Propose the setup

1. Read [project storage](../teach/references/learning-system.md) and inspect the user's request, relevant project files and any existing notebook. Use project code, plans or documentation as mission context when they contain a substantive goal. When the project has only scaffolding or boilerplate, use supplied user context or offer a small generic mission that the user can refine.
2. Propose a short mission and observable capabilities from that context. When the project is not yet built, use the user's intended outcome or a small real experiment.
3. Offer three preference choices: no file, a starter `.notebook/PREFERENCES.md` to fill in later, or preferences customised now. Use the [preferences template](../teach/references/templates/PREFERENCES.md) for either file. Its `default` entries inherit the complete baseline; preserve an existing file and never turn the template into required teaching instructions.
4. Offer a notebook palette: Parchment (the default), Ocean, Forest, Plum or Graphite. Infer an existing project default from the `teach:theme` marker in `.notebook/assets/theme.css`. Keep this choice separate from teaching preferences. The browser dropdown can override the palette; the adjacent control switches light/dark appearance.
5. Ask whether `.notebook/` should be tracked or git ignored. Offer the independent [integration choices](../teach/references/integrations.md): no integration, a persistent AGENTS.md project-learning section, selected workflow wrappers, or both. For wrappers, offer Inline (default) or Background teaching. The AGENTS.md section carries context only.

## Apply the choices

- Show the concrete mission and unresolved configuration choices before applying them. Honour choices already authorised.
- Create `.notebook/MISSION.md` from its template. Create `PREFERENCES.md` only when the user chooses the starter or customised file. Leave `default` entries intact in a starter and keep only useful overrides in a customised file. Preserve existing manual content. Other notebook files appear when they have useful content.
- Apply the selected project default with `library.py theme ROOT {parchment,ocean,forest,plum,graphite}`. The helper preserves an unmarked custom `theme.css`; show a targeted replacement and ask before changing one.
- Add or revise only the selected AGENTS.md section and wrappers. Keep the AGENTS.md section to the mission and two project-learning principles. Preserve unrelated AGENTS.md instructions, original workflow skills and manual wrapper content. Use readable headings to identify generated sections; show a targeted merge when an existing section is ambiguous.
- Keep one Inline or Background choice across the selected wrappers. Background requires available subagents and later result delivery.

Finish when the project has a usable mission and selected defaults. Report created files, the notebook palette, available teach commands and the selected integration choices.
