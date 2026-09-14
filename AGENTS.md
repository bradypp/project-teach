# Maintaining the teach system

This repository packages project-based teaching skills. Read the relevant skill and its linked references before changing its behaviour.

## Boundaries

- The reusable package is `.agents/skills/learning/`; its five skills remain siblings.
- Skills outside that package are reference-only and may be deleted. The package must work without them.
- Work locally without subagents.
- Preserve existing user-authored learning material and original workflow skills.

## Sources of truth

- `teach/references/learning-system.md` defines project storage, evidence and records.
- `teach/references/teaching.md` defines baseline teaching depth, methods, personality and lesson design.
- `teach/references/artifacts.md` defines artifact mechanics and delivery.
- `teach/references/visual-language.md` defines HTML composition, reusable components and theme-token use.
- `teach/references/quiz.md` defines practice templates, response boundaries, feedback and custom interactions.
- `teach/references/writing.md` defines prose guidance for teaching and maintained Markdown.
- `teach/references/PREFERENCES.md` is a concise template for optional project overrides. The skills and references must work fully without it.
- Templates and components live with `teach`; other skills link to shared guidance.

## Changes

- Keep instructions concise, human-readable and grouped by purpose. Prefer useful headings and short lists to dense rule paragraphs.
- Keep state thin, evidence in selective records, and passive teaching controlled by its marked AGENTS block.
- Reflect changes across skill entry points, references, templates, helpers, installer and README. Avoid runtime dependencies on this checkout's absolute path.
- Keep lesson layouts flexible and components reusable. Routine artifacts need a quick content/link check, not exhaustive browser testing.
- Run relevant helper tests when changing executable behaviour. Update validation claims to distinguish current checks from historical scenarios.

## Writing skills

- When invoking another skill, say “Use the `x` skill” by name rather than linking to its `SKILL.md`. Keep file links for supporting references, templates and scripts.
- Keep each skill's purpose, actionable workflow and important constraints readable in its entry point. Put shared detail in clearly linked references.
- Preserve the detail needed for consistent teaching, including decision criteria, examples and enjoyable practice. Do not reduce workflows to routing paragraphs merely to shorten them.
- Keep baseline behaviour in skills and references. Teaching-style files supplement it with optional preferences; they must not become required instruction manuals.
- Remove genuine duplication by choosing a single owning skill or by linking to a shared reference. A brief workflow reminder can remain where it helps execution; do not repeat the full explanation.
- Use descriptive headings and bullets for parallel rules or choices, and numbered lists for sequences. Avoid packing a list of instructions into a large paragraph.
- Prefer focused edits that preserve the original vision and useful sections. Retain requested additions when restoring earlier detail.
- Keep writing guidance self-contained; external inspiration does not need attribution links in skill instructions.
