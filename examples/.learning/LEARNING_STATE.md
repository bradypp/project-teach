# Learning state

> Synthetic example: this file demonstrates the shape of maintained state. Its learner evidence is fictional and must not be attributed to a real user.

## Current understanding

- Can distinguish **accepted for later processing** from **processing completed**, and places the acknowledgement after the durable inbox commit. Evidence: [acknowledgement is a boundary](records/0001-acknowledgement-is-a-boundary.md).
- Can explain why a stable event ID plus a uniqueness constraint makes duplicate intake a no-op. Evidence: [retries need stable identity](records/0002-retries-need-stable-identity.md).

## Useful exposure — not yet verified

- [Bound the inbox](lessons/bound-the-inbox.html) introduced queue limits, message age and overload policy. No learner explanation or application has been observed yet.
- [Reliable webhook delivery](topics/reliable-webhook-delivery.html) connects durable acknowledgement, deduplication and backpressure into one design.

## Uncertainty and next checks

- Verify that the learner can reason about the crash after the external side effect but before marking an event complete.
- Ask the learner to choose and justify Lantern's overload response when SQLite writes are saturated.
- Check whether the same-key/different-payload case is rejected rather than quietly treated as a duplicate.

## Deferred scope

- Provider-specific signature verification and secret rotation.
- Multi-worker claiming, leases and recovery of abandoned work.
- The transactional outbox pattern for side effects that leave SQLite.

## Useful lessons

- [What an acknowledgement promises](lessons/what-an-acknowledgement-promises.html) — revisit when deciding where the HTTP response belongs.
- [Make retries boring](lessons/make-retries-boring.html) — revisit when defining identity, uniqueness and transaction boundaries.
- [Webhook reliability checklist](references/webhook-reliability-checklist.html) — use during implementation and review.
