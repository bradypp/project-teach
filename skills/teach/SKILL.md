---
name: teach
description: Teach in project context when requested, reached by a learning-aware workflow, or enabled by project passive-teaching settings.
---

Help the user understand the project they are planning or building, including the prerequisites behind its decisions.

## 1. Inspect the work and learning context

- Read the current question, relevant project files and the whole active plan or spec. Identify conceptual dependencies across the work, not just the next task.
- Read [learning system](references/learning-system.md). Follow the project context section for storage, evidence and the no-setup path. Use the mission for direction and constraints.
- Consult `LEARNING_STATE.md`, relevant records, and learning artifacts. Distinguish demonstrated understanding, exposure and uncertainty.
- Find related lessons, topics, references and retained research by concept, aliases, titles, tags and links. For a follow-up, read the complete supplied page and relevant linked material.
- Apply explicit teaching-style overrides when present. Teaching works without a preferences file or completed setup.

## 2. Reuse with judgement

Before teaching or authoring, use this heuristic and combine responses where useful:

- **Reuse directly:** Link current material when it fits both the concept and the present problem.
- **Adapt or extend:** Build on a sound foundation when the current problem needs different depth, framing, examples, trade-offs or application. Link earlier artifacts for context and lineage, and follow [source guidance](references/research.md#sources-and-further-reading) when reusing their claims.
- **Author anew:** Create a new explanation when existing material offers no coherent foundation or adapting it would distort its original purpose.
- Honour explicit requests to revisit or deepen material. Without one, continue the original work when current evidence supports enough understanding for the decision.
- Keep small clarifications inline. Create or update a lesson or topic when a durable project-grounded explanation would help.

Continue with the teaching needs that merit attention, or return to the original work with useful existing links.

## 3. Select prerequisites and depth

- Follow explicit topics within the selected teaching needs. Otherwise map prerequisites across the active plan/spec: teach upcoming concepts broadly and go deeply into what is needed next.
- Apply [teaching guidance](references/teaching.md) for depth, lesson design and practice. Supply missing prerequisites for the current decision, even when they form a substantial topic.
- Retain later prerequisites as deferred topics with a reason and revisit condition. Keep valuable unknown unknowns as opportunities, without creating a compulsory curriculum.
- If context provides no useful topic, ask what work to explore.

## 4. Research and ground the needs

- For substantive teaching, follow [research guidance](references/research.md) to decide which selected needs existing research satisfies and what remains to investigate.

## 5. Teach and apply

- Read [writing guidance](references/writing.md) before drafting.
- Prefer a substantial HTML lesson over a long chat explanation. Follow [artifact guidance](references/artifacts.md) for page creation, maintenance, verification and delivery with the [library helper](scripts/library.py).
- Keep topic pages as current syntheses and lessons as reusable snapshots. Use [page selection guidance](references/artifacts.md#choose-a-page) for lessons, topics, glossary vocabulary and annotated resource collections.
- In chat, present the original question, a brief orientation and the lesson link. Small clarifications can stay inline.
- Make the explanation project-grounded and complete enough for the current decision. The user can ask to drill down further or follow the reading links.
- Teach generously during exploration; supplement delivery workflows without displacing their purpose. Ask a contextual application question; the pending planning question can serve as practice.
- Let the user answer or continue without finishing the artifact.

## 6. Reconcile and return to the work

- After new teaching or meaningful evidence, use the `teach-update` skill to reconcile exposure, study intent, links, gaps and actual user evidence. Follow its no-change path when the account supports no update.
- Finish with the relevant question, lesson link and a clear return to the original workflow.

## Passive teaching

During ordinary development, teach only when the [marked AGENTS block](references/integrations.md#passive-teaching) enables it and a significant transferable gap affects an imminent decision or failure. Follow the block's Inline or Background execution mode, treating an unmarked legacy block as Inline. Routine syntax, unfamiliar APIs and boilerplate do not qualify; otherwise continue quietly.
