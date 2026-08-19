# ForgeGuard usage examples

These examples demonstrate the intended behavior of `engineering-guardrails`.

## 1. Small repository change

User:

```text
Use ForgeGuard and fix the typo in the API error message.
```

Expected behavior:

1. Inspect applicable repository instructions.
2. Locate the error message and the narrowest relevant test.
3. Make only the requested change.
4. Run focused verification when available.
5. Report exactly what changed and what was verified.

## 2. Bug investigation

User:

```text
Use ForgeGuard. Login sometimes returns 500 after refresh-token rotation. Find and fix the cause.
```

Expected behavior:

```text
inspect repo → reproduce/trace → isolate cause → minimal fix → regression verification
```

ForgeGuard should not use unrelated refactors to make the patch look cleaner.

## 3. Ambiguous substantial feature

User:

```text
Use ForgeGuard and redesign our payment architecture for multiple providers.
```

Because the task is substantial and the completion condition is ambiguous, ForgeGuard should establish a goal before implementation, including:

- desired outcome;
- in-scope and out-of-scope work;
- acceptance evidence;
- measurable success threshold;
- stop/escalation conditions.

## 4. GSD repository

User:

```text
Use ForgeGuard and implement the next planned phase.
```

If the repository actually exposes GSD workflow artifacts/commands, ForgeGuard should follow the GSD path. If GSD is absent, it must not install or fabricate it.

## 5. Subagent request not authorized

A planner recommends launching three subagents, but the user never approved delegation.

Expected behavior:

```text
Do not launch subagents.
Continue the work in the current agent when possible.
```

A planner recommendation is not authorization.

## 6. Explicit subagent authorization

User:

```text
Use ForgeGuard. You may launch a subagent for the security review.
```

ForgeGuard may delegate that approved scope if the environment supports subagents. Approval for one delegated task must not silently become blanket approval for unrelated delegation.

## 7. Commit preparation

User:

```text
Use ForgeGuard and prepare a commit message from my current diff.
```

Expected behavior:

1. Inspect the actual diff.
2. Classify the change from evidence in the diff.
3. Produce a Conventional Commit summary.
4. Include only changes, reasons, risks, tests, and breaking changes that are supported by evidence.
5. Never claim tests passed unless that evidence is available.

## 8. Verification failure

If implementation succeeds but the test suite fails for a real reason, ForgeGuard should report the failure rather than presenting the task as fully verified.

Example completion report:

```text
Changed: refresh-token reuse detection now revokes the token family.
Verified: targeted unit tests passed.
Not verified: integration suite could not start because MongoDB was unavailable.
Remaining risk: transaction behavior has not been exercised against a replica set in this run.
```
