---
name: teach-quiz
description: Create enjoyable project-grounded practice with feedback, lesson links and optional Markdown export.
disable-model-invocation: true
---

Read [writing guidance](../teach/references/writing.md) before drafting teaching content.

## Choose the practice

- Read [project context](../teach/references/learning-system.md), any explicit teaching preferences and relevant lessons.
- Follow the requested focus or choose a small useful mix from accumulated learning.
- Without prior material, use concrete current context or ask for a topic; label it initial practice rather than a retention assessment.

## Make it enjoyable

Use [teaching guidance](../teach/references/teaching.md) for practice design and [artifact guidance](../teach/references/artifacts.md) for the page workflow.

- Prefer prediction, reasoning, debugging and application over definition recall.
- Keep questions and feedback easy to scan: use bullets for parallel points and steps, with short paragraphs for worked reasoning instead of dense text blocks.
- Choose a format that fits: choice questions, written reflection, a visual puzzle or a small interactive experiment.
- Reuse the bundled components where useful; author custom widgets when they better teach the idea.
- Give explanatory feedback and relevant lesson links. Reveal answer-bearing links with feedback.
- Offer the shared Copy for chat handoff and optional Markdown copy/download for choice and written answers. Copy for chat prepares the responses for the user to paste; it does not submit directly. Other widgets can provide a simple equivalent when useful.

## Build and deliver

1. Use the [library helper](../teach/scripts/library.py) to create the quiz shell under `quizzes/`.
2. Inspect related lessons, topics, references and glossary entries. Add useful reciprocal links while keeping answer-bearing links inside feedback.
3. Check the content and answer keys, then complete [artifact maintenance and verification](../teach/references/artifacts.md#maintain-and-verify). It owns the link-checker and index-rebuild conditions.
4. Return an absolute file link using the [artifact delivery](../teach/references/artifacts.md#deliver) guidance.

Quizzes are a fun aside meant as supplementary material and practice. Under the [learning evidence rules](../teach/references/learning-system.md#learning-records), creating, opening, completing or exporting one does not update learning state. Discuss answers if the user brings them back; use the `teach-update` skill when understanding is demonstrated or meaningful teaching interaction occurs.
