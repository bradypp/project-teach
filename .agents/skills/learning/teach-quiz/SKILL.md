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
- Prefer a mix of formats when it improves practice; choose each for the thinking it elicits:
  - Quick-fire multiple choice for a focused prediction or distinction, with plausible alternatives.
  - Multi-step problems for calculations, debugging or linked decisions. Give each step independent feedback, keep every step accessible, and optionally finish with a whole-problem explanation.
  - Short written reflections for assumptions, trade-offs and reasoning, with a comparison rubric rather than automatic prose grading.
  - Explorative scenarios for applying an idea under uncertainty. Supply useful context blocks and optional diagrams, then ask for choices, a short written answer or both.
  - Custom visual puzzles or interactive experiments for investigating a mechanism. Invite a prediction, a meaningful manipulation and reflection on the result.
- Start from the [quiz practice components](../teach/references/quiz.md#practice-components) where useful; author custom widgets when they better teach the idea. The mix is a preference, not a quota of question types.
- Give explanatory feedback and relevant lesson links. Reveal answer-bearing links with feedback.
- Keep every format usable with the shared Copy for chat and Copy/Save Markdown controls. Follow the [export contract](../teach/references/artifacts.md#markdown-export) for custom widgets: include current settings, the latest result and learner responses, with hint/feedback disclosure. Capture action history only when the sequence itself teaches something. Copying prepares text to paste; it does not submit directly.

## Build and deliver

1. Use the [library helper](../teach/scripts/library.py) to create the quiz shell under `quizzes/`.
2. Inspect related lessons, topics, references and glossary entries. Add useful reciprocal links while keeping answer-bearing links inside feedback.
3. Check the content and answer keys. For new/custom interactions, try a response and copy it before and after feedback; confirm the prompt, context and current state survive without leaking unrevealed answers. Then complete [artifact maintenance and verification](../teach/references/artifacts.md#maintain-and-verify), which owns link-checker and index-rebuild conditions.
4. Return an absolute file link using the [artifact delivery](../teach/references/artifacts.md#deliver) guidance.

Quizzes are a fun aside meant as supplementary material and practice. Under the [learning evidence rules](../teach/references/learning-system.md#learning-records), creating, opening, completing or exporting one does not update learning state. Discuss answers if the user brings them back; use the `teach-update` skill when understanding is demonstrated or meaningful teaching interaction occurs.
