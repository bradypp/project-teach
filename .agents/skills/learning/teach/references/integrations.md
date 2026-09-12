# Optional integrations

Add learning awareness or new workflow wrappers only when the user chooses them.

## Project awareness

Explicit teach commands work without `AGENTS.md`. Setup can propose this small awareness block:

```md
## Project learning

For learning requests and learning-aware workflows, consult `.learning/MISSION.md`, `.learning/LEARNING_STATE.md` and the teach skill. Follow `.learning/TEACHING_STYLE.md` for explanation preferences.
```

Offer passive teaching separately. If enabled, set `passive_teaching: true` in `manifest.yaml` and propose:

```md
When `.learning/manifest.yaml` enables passive teaching, use teach for significant transferable conceptual gaps affecting an imminent decision or failure. Keep routine implementation quiet.
```

Show proposed blocks and preserve unrelated instructions. Existing authorisation need not be requested again.

## User-selected wrappers

Ask which existing skills the user wants supplemented. Read the selected source and relevant dependencies before proposing a **new** wrapper from [the template](templates/wrapper.md). Original skills remain untouched.

- **Explore:** Brainstorming, planning and grilling get generous prerequisite teaching alongside the original questions. Preserve their question grouping and productive struggle.
- **Deliver:** Specifications, tickets and implementation get supplementary teaching before an unfamiliar consequential decision is fixed. Keep deliverables in their normal form.

Resolve missing knowledge-dependent decisions before synthesis-only phases, then resume the original process. Preserve the workflow's completion criteria and requirements around publishing, committing or other external actions. Teaching adds no permissions.

Use portable relative locators or supported skill discovery. A user-selected workflow can be followed by reading its instructions when direct invocation is unavailable. If its source is missing, request the location rather than inventing a replacement. Core teach commands remain standalone.

For a user-only wrapper on hosts supporting it, add `agents/openai.yaml` with `policy: {allow_implicit_invocation: false}`. Other hosts use their supported invocation mechanism. Keep the five teach skills as siblings so shared references resolve.
