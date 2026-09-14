---
name: teach
description: Teach in project context when requested, reached by a learning-aware workflow, or enabled by project passive-teaching settings.
---

Help the user understand the project they are planning or building, including the prerequisites behind its decisions.

## 1. Inspect the work and learning context

- Read the current question, relevant project files and the whole active plan or spec. Identify conceptual dependencies across the work, not just the next task.
- For follow-ups on existing material, also read the complete supplied page and relevant linked material.
- Read [learning system](references/learning-system.md). Follow the project context section for storage, evidence and the no-setup path. Use the mission for direction and constraints.
- Consult `LEARNING_STATE.md`, relevant records, and learning artifacts. Distinguish demonstrated understanding, exposure and uncertainty.
- Apply explicit teaching-style overrides when present. Teaching works without a preferences file or completed setup.

## 2. Select prerequisites and depth

- Follow an explicit topic. Otherwise map prerequisites across the active plan/spec: teach upcoming concepts broadly and go deeply into what is needed next.
- Apply [teaching guidance](references/teaching.md) for depth, lesson design and practice. Supply missing prerequisites for the current decision, even when they form a substantial topic.
- Retain later prerequisites as deferred topics with a reason and revisit condition. Keep valuable unknown unknowns as opportunities, without creating a compulsory curriculum.
- Refresh known material at the actual weak point. If context provides no useful topic, ask what work to explore.

## 3. Research and ground the explanation

- For substantive teaching, follow [research guidance](references/research.md) through its readiness check. Proceed when the mechanism and relevant alternatives are grounded and important uncertainty is identified.

## 4. Teach and apply

- Read [writing guidance](references/writing.md) before drafting.
- Prefer a substantial HTML lesson over a long chat explanation. Follow [artifact guidance](references/artifacts.md) for page creation, maintenance, verification and delivery with the [library helper](scripts/library.py).
- For follow-ups on existing material, deepen or reuse the source page when its scope fits; create a linked lesson for a distinct durable explanation. Keep topic pages as current syntheses and references concise.
- In chat, present the original question, a brief orientation and the lesson link. Small clarifications can stay inline.
- Make the explanation project-grounded and complete enough for the current decision. The user can ask to drill down further or follow the reading links.
- Teach generously during exploration; supplement delivery workflows without displacing their purpose. Ask a contextual application question; the pending planning question can serve as practice.
- Let the user answer or continue without finishing the artifact.

## 5. Reconcile and return to the work

- Use the `teach-update` skill after teaching to reconcile artifacts, useful exposure, gaps and any actual user evidence. No changes are required when nothing meaningful changed; producing a lesson or working code does not demonstrate understanding.
- Finish with the relevant question, lesson link and a clear return to the original workflow.

## Passive teaching

During ordinary development, interrupt only when the [marked AGENTS block](references/integrations.md#passive-teaching) enables passive teaching and a significant transferable gap affects an imminent decision or failure. Routine syntax, unfamiliar APIs and boilerplate do not qualify. Otherwise continue quietly.
