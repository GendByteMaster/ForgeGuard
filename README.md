# ForgeGuard

**ForgeGuard** is a portable engineering guardrails skill for coding agents.

> Keep agent-driven repository work deliberate, scoped, measurable, evidence-based, and safe.

- **Human name:** ForgeGuard
- **Technical skill name:** `engineering-guardrails`
- **Current version:** `1.6.0`
- **License:** MIT
- **Clients:** OpenAI Codex, Claude Code, Cursor

## What ForgeGuard is

Coding agents can inspect repositories, modify code, run tests, delegate work, prepare commits, change infrastructure, and operate production-facing systems.

The dangerous failure mode is therefore no longer only bad code. It is uncontrolled engineering workflow: vague objectives, expanding scope, ignored repository constraints, unauthorized delegation, unsupported verification claims, risky execution without a safety gate, or authoritative commit descriptions unsupported by the actual diff.

ForgeGuard adds a reusable **guardrail and workflow layer** around repository work.

It is intentionally language- and framework-agnostic. ForgeGuard does not assume Python, Rust, TypeScript, Next.js, FastAPI, Bevy, a particular database, CI provider, repository host, or deployment model.

## Core capabilities

ForgeGuard provides:

- repository-aware instruction discovery;
- adaptive workflow selection;
- optional GSD integration when GSD is actually present;
- **Goal Intelligence** for measurable substantial work;
- explicit user approval before Subagent delegation;
- optional **Codex Subagent Runtime** defaults with Luna + xhigh;
- primary-agent ownership after delegation is authorized;
- **Low / Medium / High / Critical Risk Gate**;
- scoped implementation discipline;
- evidence-based verification rules;
- automatic Codex instruction integration;
- **Commit Intelligence** based on the real git diff;
- Conventional Commit generation with a mandatory structured description;
- npm/npx CLI installation for supported coding agents.

## Quick start

Install ForgeGuard into the current repository for Codex, Claude Code, and Cursor:

```bash
npx --yes github:GendByteMaster/ForgeGuard install
```

Check installation:

```bash
npx --yes github:GendByteMaster/ForgeGuard status
```

Upgrade an existing installation:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --force
```

Uninstall:

```bash
npx --yes github:GendByteMaster/ForgeGuard uninstall
```

### Install for one client

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex
npx --yes github:GendByteMaster/ForgeGuard install --client claude
npx --yes github:GendByteMaster/ForgeGuard install --client cursor
```

### Configure Codex subagents: Luna + Extra High

ForgeGuard does not change Codex runtime defaults during a normal install. Enable the optional preset explicitly:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --subagents
```

The preset manages the following values in the project `.codex/config.toml`:

```toml
[agents]
enabled = true
default_subagent_model = "gpt-5.6-luna"
default_subagent_reasoning_effort = "xhigh"
```

You can override either default:

```bash
npx --yes github:GendByteMaster/ForgeGuard install \
  --client codex \
  --subagent-model gpt-5.6-luna \
  --subagent-reasoning xhigh
```

ForgeGuard writes only its own managed block. Existing unmanaged subagent defaults are not overwritten automatically, and `uninstall` removes only ForgeGuard-managed values.

The runtime preset does **not** authorize delegation. The explicit Subagent approval policy still applies.

### Global installation

```bash
npx --yes github:GendByteMaster/ForgeGuard install --global
```

To configure the global Codex runtime preset in `$CODEX_HOME/config.toml` (or `~/.codex/config.toml`):

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --global --subagents
```

### Skip Codex instruction integration

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --no-agents
```

### Keep Codex runtime config during uninstall

```bash
npx --yes github:GendByteMaster/ForgeGuard uninstall --client codex --no-subagent-config
```

After publication to the npm registry, the shorter registry form is:

```bash
npx @gendbytemaster/forgeguard install
```

## CLI

```text
forgeguard install   [--client all|codex|claude|cursor] [--global] [--force] [--no-agents]
                     [--subagents] [--subagent-model MODEL] [--subagent-reasoning EFFORT]
                     [--no-subagent-config] [--dry-run]
forgeguard status    [--client all|codex|claude|cursor] [--global] [--no-agents]
                     [--no-subagent-config]
forgeguard uninstall [--client all|codex|claude|cursor] [--global] [--no-agents]
                     [--no-subagent-config] [--dry-run]
