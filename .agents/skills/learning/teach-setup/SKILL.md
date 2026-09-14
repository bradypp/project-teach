---
name: teach-setup
description: Set up or revise a project's learning mission, preferences and optional integrations.
disable-model-invocation: true
---

Make a new or existing project learning-aware with a small local setup.

Read [writing guidance](../teach/references/writing.md) before drafting project Markdown or wrappers.

## Propose the setup

1. Read [project storage](../teach/references/learning-system.md) and inspect the project and any existing learning files.
2. Establish the starting point: topic-first, project-first, or both. Complete the setup path in [research guidance](../teach/references/research.md), share a concise source-linked orientation, then propose a concrete mission and observable capabilities. When no project exists yet, agree on a small real outcome or experiment.
3. Offer optional customisation through the [teaching-style template](../teach/references/PREFERENCES.md). Preserve an existing project style; when customisation is skipped, rely on the complete baseline and create no preferences file.
4. Ask whether `.learning/` should be tracked or git ignored. Use [integration guidance](../teach/references/integrations.md) to offer the learning-project AGENTS integration and user-selected workflow wrappers.

Use the research to inform scope and learning opportunities without turning setup into a compulsory curriculum.

## Apply agreed choices

- Show the concrete mission, preferences and integration/wrapper changes before applying unresolved configuration choices. Honour choices already authorised.
- Create `.learning/MISSION.md` from its template. Create `PREFERENCES.md` only when the user supplies custom preferences, keeping only useful overrides. Preserve existing manual content. Other files appear when they have useful content.
- When revising an earlier setup, reconcile the chosen AGENTS integration before retiring an obsolete manifest; preserve any unrelated settings.
- Create only selected new wrappers; leave original skills untouched. Setup works without wrappers or AGENTS integration.

Finish when the project has a usable mission and defaults. Report the created files and available teach commands, rather than treating an empty directory tree as progress.
