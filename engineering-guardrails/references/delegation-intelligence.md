# Delegation Intelligence

## Decision procedure

First apply [subagent-policy.md](subagent-policy.md). Authorization is necessary but is not a command to delegate.

When authorized, actively evaluate whether meaningful independent work can run in parallel with useful primary-agent work. Delegate only when the expected benefit improves execution time, quality, coverage, or independent verification enough to justify context transfer, coordination, integration, and validation costs.

Good candidates include a bounded subsystem investigation, separate implementation modules with stable contracts, or an independent review while the primary agent checks integration. Suppress delegation for small changes, strictly sequential dependencies, heavily overlapping edits, or work the primary agent would duplicate while waiting. No worker count or numerical score is required.

## Bounded worker contract

Every delegated task must specify:

```text
Objective: concrete question to answer or outcome to deliver.
Scope: owned files/modules or read-only area; explicit exclusions.
Expected output: patch, findings, recommendation, or verification report.
Evidence required: source locations, reproductions, commands and results,
                   or other evidence appropriate to the objective.
Constraints: authorization boundaries, shared-workspace rules, dependencies,
             prohibited actions, and no subagent spawning.
```

Tell workers they share the codebase: do not revert others' edits; accommodate concurrent changes. Give overlapping changes to one owner or sequence them. A worker encountering scope drift, a blocker, or an unresolved contract returns it to the primary agent instead of widening its assignment.

## Ownership and depth

Default delegation depth = 1. The primary agent may create workers. Nested/recursive spawning is not enabled by ForgeGuard v1.6.0 policy; workers return additional work to the primary agent. Runtime support for recursion does not grant policy authorization.

The primary agent owns task understanding, planning, delegation decisions, integration, conflict resolution, final verification, and the final response. Assess worker output as evidence/input, not automatically accepted truth. Check claims against the requested scope and supplied evidence, resolve contradictions, inspect relevant changes, and verify integration. Reject or correct unsupported findings; do not blindly duplicate every worker check.

Use [verification-policy.md](verification-policy.md) to determine remaining validation. Runtime configuration selects available worker defaults; this policy decides whether and how authorized workers are used. It does not route models, change the primary model, or provide a standalone multi-agent runtime.

## Design basis

OpenAI's Model guidance for GPT-6 Astra recommends explicitly tuning subagent usage and delegating parallel work when doing so can save time or improve quality. The same guidance allows this pattern for root agents or subagents when the harness supports it.

ForgeGuard adopts the useful-parallelism principle but adds its own authorization boundary, coordination-cost check, bounded worker contract, primary-agent ownership, and conservative default depth of 1. Those are ForgeGuard policy choices rather than requirements stated by OpenAI.

Source: https://developers.openai.com/api/docs/guides/latest-model