```

The npm package has no runtime dependencies and requires Node.js 18 or newer.

## Delegation Intelligence - v1.6.0

Reuse explicit user authorization within the current task/scope without asking before each worker. Authorization permits delegation but does not require it. When authorized, actively evaluate independent work for execution time, quality, coverage, or independent verification benefits. Keep small or sequential tasks local when coordination overhead outweighs the benefit.

Every worker receives an objective, scope, expected output, evidence required, and constraints. Default delegation depth is 1; workers must not spawn subagents under this policy. The primary agent assesses worker evidence, owns integration and conflict resolution, verifies the final result, and answers the user.

Instruction Resolution preserves explicit user intent and applicable repository instructions, separates hard requirements from recommendations, and explains blocking conflicts without permission loops. Verification is calibrated to risk and scope; successful checks are not repeated without new evidence or unresolved concerns.

See [delegation policy](engineering-guardrails/references/delegation-intelligence.md), [instruction resolution](engineering-guardrails/references/instruction-resolution.md), [verification policy](engineering-guardrails/references/verification-policy.md), and [usage scenarios](examples/USAGE.md#13-small-task-with-authorization).

The existing CLI flags and Luna + xhigh preset remain unchanged. Runtime configuration answers which worker defaults are available; this policy answers whether and how to use them. It does not change the primary model, automatically route models, or provide a standalone multi-agent runtime.

## Codex Subagent Runtime — v1.5.0

ForgeGuard can configure Codex runtime defaults without becoming a custom agent orchestrator.

When `--subagents` is enabled, ForgeGuard configures Luna with Extra High reasoning by default:

```text
Primary agent: whatever model the user selected, for example GPT-5.6 Sol
Subagents:     gpt-5.6-luna
Reasoning:     xhigh
```

The intended behavior is:

```text
User task
    │
    ├── explicit permission to use subagents
    ▼
Primary agent (for example Sol)
    │
    ├── decides whether delegation is useful
    ├── delegates bounded work when useful
    │       ├── Luna xhigh worker
    │       └── Luna xhigh reviewer
    ├── integrates results
    ├── resolves contradictions
    ├── performs/finalizes verification
    ▼
Final response owned by the primary agent
```

**Authorization is permission, not an obligation.** A small task may still be handled entirely by the primary agent even when the user says that subagents may be used.

ForgeGuard treats existing user configuration conservatively:

- unrelated `.codex/config.toml` settings are preserved;
- custom `[agents.<role>]` subtables are preserved;
- unmanaged `default_subagent_model` and `default_subagent_reasoning_effort` are not overwritten;
- unmanaged `enabled = false` is treated as a conflict instead of being silently changed;
- uninstall removes only the ForgeGuard-managed block.

## Automatic Codex integration

When Codex is one of the selected clients, `forgeguard install` also manages a small ForgeGuard activation block in the active Codex repository instruction file.

The managed block activates Goal Intelligence for substantial ambiguous work, requires the `engineering-guardrails` skill for repository implementation, risky operations, and commit preparation, and preserves primary-agent ownership when delegation is authorized.

The integration is idempotent:

- repeated installs update the same managed block;
- unrelated project instructions are preserved;
- `AGENTS.override.md` is respected when it is the active override;
- `forgeguard uninstall` removes only ForgeGuard-managed content.

For `--global`, ForgeGuard uses `$CODEX_HOME` when configured or `~/.codex` by default for Codex instruction integration.

After changing Codex instructions, start a **new Codex session** so the updated instructions are loaded.

## Goal Intelligence — v1.4.0

Goal Intelligence upgrades the previous Goal Gate into a measurable objective layer for substantial work.

It begins with a **need check**. ForgeGuard should not create goal overhead for a routine task that already has clear acceptance criteria.

When a goal is needed, it should define:

```text
Goal:
- Outcome: what concrete result should be true
- Success Criteria: binary or quantitative success threshold
- Evidence: tests, commands, measurements, review, or observations
- In Scope: allowed/required work
- Out of Scope: boundaries that prevent accidental expansion
- Stop / Escalate: when the agent must stop and ask instead of grinding
```

### Goal quality bar

A usable goal should answer:

1. What concrete result should exist when the work is done?
2. What evidence will prove it?
3. What binary or quantitative threshold defines success?
4. What scope boundaries matter?
5. What should cause the agent to stop or escalate?

Activity-only objectives such as `make progress`, `improve things`, `keep investigating`, or `work on performance` are not sufficient for substantial goal-backed work.

### Quantification

ForgeGuard uses meaningful numbers when the domain supports them, for example:

- exact test/typecheck/build/CI commands and required pass state;
- latency, throughput, memory, bundle size, error rate, cost, accuracy, coverage, flake rate, or uptime thresholds;
- required successful reruns or reviewed cases;
- bounded files/modules/services/routes/records;
- operational monitoring windows and rollback triggers.

When meaningful quantification is unavailable, ForgeGuard uses the strongest honest binary validator instead of inventing precision.

### Clarification discipline

ForgeGuard asks at most one concise clarification question when missing information can materially change the outcome, validator, environment, or scope.

If repository context safely resolves the ambiguity, it should sharpen the goal and continue instead of adding ceremony.

### Existing goal state

When persistent goal-management capabilities exist, ForgeGuard checks for compatible active goal state before creating another goal. It reuses matching goals, surfaces conflicts, and never fabricates goal APIs when the current agent does not provide them.

See [`engineering-guardrails/references/goal-policy.md`](engineering-guardrails/references/goal-policy.md) for the complete Goal Intelligence policy and domain heuristics.

## Risk Gate

Before consequential execution, ForgeGuard classifies risk using the highest applicable level.

| Level | Typical scope | Default behavior |
|---|---|---|
| **Low** | docs, tests, local reversible changes | proceed with focused verification |
| **Medium** | runtime behavior, dependencies, additive schemas | identify impact, rollback, and compatibility checks |
| **High** | auth/security, cryptography, billing, data migrations, production configuration, breaking contracts | require blast radius, recovery plan, and verification before consequential execution |
| **Critical** | destructive production data changes, irreversible migrations, key/trust-root operations, no-rollback deployment | never execute automatically; require explicit user approval immediately before execution |

The Risk Gate distinguishes **preparation** from **execution**. ForgeGuard may prepare migration files, manifests, deployment plans, or runbooks without automatically executing the consequential operation.

## Explicit Subagent approval

ForgeGuard never treats a planner, workflow, GSD recommendation, coding agent, orchestrator, runtime preset, or tool suggestion as authorization to launch a Subagent.

Delegation requires explicit user approval in the current conversation.

Without that approval, the agent should continue the work itself whenever possible.

With approval, the primary agent may delegate when useful, but remains responsible for planning, integration, verification, and the final response.

## Commit Intelligence — v1.3.0+

The actual `git diff` is the primary source of truth for commit preparation.

ForgeGuard determines the primary Conventional Commit change type and always emits a structured `Description` containing:

```text
Description:
- Changes:
  - ...

