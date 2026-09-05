---
name: engineering-guardrails
description: Apply reusable engineering workflow guardrails before and during repository changes. Use for implementation, bug fixes, refactors, substantial coding tasks, measurable goal definition, delegation or subagent decisions, risky operations, verification, and git diff or commit preparation. Adapts to the repository's existing workflow and uses GSD only when it is available.
metadata:
  version: "1.6.0"
  display_name: "ForgeGuard"
---

# ForgeGuard

ForgeGuard is a universal engineering guardrails skill for keeping repository work deliberate, repository-aware, measurable, verifiable, and safe across different projects and coding agents.

## Core principles

1. Inspect the repository before changing it.
2. Preserve existing project instructions, architecture, conventions, and tooling.
3. Do not invent project requirements that are not supported by the task or repository.
4. Use the repository's native workflow when one exists.
5. Never launch a subagent or delegate work to one without explicit user approval in the current conversation.
6. Treat subagent authorization as permission, not a requirement; the primary agent retains ownership of planning, integration, verification, and the final response.
7. Use Goal Intelligence to make substantial ambiguous work measurable before implementation.
8. Classify consequential operations with the Risk Gate before execution.
9. Base commit summaries strictly on the actual diff and always emit the mandatory structured Description defined by the commit policy.

## 1. Repository discovery

Before implementation or file-changing work:

