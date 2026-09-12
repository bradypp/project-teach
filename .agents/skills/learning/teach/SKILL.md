---
name: teach
description: Teach in project context when requested, reached by a learning-aware workflow, or enabled by project passive-teaching settings.
---

Help the user understand the project they are planning or building, including the prerequisites behind its decisions.

## 1. Inspect the work and learning context

- Read the current question, relevant project files and the whole active plan or spec. Identify conceptual dependencies across the work, not just the next task.
- Read [project context](references/learning-system.md#project-context) for storage and evidence rules. Use the mission as overall direction, scope and constraints; use the active work to identify teaching opportunities.
- Consult `LEARNING_STATE.md` and relevant records, lessons and topic pages. Distinguish demonstrated understanding, exposure and uncertainty. Current reasoning or confusion can outweigh an older summary.
- Apply explicit teaching-style overrides when present. Without setup, briefly note that it has not run and teach immediately; setup is not a prerequisite.

## 2. Select prerequisites and depth

- Follow an explicit topic. Otherwise identify prerequisites across the active plan/spec: teach upcoming concepts broadly and go deeply into what is needed next.
- Read [teaching guidance](references/teaching.md) for depth, explanation methods, practice and presentation. Supply missing prerequisites for the current planning stage, even when they form a substantial topic.
- Retain later prerequisites as deferred topics with a reason and revisit condition. Keep valuable unknown unknowns as opportunities, without creating a compulsory curriculum.
- Refresh known material at the actual weak point. If context provides no useful topic, ask what work to explore.

## 3. Research and ground the explanation

- For substantive teaching, complete the workflow and readiness check in [research guidance](references/research.md). It defines source discovery, freshness, verification, comparison and discovery workers; proceed when the explanation and relevant alternatives are grounded and important uncertainty is identified.
- Verify core topics against trustworthy sources; check current primary documentation for fast-moving or version-sensitive behaviour. Stable explanations can reuse previously verified sources.
- Select useful further reading from sources actually consulted, explaining what each adds. State access or verification limits rather than inventing support.
- For video material, the optional [transcript helper](scripts/transcript.py) retrieves captions; research guidance explains verification and limitations.

## 4. Teach and apply

- Read [writing guidance](references/writing.md) before drafting. Use readable headings, bullets for parallel points and steps, and short paragraphs for connected reasoning.
- Prefer a substantial HTML lesson over a long chat explanation. Read [artifact guidance](references/artifacts.md) for creating, connecting, exporting and delivering pages with the [library helper](scripts/library.py).
- In chat, present the original question, a brief orientation and the lesson link. Small clarifications can stay inline. Reuse or deepen an existing lesson where appropriate.
- Cover the mechanism, necessary prerequisites, worked examples, alternatives, failure cases and application to the current work. The user can ask to drill down further or follow the reading links.
- Teach generously during exploration; supplement delivery workflows without displacing their purpose. Ask a contextual application question; the pending planning question can serve as practice.
- Let the user answer or continue without finishing the artifact.

## 5. Reconcile and return to the work

- Use the `teach-update` skill after teaching to reconcile artifacts, useful exposure, gaps and any actual user evidence. No changes are required when nothing meaningful changed; producing a lesson or working code does not demonstrate understanding.
- Finish with the relevant question, lesson link and a clear return to the original workflow.

## Passive teaching

During ordinary development, interrupt only when the [marked AGENTS block](references/integrations.md#passive-teaching) enables passive teaching and a significant transferable gap affects an imminent decision or failure. Routine syntax, unfamiliar APIs and boilerplate do not qualify. Otherwise continue quietly.
