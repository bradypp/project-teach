# Maintaining the teach system

This repository packages project-based teaching skills. Read the relevant skill and its linked references before changing its behaviour.

## Boundaries

- The reusable package is `.agents/skills/learning/`; its five skills remain siblings.
- Skills outside that package are reference-only and may be deleted. The package must work without them.
- Work locally without subagents.
- Preserve existing user-authored learning material and original workflow skills.

## Sources of truth

- `teach/references/learning-system.md` defines project storage, evidence and records.
- `teach/references/teaching.md` defines teaching and presentation.
- `teach/references/TEACHING_STYLE.md` provides editable defaults.
- Templates and components live with `teach`; other skills link to shared guidance.

## Changes

- Keep instructions concise, human-readable and grouped by purpose. Prefer useful headings and short lists to dense rule paragraphs.
- Keep state thin, evidence in selective records, and settings in the manifest.
- Reflect changes across skill entry points, references, templates, helpers, installer and README. Avoid runtime dependencies on this checkout's absolute path.
- Keep lesson layouts flexible and components reusable. Routine artifacts need a quick content/link check, not exhaustive browser testing.
- Run relevant helper tests when changing executable behaviour. Update validation claims to distinguish current checks from historical scenarios.
