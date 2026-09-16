# Switchboard: an incident-investigation agent

A fictional project brief for the example notebook. No backend is implemented here.

## Product

An on-call engineer asks why a deployment failed. Switchboard gathers authorised runbook passages and deployment events, then returns a cited explanation or says what evidence is missing. Investigations survive a closed browser tab. The first version has read-only tools.

## Proposed architecture

- A Go HTTP API authenticates users, scopes tenants, validates requests and persists jobs before acknowledging them.
- A Python worker executes a LangGraph investigation with bounded tool calls, a job deadline and recoverable state.
- A retrieval service searches versioned runbooks and incident notes; evidence packets retain source identity and access scope.
- A result API exposes status, a supported answer or abstention, and citations.
- An offline evaluation harness uses a fixed synthetic corpus and cases to distinguish retrieval, packing, answer-support and runtime failures.

## Build sequence

1. Implement one synchronous retrieve-and-answer path with a small fixture corpus.
2. Add explicit source envelopes, context packing and an insufficient-evidence outcome.
3. Create boundary-level evaluations before tuning prompts.
4. Introduce durable jobs, leases and deadline propagation when running multi-step investigations.
5. Exercise graph recovery and tool timeouts; compare behaviour against the same cases.

## Deliberate limits

No automated rollback, shell execution or production integrations. Code snippets illustrate design decisions rather than a pinned framework API. The initial lessons were written without research; later recovery lessons cite documentation in the notebook's research section. No backend tests or application performance measurements are claimed.
