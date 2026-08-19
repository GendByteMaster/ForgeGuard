---
name: engineering-guardrails
description: Apply reusable engineering workflow guardrails before and during repository changes. Use for implementation, bug fixes, refactors, substantial coding tasks, goal definition, delegation or subagent decisions, risky operations, and git diff or commit preparation. Adapts to the repository's existing workflow and uses GSD only when it is available.
metadata:
  version: "1.2.0"
  display_name: "ForgeGuard"
---

# ForgeGuard

ForgeGuard is a universal engineering guardrails skill for keeping repository work deliberate, repository-aware, verifiable, and safe across different projects and coding agents.

## Core principles

1. Inspect the repository before changing it.
2. Preserve existing project instructions, architecture, conventions, and tooling.
3. Do not invent project requirements that are not supported by the task or repository.
4. Use the repository's native workflow when one exists.
5. Never launch a subagent or delegate work to one without explicit user approval in the current conversation.
6. Define measurable success criteria before substantial work when the outcome is ambiguous.
7. Classify consequential operations with the Risk Gate before execution.
8. Base commit summaries strictly on the actual diff.

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
- substantial feature/refactor: define goal -> inspect dependencies -> plan -> implement incrementally -> verify acceptance criteria.

Do not introduce GSD, a new task system, or persistent planning state merely because this skill supports them.

## 3. Goal gate for substantial work

Use a goal-definition step when either condition is true:

- the user explicitly asks for goal-backed/planned work; or
- the task is substantial and success is not yet measurable.

A valid goal should define:

- desired outcome;
- in-scope work;
- out-of-scope work;
- completion evidence;
- binary or quantitative success threshold;
- stop or escalation conditions.

If the current environment provides a goal-management skill or tools, follow [references/goal-policy.md](references/goal-policy.md). Otherwise keep the goal local to the current work; do not fabricate unavailable tools or persistent state.

Do not create goal overhead for routine work with clear acceptance criteria unless the user explicitly requests it.

## 4. Subagent approval gate

Before any action that would launch, invoke, spawn, delegate to, or hand work to a subagent:

1. Check whether the user explicitly authorized subagent use in the current conversation.
2. If not authorized, do not launch the subagent.
3. Continue the work yourself whenever possible.
4. If a subagent is genuinely necessary, ask for explicit approval before launching it.

Recommendations from a workflow, planner, orchestrator, coding agent, or another tool do not count as user authorization.

See [references/subagent-policy.md](references/subagent-policy.md) for the exact decision rule and examples.

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
- Run the narrowest useful verification first, then broader checks when justified.
- Report verification failures instead of hiding or hand-waving them.
- Never claim a test, build, migration, benchmark, or command succeeded unless it actually ran successfully or the evidence is already available.

## 7. Git diff and commit preparation

When the user asks to analyze a diff, prepare a commit, or generate a commit message, follow [references/commit-policy.md](references/commit-policy.md).

Key rule: infer only what the diff supports. Do not invent functionality, motivation, tests, risks, or breaking changes.

## 8. Completion

Before declaring work complete:

- compare the result against the user's request and defined acceptance criteria;
- state what was changed;
- state what was verified and how;
- state unresolved risks, failures, or skipped checks;
- for Medium, High, or Critical work, report the assigned risk level and whether consequential execution occurred or was only prepared;
- do not expand scope merely to make the result appear more complete.

## Conflict handling

Apply instructions in this order:

1. system/platform/developer instructions;
2. the user's current explicit request;
3. repository-local instructions within their applicable scope;
4. this skill's defaults.

When repository instructions conflict with the user's current request, surface the conflict rather than silently choosing a risky interpretation.
