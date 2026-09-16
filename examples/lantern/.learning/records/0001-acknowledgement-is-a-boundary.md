# Acknowledgement is a boundary

- **Date:** 2026-09-13
- **Concept:** Durable acknowledgement for asynchronous webhook intake
- **Status:** Demonstrated in a synthetic example interaction
- **Related lesson:** [What an acknowledgement promises](../lessons/what-an-acknowledgement-promises.html)

## Evidence

Fictional learner response to the lesson's application question:

> “I would send the success response only after SQLite commits the inbox row. Before the commit, a crash means Lantern has no durable copy, so the provider needs to retry. After the commit, the worker can fail independently because Lantern can resume from the row.”

This is an example of observed reasoning, not a real learner statement. It correctly locates the promise boundary and explains both sides of it rather than repeating a definition.

## Assessment

The fictional learner can apply the distinction between receipt and completed processing to the Lantern design. This does not yet establish understanding of duplicate side effects after worker crashes.

## Next check

Present a crash after sending an email but before setting `processed_at`; ask how the design prevents or reconciles a repeated email.