- Reason:
  - ...

- Implementation Details:
  - ...

- Impact / Risks:
  - ...

- Breaking Changes:
  - None
```

If the reason cannot be inferred from the diff or supplied task context, ForgeGuard says so instead of inventing intent. Verification, security, compatibility, performance, deployment, and breaking-change claims require supporting evidence.

See [`engineering-guardrails/references/commit-policy.md`](engineering-guardrails/references/commit-policy.md) for the full commit policy.

## Workflow model

```text
User task
    │
    ▼
ForgeGuard
    │
    ├── repository discovery
    ├── workflow selection
    ├── goal intelligence
    ├── subagent approval gate
    ├── optional Codex subagent runtime defaults
    ├── risk gate
    ├── implementation discipline
    ├── verification discipline
    └── commit intelligence
            │
            ▼
     specialized tools / skills
```

ForgeGuard is a **guardrail/orchestration layer**, not a monolithic do-everything framework.

Debugging, security analysis, architecture, testing, deployment, GitHub operations, and other domain-specific work should remain in specialized skills and tools while ForgeGuard governs goals, scope, workflow, approvals, verification, risk, and evidence quality.

## Skill structure

```text
engineering-guardrails/
├── SKILL.md
└── references/
    ├── delegation-intelligence.md
    ├── instruction-resolution.md
    ├── verification-policy.md
    ├── commit-policy.md
    ├── goal-policy.md
    ├── gsd-workflow.md
    ├── risk-gate.md
    └── subagent-policy.md
```

## Compatibility

| Client | Status | Project installation |
|---|---|---|
| OpenAI Codex | Supported | `.agents/skills/engineering-guardrails/` + managed Codex instruction block + optional `.codex/config.toml` runtime preset |
| Claude Code | Supported | `.claude/skills/engineering-guardrails/` |
| Cursor | Supported | `.agents/skills/engineering-guardrails/` or `.cursor/skills/engineering-guardrails/` |

See:

- [Installation guide](docs/INSTALLATION.md)
- [Compatibility notes](docs/COMPATIBILITY.md)
- [Usage examples](examples/USAGE.md)
- [Changelog](CHANGELOG.md)
- [v1.6.0 release notes](docs/releases/v1.6.0.md)
- [v1.5.0 release notes](docs/releases/v1.5.0.md)

## Version history

- **v1.6.0 - Delegation Intelligence**: scoped authorization, bounded workers, instruction resolution, and calibrated verification.

- **v1.5.0 — Codex Subagent Runtime**: optional Luna/xhigh defaults, safe TOML management, and primary-agent ownership.
- **v1.4.0 — Goal Intelligence**: measurable goals, evidence, quantification, scope, and stop conditions.
- **v1.3.0 — Commit Intelligence**: mandatory structured diff-grounded commit analysis.
- **v1.2.0 — Automatic Codex Integration**: managed Codex instruction activation.
- **v1.1.0 — Risk Gate and CLI**: risk classification and npm/npx installer.
- **v1.0.0 — Initial Public Release**: portable engineering workflow guardrails.

## License

MIT License. See [LICENSE](LICENSE).
