# Current learning state

Synthetic demonstration of teach-update reconciliation, not real learner evidence.

## Demonstrated in the fictional interaction

- Capacity versus storage: reasoned through a burst and admission choice. [Evidence](records/0001-capacity-is-not-storage.md), [lesson](lessons/queues.html).
- Timeout uncertainty: identified a side effect/status failure window. [Evidence](records/0002-timeout-is-uncertainty.md), [lesson](lessons/retries.html).

## Exposure and uncertainty

- Stable operation keys: introduced in the retry lesson; real implementation remains unverified.
- Durable claiming and publication: identified by planning, not yet demonstrated.
- [Quiz](quizzes/queue-practice.html) created for practice; no answers have been supplied and no assessment is inferred from it.

## Deferred

- Transactions and leases: revisit before implementing durable job claims.
- Retry budgets and jitter: revisit when the first recoverable failure path is implemented.

## Opportunities

- Fair scheduling across users: useful if large exports starve smaller ones.
- Outbox patterns: investigate when notification becomes a project requirement.

## Connected material

[Topic synthesis](topics/reliable-work.html) · [Capacity reference](references/capacity.html) · [Glossary](references/glossary.html)
