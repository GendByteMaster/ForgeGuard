# Verification Calibration

Choose verification from the changed surface, acceptance criteria, and highest applicable risk in [risk-gate.md](risk-gate.md).

| Change | Verification |
|---|---|
| Small/reversible | Focused validation of the changed behavior or artifact; documentation/link review can suffice for prose edits. |
| Medium | Targeted regression checks of affected behavior, boundaries, and compatibility. |
| High/critical | Broader contract and integration verification, including relevant failure paths and recovery assumptions before consequential execution. |

Run required repository checks and task acceptance checks even when a smaller check would otherwise suffice. Do not write tests merely mirroring a reversible low-impact edit. For behavior changes, prefer checks that would detect a real regression.

After checks pass, broaden or repeat them only when new changes, failures, new evidence, or unresolved concerns justify it. Evidence from a worker may be reused after assessing its scope, command/result, and relevance to the integrated state. Changes after a worker's run can invalidate that evidence.

The primary agent owns final verification. A worker saying "passed" without supporting evidence is insufficient. Report what actually ran, outcomes, and any skipped/blocked checks; distinguish local results from remote CI and never claim unavailable checks passed.
