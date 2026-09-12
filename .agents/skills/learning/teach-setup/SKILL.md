---
name: teach-setup
description: Set up or revise a project's learning mission, preferences and optional integrations.
disable-model-invocation: true
---

Make a new or existing project learning-aware with a small local setup.

Read [writing guidance](../teach/references/writing.md) before drafting project Markdown or wrappers.

## Propose the setup

1. Read [project storage](../teach/references/learning-system.md) and inspect the project and any existing learning files.
2. Establish the starting point: topic-first, project-first, or both. Propose a concrete mission and a few observable capabilities. When no project exists yet, agree on a small real outcome or experiment.
3. Offer optional customisation of depth, pace, format, teacher personality, practice and retention using the [teaching-style template](../teach/references/TEACHING_STYLE.md). If skipped, do not create `TEACHING_STYLE.md`; explain that they can create their own later and the skills and references already supply the full baseline. Preserve an existing project style.
4. Ask whether `.learning/` should be tracked or ignored. Offer one learning-project integration that combines project purpose, development guidance and passive teaching in AGENTS.md. Ask which existing skills the user wants supplemented; inspect the supplied workflows and propose small new wrappers using [integration guidance](../teach/references/integrations.md).

Use focused [research](../teach/references/research.md) only when it helps establish the mission, domain or current opportunities. Avoid turning setup into a curriculum.

## Apply agreed choices

- Show the concrete mission, preferences and integration/wrapper changes before applying unresolved configuration choices. Honour choices already authorised.
- Create `.learning/MISSION.md` from its template. Create `TEACHING_STYLE.md` only when the user supplies custom preferences, keeping only useful overrides. Preserve existing manual content. Other files appear when they have useful content.
- When revising an earlier setup, reconcile the chosen AGENTS integration before retiring an obsolete manifest; preserve any unrelated settings.
- Create only selected new wrappers; leave original skills untouched. Setup works without wrappers or AGENTS integration.

Finish when the project has a usable mission and defaults. Report the created files and available teach commands, rather than treating an empty directory tree as progress.
