---
name: teach
description: Teach in project context when requested, reached by a learning-aware workflow, or enabled by project passive-teaching settings.
---

Help the user finish useful work while understanding the systems they are building.

Read [writing guidance](references/writing.md) before drafting teaching content.

## Find the learning opportunity

1. Read [project context](references/learning-system.md#project-context), the current question and relevant project files. Consult the mission, teaching style, current understanding and related records/lessons.
2. If setup has not run, say so briefly at the top and teach immediately from available context. Saving useful material can initialise minimal local defaults; setup is not a prerequisite.
3. Follow an explicit topic. Otherwise choose one worthwhile concept that connects project reality, learning intent, existing understanding and valuable unknown unknowns. Prefer a transferable idea that changes a decision or debugging approach. If context provides no useful candidate, ask what work to explore.

## Teach and apply

Read [teaching guidance](references/teaching.md). Use [research guidance](references/research.md) when checking sources; the optional [transcript helper](scripts/transcript.py) retrieves video captions. The [library helper](scripts/library.py) creates HTML shells.

- Present the original question alongside its decision-relevant explanation.
- Refresh or deepen known material at the actual weak point. Current confusion outweighs an older summary.
- Teach generously in explicit learning and exploration workflows. Supplement delivery workflows without displacing their purpose.
- Use chat for small explanations, with a diagram when helpful. Substantial gaps earn linked HTML automatically, following [artifact guidance](references/artifacts.md).
- Ask one contextual application question. A pending planning or design question can serve as the exercise. The user can answer or continue without completing the artifact.

## Retain what matters

- Save reusable teaching and its sources; reuse an existing lesson before recreating an introduction.
- Retain useful opportunities according to teaching style in project learning state.
- When the user provides meaningful evidence, follow `teach-update` or read its sibling SKILL.md. Producing a lesson or working code is not evidence of their understanding.
- Finish with the relevant question, any lesson link and a clear return to the original work.

## Passive teaching

During ordinary development, interrupt only when `manifest.yaml` explicitly enables passive teaching and a significant transferable gap affects an imminent decision or failure. Routine syntax, unfamiliar APIs and boilerplate do not qualify. Otherwise continue quietly.
