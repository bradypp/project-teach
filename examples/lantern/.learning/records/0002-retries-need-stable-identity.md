# Retries need stable identity

- **Date:** 2026-09-13
- **Concept:** Idempotent intake and duplicate detection
- **Status:** Demonstrated in a synthetic example interaction
- **Related lesson:** [Make retries boring](../lessons/make-retries-boring.html)

## Evidence

Fictional learner design note produced after comparing two implementations:

> “Checking whether the payload already exists and then inserting is two operations with a race between them. I would make `(provider, event_id)` unique and attempt the insert directly. `ON CONFLICT DO NOTHING` lets SQLite decide atomically. I would also store a payload digest so the same ID with changed content becomes an error.”

This is fabricated solely to demonstrate an evidence record. The reasoning identifies the check-then-act race, chooses a storage invariant and handles the ambiguous same-ID/different-payload case.

## Assessment

The fictional learner can translate an idempotency concept into a concrete schema constraint and intake path. Application to an external side effect remains unverified.

## Next check

Ask which operation should own its own idempotency key when one webhook causes both a database update and a call to a remote API.