- Read the nearest applicable repository instructions, such as `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, project docs, or local equivalents.
- Identify relevant package manifests, build/test commands, formatting and linting tools, and architecture boundaries.
- Prefer established repository patterns over introducing a new convention.
- Treat project-specific instructions as authoritative within their scope unless they conflict with higher-priority agent instructions or the user's current request.

Do not assume a specific language, framework, package manager, monorepo layout, database, CI provider, or deployment model.

## 2. Choose the workflow

Use the least heavyweight workflow that still preserves project context.

### If GSD is available

If the repository exposes GSD commands or GSD-managed planning artifacts, follow [references/gsd-workflow.md](references/gsd-workflow.md).

### If GSD is not available

Use the repository's existing task or planning workflow. If none exists:

- small, well-scoped change: inspect -> edit -> focused verification;
- bug investigation: reproduce -> isolate cause -> fix -> regression verification;
- substantial feature/refactor: define measurable goal -> inspect dependencies -> plan -> implement incrementally -> verify acceptance criteria.

Do not introduce GSD, a new task system, or persistent planning state merely because this skill supports them.

## 3. Goal Intelligence

Run a goal need-check when either condition is true:

- the user explicitly asks for goal-backed, goal-definition, or goal-refinement work; or
- the task is substantial and success is not yet honestly measurable.

Do not force a goal onto routine work that already has clear acceptance criteria.

A strong goal defines:

- concrete desired outcome;
- relevant artifact/system/environment or user-visible target;
- in-scope and out-of-scope boundaries when they matter;
- completion evidence;
- binary or quantitative success threshold;
- stop or escalation conditions.

Prefer observable outcomes over activity descriptions. Weak goals such as "make progress", "improve things", or "keep investigating" must be sharpened before they are used to control substantial work.

Quantify success when the domain supports meaningful measurement. Examples include exact verification commands, latency/error/cost/coverage thresholds, bounded affected artifacts, repeated successful runs, reviewed cases, operational monitoring windows, or rollback triggers.

Ask at most one concise clarification question when missing information can materially change the desired outcome, validator, environment, or scope. Otherwise use the strongest honest validator supported by repository context.

When persistent goal-management capabilities exist, inspect and reuse compatible active goal state before creating another goal. Do not fabricate goal tools or durable planning state when the environment does not provide them.

Follow [references/goal-policy.md](references/goal-policy.md) for the full Goal Intelligence policy and domain heuristics.

## 4. Authorized delegation

Reuse explicit user authorization already granted in the current conversation for the current task/scope; do not ask again before each spawn. Without authorization, continue locally whenever possible. Ask only if delegation is necessary or would exceed the approved scope.

Authorization permits delegation but does not require it. When authorized, actively evaluate meaningful independent work against execution time, quality, coverage, and independent verification benefits. Keep small or strictly sequential tasks local when coordination overhead outweighs the benefit.

Delegate bounded independent work with an objective, scope, expected output, evidence required, and constraints. The primary agent owns task understanding, planning, delegation decisions, integration, conflict resolution, final verification, and the final response. Worker output is evidence/input, not automatically accepted truth.

Default delegation depth is 1: the primary agent may create workers; workers must not spawn subagents under ForgeGuard v1.6.0 policy. A runtime preset is neither authorization nor mandatory delegation.

Follow [references/subagent-policy.md](references/subagent-policy.md) for authorization and [references/delegation-intelligence.md](references/delegation-intelligence.md) for decisions and worker contracts.

## 5. Risk Gate

Before executing an operation that can materially affect data, security, compatibility, availability, money, or a production system, classify it as **Low**, **Medium**, **High**, or **Critical** using [references/risk-gate.md](references/risk-gate.md).

Examples that require explicit risk classification include:

- database migrations and data rewrites;
- destructive database or storage operations;
- authentication, authorization, permissions, sessions, secrets, or cryptography changes;
- payment, billing, quota, or entitlement changes;
- production deployments and live infrastructure changes;
- externally visible breaking API, event, schema, or protocol changes.

High-risk work requires a clear blast radius, rollback/recovery strategy, and verification plan before consequential execution. Critical operations must not be executed automatically and require explicit user approval immediately before the irreversible or production-impacting step.

Preparing code, migration files, manifests, or runbooks is distinct from executing the consequential operation.

## 6. Implementation discipline

During code changes:

- Keep changes scoped to the requested outcome.
- Respect service/module/data ownership boundaries found in the repository.
- Avoid unrelated cleanup unless it is required for correctness or explicitly requested.
- Preserve public contracts unless the task requires a breaking change.
- Add or update tests when behavior changes and the repository has a testing pattern.
- Calibrate verification to risk and scope using [references/verification-policy.md](references/verification-policy.md); avoid redundant checks without new evidence or unresolved concerns.
- Report verification failures instead of hiding or hand-waving them.
- Never claim a test, build, migration, benchmark, or command succeeded unless it actually ran successfully or the evidence is already available.

## 7. Git diff and commit preparation

When the user asks to analyze a diff, prepare a commit, generate a commit message, or summarize changes for a commit, follow [references/commit-policy.md](references/commit-policy.md).

The actual diff is the primary source of truth. ForgeGuard must classify the change, generate a Conventional Commit subject, and always emit the complete mandatory structured `Description` with Changes, Reason, Implementation Details, Impact / Risks, and Breaking Changes.

Key rule: infer only what the diff or explicit task context supports. Do not invent functionality, motivation, tests, risks, verification, or breaking changes.

## 8. Completion

Before declaring work complete:

- compare the result against the user's request and defined acceptance criteria;
- compare substantial goal-backed work against its success threshold and evidence requirements;
- state what was changed;
- state what was verified and how;
- state unresolved risks, failures, or skipped checks;
- for Medium, High, or Critical work, report the assigned risk level and whether consequential execution occurred or was only prepared;
- do not expand scope merely to make the result appear more complete.

## Conflict handling

Preserve explicit user intent and respect applicable repository instructions within the platform's instruction hierarchy. ForgeGuard recommendations must not override explicit user intent. Hard safety/correctness requirements must have a concrete applicable source; do not invent approval gates. Resolve routine differences and continue authorized work; make blocking conflicts transparent with the exact source, rule, and affected action.

Follow [references/instruction-resolution.md](references/instruction-resolution.md) for priority, hard requirements versus recommendations, and avoiding permission loops.
