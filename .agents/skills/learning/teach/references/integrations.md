# Optional integrations

Add learning awareness or new workflow wrappers only when the user chooses them.

## Learning-project integration

Explicit teach commands work without `AGENTS.md`. Setup offers one integration containing project purpose, learning-oriented development rules and passive teaching. Tailor the purpose and rules to the agreed mission; replace the placeholder before writing:

```md
## Project learning

This is a learning project: {{brief project purpose and learning goals}}.

- Build for learning and clear understanding. Prefer simple, inspectable designs over unnecessary abstractions or backwards compatibility unless the project actually requires it.
- Use current project decisions and code as teaching context; preserve the requested workflow and deliverables.
- Consult `.learning/MISSION.md` and relevant `.learning/LEARNING_STATE.md` entries when present. Apply explicit preferences in `.learning/TEACHING_STYLE.md` if it exists.

<!-- teach:passive:start -->
During ordinary development, use the `teach` skill when a significant transferable conceptual gap affects an imminent decision or failure. Keep routine syntax, API usage and boilerplate quiet. Apply the project's teaching preferences after the opportunity qualifies.
<!-- teach:passive:end -->
```

## Passive teaching

- The marked block in the project's active `AGENTS.md` is the sole passive-teaching switch. Explicit teaching requests and wrappers do not depend on it.
- Setup adds the purpose, development rules and passive block together when this integration is enabled.
- To turn passive teaching off later, remove just the marked block, preserving the project context. To disable the entire integration, remove its project-learning section while preserving unrelated instructions.
- Reuse an existing project-learning section and avoid duplicate blocks. Show unresolved integration choices before applying them; existing authorisation suffices.

## User-selected wrappers

Ask which existing skills the user wants supplemented. Read the selected source and relevant dependencies before proposing a **new** wrapper from [the template](templates/wrapper.md). Original skills remain untouched.

- **Explore:** Brainstorming, planning and grilling get generous prerequisite teaching alongside the original questions. Preserve their question grouping and productive struggle.
- **Deliver:** Specifications, tickets and implementation get supplementary teaching before an unfamiliar consequential decision is fixed. Keep deliverables in their normal form.

Apply explicit project preferences where provided.

Resolve missing knowledge-dependent decisions before synthesis-only phases, then resume the original process. Preserve the workflow's completion criteria and requirements around publishing, committing or other external actions. Teaching adds no permissions.

Refer to other skills by name: “Use the `teach` skill.” Use supported skill discovery rather than embedding SKILL.md file links. If its source is missing, request the location rather than inventing a replacement. Core teach commands remain standalone.

For a user-only wrapper on hosts supporting it, add `agents/openai.yaml` with `policy: {allow_implicit_invocation: false}`. Other hosts use their supported invocation mechanism. Keep the five teach skills as siblings so shared references resolve.
