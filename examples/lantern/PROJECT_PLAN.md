# Lantern project plan

Lantern is a small webhook inbox for local development. It receives signed HTTP events, stores each accepted delivery in SQLite, and lets a worker process the inbox independently.

## First useful slice

- `POST /events` validates an event envelope and obtains the provider's stable event ID.
- The handler durably records the event before returning a success response.
- A worker claims pending rows, applies a local side effect, and records completion.
- Repeated delivery of the same event is harmless.
- Intake has an explicit capacity policy instead of accumulating invisible work forever.

## Constraints

- Python standard library plus SQLite for the first slice.
- One process is acceptable initially, but correctness must not depend on an in-memory queue surviving a restart.
- Signature verification is required before production use; it is deferred in this teaching walkthrough so the reliability boundary stays visible.
- The system should prefer an honest temporary failure over acknowledging work it has not retained.

## Learning questions

1. What exactly has Lantern promised when it returns a `2xx` response?
2. Which identity makes a retry recognizable as the same request?
3. Which writes must share a transaction?
4. What happens when arrivals stay above processing capacity?
