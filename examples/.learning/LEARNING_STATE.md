# Learning state

This demonstration contains generated teaching material, not evidence about a real learner. Reading, practice completion and understanding remain unverified. No evidence records or mastery claims have been created.

## Exposure and study

- Runtime ownership, job leases and deadlines: introduced in [the runtime lesson](lessons/agent-runtime.html).
- RAG evidence selection and context packing: introduced in [the evidence lesson](lessons/evidence-before-answers.html); [context lab](quizzes/context-lab.html) offers optional practice.
- Boundary-level evaluation: introduced in [the eval lesson](lessons/evals-that-find-the-failure.html); [incident room](quizzes/incident-room.html) offers debugging practice.
- The [current system synthesis](topics/reliable-investigations.html) connects these topics; the [contract reference](references/investigation-contract.html) supports implementation.

## Uncertainty and next practice

- Can the learner distinguish retrieval failure from evidence omitted during packing?
- Can they explain why a stale worker must lose permission to persist a result?
- Can they design an eval with a meaningful abstention case and identify its limitations?

## Deferred

- Graph checkpoint and replay APIs: revisit when selecting a framework version and implementing recovery; this example skips research.
- Vector index tuning: revisit after a fixture corpus demonstrates a retrieval bottleneck.

## Opportunities

- Corpus versioning and tenant-aware caching may become useful when reproducing an answer across runbook edits or repeated investigations.
