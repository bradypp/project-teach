---
name: teach
description: Teach in project context when requested or called by an explicit learning-aware workflow.
---

Help the user understand the project they are planning or building, including the prerequisites behind its decisions.

## 1. Inspect the work and learning context

- Read the current question and relevant project files, plan or spec. Identify the knowledge needed for this lesson and the work it supports.
- Read [learning system](references/learning-system.md). Follow its project context and evidence guidance. Use an existing mission for direction and constraints, or establish provisional context from the request and project.
- Consult `LEARNING_STATE.md`, relevant records and learning artifacts. Distinguish subjects taught, applied in project work, explained by the learner and still uncertain.
- Find related lessons, topics, references and retained research by concept, aliases, titles, tags and links. For a follow-up, read the complete supplied page and relevant linked material.
- Apply explicit teaching-style overrides when present. Teaching works without a preferences file or completed setup.

## 2. Reuse with judgement

Before teaching or authoring, use this heuristic and combine responses where useful:

- **Reuse directly:** Link current material when it fits both the concept and the present problem.
- **Adapt or extend:** Build on a sound foundation when the current problem needs different depth, framing, examples, trade-offs or application. Link earlier artifacts for context and lineage, and follow [source guidance](references/research.md#sources-and-further-reading) when reusing their claims.
- **Author anew:** Create a new explanation when existing material offers no coherent foundation or adapting it would distort its original purpose.
- Honour explicit requests to revisit or deepen material. Keep teaching supplementary to the original work.
- Keep small clarifications inline. Create or update a lesson or topic when a durable project-grounded explanation would help.

Continue with the teaching needs that merit attention, or return to the original work with useful existing links.

## 3. Select prerequisites and depth

- Follow explicit topics. Otherwise select the concept that most helps the active question or next piece of work. Supply prerequisites needed to make that explanation understandable; defer tangents and later concepts.
- Apply [teaching guidance](references/teaching.md) for focused depth and lesson design. Split a broad subject when separate lessons will be easier to use.
- Retain later prerequisites as deferred topics only when a revisit condition is useful. Keep valuable related ideas as opportunities, without creating a compulsory curriculum.
- If context provides no useful topic, ask what work to explore.

## 4. Research and ground the needs

- For substantive teaching, follow [research guidance](references/research.md) to decide which selected needs existing research satisfies and what remains to investigate.

## 5. Teach and apply

- Read [writing guidance](references/writing.md) before drafting.
- Prefer a substantial HTML lesson over a long chat explanation. Follow [artifact guidance](references/artifacts.md) for page creation, maintenance, verification and delivery with the [library helper](scripts/library.py).
- Keep topic pages as current syntheses and lessons as reusable snapshots. Use [page selection guidance](references/artifacts.md#choose-a-page) for lessons, topics, glossary vocabulary and annotated resource collections.
- In chat, present the original question, a brief orientation and the lesson link. Small clarifications can stay inline.
- Make the explanation project-grounded, directly useful and deep enough to explain its mechanism and consequential choices. The user can ask to drill down further or follow the reading links.
- Teach generously during exploration while preserving the delivery workflow. Offer optional practice through `teach-quiz` when requested.
- Let the user use the lesson as a reference while continuing the original work.

## 6. Reconcile and return to the work

- After new teaching or meaningful completed work, call the Skill tool for `teach-update` to create or enrich the subject record and reconcile affected links and state. Follow its no-change path when nothing useful changed.
- Finish with the relevant question, lesson link and a clear return to the original workflow.
