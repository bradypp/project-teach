# Optional integrations

Setup offers four outcomes: no integration, persistent AGENTS.md context, selected workflow wrappers, or both. Explicit teach commands work in every case. The AGENTS.md section records why the project is being built for learning. Calling a wrapper explicitly adds teaching to that workflow.

## Project-learning context

Tailor this section to the agreed mission and add it to the project's AGENTS.md when selected. Replace the purpose text before writing. Use `## Project learning` as the section boundary.

```md
## Project learning

This is a learning project: {{brief project purpose and learning goals}}.

- Build for learning and clear understanding. Prefer simple, inspectable designs over unnecessary abstractions or backwards compatibility unless the project actually requires them.
- Use current project decisions and code as teaching context; preserve the requested workflow and deliverables.
```

Reuse a clear existing project-learning section instead of adding a duplicate. On later setup runs, revise only that section and preserve unrelated instructions. If its boundary or manual edits are ambiguous, show the targeted merge before editing. Removing the integration removes that section only.

## User-selected wrappers

Ask which existing skills the user wants supplemented. Read each selected source and its relevant dependencies before proposing a **new** wrapper from [the template](templates/wrapper.md). Keep the original skill untouched. The wrapper is an explicit teaching request and retains the original workflow's purpose and outputs.

- **Explore:** Brainstorming, planning and grilling get useful prerequisite teaching alongside their original questions. Preserve question grouping and productive struggle.
- **Deliver:** Specifications, tickets and implementation get supplementary teaching for unfamiliar consequential decisions. Preserve the normal deliverables.

Call other skills through the Skill tool by name rather than embedding SKILL.md file links. If an original skill is unavailable, request its location rather than inventing a replacement. Core teach commands remain standalone.

### Inline wrapper

Under the wrapper's Teaching supplement heading, explain relevant concepts in the primary workflow. Present a pending question alongside its explanation when useful; call the Skill tool for `teach` for substantial gaps, then resume the original workflow. Call the Skill tool for `teach-update` to reconcile new lessons and relevant completed work.

### Background wrapper

Under the same heading, say that teaching runs in Background mode. The selected original skill stays in the primary context. Start or reuse one teaching owner when a relevant concept needs substantial explanation. Give it the user goal, whole active plan or spec, relevant project decisions and files, learner context, notebook locators, expected outputs and authorisation constraints. Ask it to call the Skill tool for `teach` and return absolute artifact links and unresolved limitations.

Continue the original workflow without waiting. Forward later decisions and results to the same teaching owner, then surface its result when available. The teaching owner owns notebook changes for this task. If background subagents or later result delivery are unavailable, complete the original workflow and report the skipped teaching opportunity. Do not switch to inline teaching without the user's choice.

Preserve completion criteria and requirements around publishing, committing or other external actions. Teaching adds no permissions. Keep one chosen execution mode across generated wrappers. On later setup runs, update the wrapper's Teaching supplement section by heading, preserving manual content elsewhere. Show a targeted merge when that section has ambiguous manual edits.

For a user-only wrapper on hosts supporting it, add `agents/openai.yaml` with `policy: {allow_implicit_invocation: false}`. Other hosts use their supported invocation mechanism. Keep the five teach skills as siblings so shared references resolve.
