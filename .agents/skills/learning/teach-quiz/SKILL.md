---
name: teach-quiz
description: Create enjoyable project-grounded practice with feedback, lesson links and optional Markdown export.
disable-model-invocation: true
---

Read [writing guidance](../teach/references/writing.md) before drafting teaching content.

## Choose the practice

Read [project context](../teach/references/learning-system.md), teaching preferences and relevant lessons. Follow the requested focus or choose a small useful mix from accumulated learning. Without prior material, use concrete current context or ask for a topic; label it initial practice rather than a retention assessment.

## Make it enjoyable

Use [teaching guidance](../teach/references/teaching.md) and [artifact guidance](../teach/references/artifacts.md).

- Prefer prediction, reasoning, debugging and application over definition recall.
- Choose a format that fits: choice questions, written reflection, a visual puzzle or a small interactive experiment.
- Reuse the bundled controls where useful; author custom widgets when they better teach the idea.
- Give explanatory feedback and relevant lesson links. Reveal answer-bearing links with feedback.
- Offer optional Markdown copy/download using the shared controls for choice and written answers. Other widgets can provide a simple equivalent when useful.

Use the [library helper](../teach/scripts/library.py) to create a shell. Save under `quizzes/`, refresh the index and return an absolute file link. Quickly check content, answer keys and links; exhaustive browser testing is unnecessary.

Quizzes are a fun aside. Creating, opening, completing or exporting one does not update learning state. Discuss answers if the user brings them back; use `teach-update` only when an update is requested or meaningful teaching interaction warrants it.
