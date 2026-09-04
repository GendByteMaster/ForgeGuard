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

Authorization means **permission**, not a requirement to delegate. For a trivial task, the primary agent may still complete the work directly.

## 7. Sol primary agent with Luna/xhigh workers

First configure the Codex runtime preset:

```bash
forgeguard install --client codex --subagents
```

This manages the following defaults:

```toml
[agents]
enabled = true
default_subagent_model = "gpt-5.6-luna"
default_subagent_reasoning_effort = "xhigh"
```

Then a user can give a task to a primary agent such as Sol:

```text
Use ForgeGuard. Audit the authentication flow, fix the important problems,
and verify the result. You may use subagents.
```

A valid execution model is:

```text
GPT-5.6 Sol — primary agent
├── Luna xhigh — inspect authentication architecture
├── Luna xhigh — review tests and regression risks
├── Luna xhigh — perform a bounded security review
└── Sol — integrate findings, implement/approve changes, verify, and answer
```

The exact number of subagents is not prescribed. Sol may use zero, one, or several workers depending on the task and available runtime capabilities.

The primary agent remains responsible for:

- deciding whether delegation is useful;
- assigning bounded scopes;
- resolving conflicting subagent findings;
- integrating the final implementation;
- running or evaluating final verification;
- producing the final response to the user.

The Luna/xhigh preset does not change the primary model and does not bypass the explicit authorization gate.

## 8. Custom Codex subagent runtime

The default preset can be overridden:

```bash
forgeguard install \
  --client codex \
  --subagent-model gpt-5.6-luna \
  --subagent-reasoning xhigh
```

ForgeGuard applies these as subagent defaults only. If the Codex runtime does not support a configured value, ForgeGuard should surface the incompatibility rather than silently substituting a different model.

## 9. Checking runtime status

After enabling the preset:

```bash
forgeguard status --client codex
```

Expected runtime information includes the managed config path, the configured subagent model, and the reasoning effort.

A normal install without subagent flags should not create or modify the Codex runtime preset.

## 10. Safe uninstall

Remove ForgeGuard and its managed Codex runtime block:

```bash
forgeguard uninstall --client codex
```

Keep the managed Codex runtime block while uninstalling the skill/instruction integration:

```bash
forgeguard uninstall --client codex --no-subagent-config
```

Unrelated `.codex/config.toml` settings and custom `[agents.<role>]` tables must remain untouched.

## 11. Commit preparation

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

## 12. Verification failure

If implementation succeeds but the test suite fails for a real reason, ForgeGuard should report the failure rather than presenting the task as fully verified.

Example completion report:

```text
Changed: refresh-token reuse detection now revokes the token family.
Verified: targeted unit tests passed.
Not verified: integration suite could not start because MongoDB was unavailable.
Remaining risk: transaction behavior has not been exercised against a replica set in this run.
```
