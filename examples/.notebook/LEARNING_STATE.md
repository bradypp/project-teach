# Learning state

This demonstration contains synthetic teaching material, not evidence about a real learner. Its records mark subjects taught by created lessons; no personal mastery or completed implementation is implied.

## Current learning

- Runtime ownership and job promises: taught in the [runtime record](records/0001-runtime-ownership.md).
- Evidence selection and context packing: taught in the [evidence record](records/0002-evidence-selection.md); [context lab](quizzes/context-lab.html) offers optional practice.
- Boundary-level evaluation: taught in the [evaluation record](records/0003-boundary-level-evaluation.md); [incident room](quizzes/incident-room.html) offers debugging practice.
- Replay with changing source data: taught in the [replay record](records/0004-replay-and-changing-evidence.md).
- Worker leases and job deadlines: taught in the [ownership record](records/0005-leases-and-deadlines.md).
- Abstention and answer coverage: taught in the [coverage record](records/0006-abstention-and-coverage.md).
- Source revision and citation provenance: taught in the [citation record](records/0007-citation-source-revision.md).

The [current system synthesis](topics/reliable-investigations.html) connects these subjects; the [contract reference](references/investigation-contract.html) supports implementation.

## Uncertainty and next practice

- Can a learner distinguish retrieval failure from evidence omitted during packing?
- Can they explain why a stale worker must lose permission to persist a result?
- Can they design an eval with a meaningful abstention case and identify its limits?

## Deferred

- Graph checkpoint and replay APIs: revisit when selecting a framework version and implementing recovery; this example skips that implementation.
- Vector index tuning: revisit after a fixture corpus demonstrates a retrieval bottleneck.

## Opportunities

- Corpus versioning and tenant-aware caching may become useful when reproducing an answer across runbook edits or repeated investigations.
