# Optional integrations

Add learning awareness or new workflow wrappers only when the user chooses them. When either is selected, setup offers one project-wide execution mode for every generated integration:

- **Inline (default):** teaching runs in the primary workflow as it does without this option.
- **Background:** integrated teaching runs through a teaching owner while the primary workflow continues and finishes without waiting.

The generated instructions hold this choice; it is not a teaching-style preference. Explicit `teach`, `teach-quiz`, `teach-review`, `teach-update` and `teach-setup` requests remain foreground workflows in either mode.

## Learning-project integration

Explicit teach commands work without `AGENTS.md`. Setup offers one integration containing project purpose, learning-oriented development rules and one of the marked passive blocks below. Tailor the purpose and rules to the agreed mission; replace the placeholders before writing:

```md
## Project learning

This is a learning project: {{brief project purpose and learning goals}}.

- Build for learning and clear understanding. Prefer simple, inspectable designs over unnecessary abstractions or backwards compatibility unless the project actually requires it.
- Use current project decisions and code as teaching context; preserve the requested workflow and deliverables.
- Consult `.learning/MISSION.md` and relevant `.learning/LEARNING_STATE.md` entries when present. Apply explicit preferences in `.learning/PREFERENCES.md` if it exists.

{{Insert exactly one passive-teaching block from below.}}
```

### Inline AGENTS block

Inline is the default. Generate this block when Background was not explicitly selected:

```md
<!-- teach:passive:start -->
<!-- teach:execution:inline -->
During ordinary development, use the `teach` skill when a significant transferable conceptual gap affects an imminent decision or failure. Keep routine syntax, API usage and boilerplate quiet. Apply the project's teaching preferences after the opportunity qualifies.

Use the `teach-update` skill when ordinary development reveals meaningful user reasoning, application, reported study or a learning gap. Update only affected learning entries; autonomous agent work alone does not demonstrate understanding.
<!-- teach:passive:end -->
```

### Background AGENTS block

Generate the complete block below when Background is selected. A **teaching owner** is one medium-reasoning subagent responsible for the teaching work associated with the primary task.

```md
<!-- teach:passive:start -->
<!-- teach:execution:background -->
During ordinary development, keep routine syntax, API usage and boilerplate quiet. When a significant transferable conceptual gap affects an imminent decision or failure, start or reuse one medium-reasoning teaching subagent.

Give the teaching owner a self-contained brief containing:

- The original user goal and workflow, its current stage and the teaching trigger.
- The whole active plan or spec and relevant project files, versions, decisions and results.
- Conversation-only learner context and `.learning` mission, preferences and state locators.
- Expected learning outputs and the original authorisation constraints.

Ask the teaching owner to use the `teach` skill and own the complete teaching workflow. Require a self-contained result with absolute artifact links and any unresolved limitations.

Keep the original workflow in the primary context and continue it without waiting. Send material later decisions, results and user evidence to the same teaching owner instead of starting duplicates. Surface its result if ready; otherwise finish normally and let the background result arrive later. The teaching owner owns `.learning/` changes for this task and preserves the primary deliverables and permission boundaries.

When a suitable background subagent or later result delivery is unavailable, continue the original workflow and briefly report the skipped teaching opportunity. Do not fall back to inline teaching.
<!-- teach:passive:end -->
```

## Passive teaching

- The marked block in the project's active `AGENTS.md` is the sole passive-teaching switch. Explicit teaching requests and wrappers do not depend on it.
- Setup adds the purpose, development rules and selected passive block together. The `teach:execution` comment records its mode; a legacy block without one means Inline.
- One setup choice applies to the AGENTS block and every setup-generated wrapper. When revising mixed integrations, show the proposed common mode before reconciling them.
- To turn passive teaching off later, remove just the marked block, preserving the project context. To disable the entire integration, remove its project-learning section while preserving unrelated instructions.
- Reuse an existing project-learning section and avoid duplicate blocks. Show unresolved integration choices before applying them; existing authorisation suffices.

## User-selected wrappers

Ask which existing skills the user wants supplemented. Read the selected source and relevant dependencies before proposing a **new** wrapper from [the template](templates/wrapper.md). Original skills remain untouched.

- **Explore:** Brainstorming, planning and grilling get generous prerequisite teaching alongside the original questions. Preserve their question grouping and productive struggle.
- **Deliver:** Specifications, tickets and implementation get supplementary teaching for unfamiliar consequential decisions. Keep deliverables in their normal form.

Apply explicit project preferences where provided. Refer to other skills by name: “Use the `teach` skill.” Use supported skill discovery rather than embedding SKILL.md file links. If the original source is missing, request its location rather than inventing a replacement. Core teach commands remain standalone.

### Inline wrapper supplement

Inside the template's `teach:integration` markers, apply the relevant Explore or Deliver guidance and generate the current inline flow: present the pending question alongside its explanation, use the `teach` skill for substantial gaps, resolve missing knowledge-dependent decisions before synthesis-only phases, then resume the original workflow. Use the `teach-update` skill to reconcile useful exposure and actual user reasoning.

### Background wrapper supplement

Inside the markers, adapt the complete [Background AGENTS block](#background-agents-block). The wrapper invocation replaces the passive-teaching trigger, and the selected original skill stays in the primary context. Include the full teaching-owner handoff, ownership, forwarding, completion and unsupported-host rules. Apply Explore or Deliver guidance to the teaching owner's work; the primary workflow continues through consequential decisions and synthesis without waiting for it.

Preserve the original workflow's completion criteria and requirements around publishing, committing or other external actions. Teaching adds no permissions.

On later setup runs, use the `teach:execution` comment to identify the selected mode and replace only a marked integration section. A legacy wrapper can be converted when its generated Skills and Teaching supplement sections unambiguously match the old template; preserve everything else. Show a targeted merge and ask before changing an ambiguous or manually edited section.

For a user-only wrapper on hosts supporting it, add `agents/openai.yaml` with `policy: {allow_implicit_invocation: false}`. Other hosts use their supported invocation mechanism. Keep the five teach skills as siblings so shared references resolve.
