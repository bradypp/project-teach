# Resources

Primary sources inspected for this walkthrough:

- [RFC 9110, §15.3.3: 202 Accepted](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.3.3) — defines the deliberately noncommittal meaning of `202 Accepted`.
- [Stripe webhook documentation](https://docs.stripe.com/webhooks) — a concrete provider contract covering fast `2xx` responses, repeated deliveries, asynchronous handling and event IDs.
- [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) — explains caller-provided request identity, atomic recording and the same-ID/different-intent edge case.
- [SQLite UPSERT](https://www.sqlite.org/lang_upsert.html) and [transactions](https://www.sqlite.org/lang_transaction.html) — authoritative behavior for uniqueness conflicts and commit boundaries in Lantern's storage layer.
- [Python `asyncio` queues](https://docs.python.org/3/library/asyncio-queue.html) — exact `maxsize` and blocking semantics for the in-process handoff example.
- [AWS Well-Architected: fail fast and limit queues](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_fail_fast.html) — operational guidance on bounded backlogs, message age and overload.
