# Fieldnotes: fictional active plan

This plan provides context for the example learning flows; no production service is claimed to exist.

1. Define job acceptance and pending/running/ready/failed states.
2. Run a bounded in-process queue experiment and choose an overload response.
3. Specify stable export identity and trace retry failure windows.
4. Decide on durable job storage, worker claiming and file publication.
5. Build the service and test restart recovery with injected failures.

Current decision: durable job claiming. Capacity and identity lessons supply its prerequisites; transactions and leases need deeper study next.
