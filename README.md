# ForgeGuard

**ForgeGuard** is a portable engineering guardrails skill for coding agents.

> Keep agent-driven repository work deliberate, scoped, evidence-based, and safe.

- **Human name:** ForgeGuard
- **Technical skill name:** `engineering-guardrails`
- **Current version:** `1.3.0`
- **License:** MIT
- **Clients:** OpenAI Codex, Claude Code, Cursor

## What ForgeGuard is

Coding agents can now inspect repositories, modify code, run tests, delegate work, prepare commits, change infrastructure, and operate production-facing systems.

The dangerous failure mode is therefore no longer only bad code. It is uncontrolled engineering workflow: expanding scope, ignoring repository constraints, delegating without permission, claiming verification that never happened, executing risky operations without a safety gate, or producing authoritative commit descriptions unsupported by the actual diff.

ForgeGuard adds a reusable **guardrail and workflow layer** around repository work.

It is intentionally language- and framework-agnostic. ForgeGuard does not assume Python, Rust, TypeScript, Next.js, FastAPI, Bevy, a particular database, CI provider, repository host, or deployment model.

## Core capabilities

ForgeGuard provides:

- repository-aware instruction discovery;
- adaptive workflow selection;
- optional GSD integration when GSD is actually present;
- measurable Goal Gate for substantial ambiguous work;
- explicit user approval before Subagent delegation;
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

### Global installation

```bash
npx --yes github:GendByteMaster/ForgeGuard install --global
```

### Skip Codex instruction integration

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --no-agents
```

After publication to the npm registry, the shorter registry form is:

```bash
npx @gendbytemaster/forgeguard install
```

## CLI

```text
forgeguard install   [--client all|codex|claude|cursor] [--global] [--force] [--no-agents] [--dry-run]
forgeguard status    [--client all|codex|claude|cursor] [--global] [--no-agents]
forgeguard uninstall [--client all|codex|claude|cursor] [--global] [--no-agents] [--dry-run]
```

The npm package has no runtime dependencies and requires Node.js 18 or newer.

## Automatic Codex integration

When Codex is one of the selected clients, `forgeguard install` also manages a small ForgeGuard activation block in the active Codex repository instruction file.

ForgeGuard uses explicit markers:

```md
<!-- forgeguard:managed-start -->
## ForgeGuard

- Before repository implementation, bug fixes, refactors, migrations, security-sensitive changes, production changes, or commit preparation, load and apply the `engineering-guardrails` skill.
- Follow ForgeGuard's Risk Gate and explicit subagent approval gate.
- Keep repository-local instructions authoritative within their scope.
- If the skill cannot be loaded, report that explicitly and continue with the repository's existing instructions; do not invent missing ForgeGuard policy.
<!-- forgeguard:managed-end -->
```

The integration is idempotent:

- repeated installs update the same managed block;
- unrelated project instructions are preserved;
- `AGENTS.override.md` is respected when it is the active override;
- `forgeguard uninstall` removes only ForgeGuard-managed content.

For `--global`, ForgeGuard uses `$CODEX_HOME` when configured or `~/.codex` by default for Codex instruction integration.

After changing Codex instructions, start a **new Codex session** so the updated instructions are loaded.

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

ForgeGuard never treats a planner, workflow, GSD recommendation, coding agent, orchestrator, or tool suggestion as authorization to launch a Subagent.

Delegation requires explicit user approval in the current conversation.

Without that approval, the agent should continue the work itself whenever possible.

## Commit Intelligence — v1.3.0

ForgeGuard v1.3.0 turns commit preparation into an evidence-driven engineering step.

The actual `git diff` is the primary source of truth.

ForgeGuard determines the primary change type from the diff, including:

- `feat` — new feature or capability;
- `fix` — bug fix;
- `refactor` — restructuring without intended behavior change;
- `perf` — performance improvement;
- `docs` — documentation-only change;
- `style` — formatting/style-only change;
- `test` — test-focused change;
- `chore` — maintenance work.

### Conventional Commit subject

Preferred format:

```text
<type>(<scope>): <short summary>
```

When no meaningful scope can be inferred:

```text
<type>: <short summary>
```

Rules:

- maximum 72 characters unless the repository defines a stricter limit;
- imperative mood;
- concise and specific wording;
- scope only when supported by the affected module/service/package/domain;
- no functionality, motivation, or impact invented beyond the available evidence.

### Mandatory structured Description

The `Description` section is mandatory whenever ForgeGuard prepares commit output, even when only a commit message was requested.

Required shape:

```text
<type>(<scope>): <short summary>

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

If the reason cannot be inferred from the diff or supplied task context, ForgeGuard must say so instead of inventing intent:

```text
- Reason is not inferable from the diff alone.
```

ForgeGuard must also not claim that tests, builds, migrations, deployments, benchmarks, security improvements, compatibility guarantees, or performance improvements are verified without supporting evidence.

If the diff contains materially unrelated changes, ForgeGuard should surface that and recommend splitting them into separate commits when appropriate.

See [`engineering-guardrails/references/commit-policy.md`](engineering-guardrails/references/commit-policy.md) for the complete policy.

## Workflow model

```text
User task
    │
    ▼
ForgeGuard
    │
    ├── repository discovery
    ├── workflow selection
    ├── goal gate
    ├── subagent approval gate
    ├── risk gate
    ├── implementation discipline
    ├── verification discipline
    └── commit intelligence
            │
            ▼
     specialized tools / skills
```

ForgeGuard is a **guardrail/orchestration layer**, not a monolithic do-everything framework.

Debugging, security analysis, architecture, testing, deployment, GitHub operations, and other domain-specific work should remain in specialized skills and tools while ForgeGuard governs scope, workflow, approvals, verification, and evidence quality.

## Skill structure

```text
engineering-guardrails/
├── SKILL.md
└── references/
    ├── commit-policy.md
    ├── goal-policy.md
    ├── gsd-workflow.md
    ├── risk-gate.md
    └── subagent-policy.md
```

## Compatibility

| Client | Status | Project installation |
|---|---|---|
| OpenAI Codex | Supported | `.agents/skills/engineering-guardrails/` + managed Codex instruction block |
| Claude Code | Supported | `.claude/skills/engineering-guardrails/` |
| Cursor | Supported | `.agents/skills/engineering-guardrails/` or `.cursor/skills/engineering-guardrails/` |

See:

- [Installation guide](docs/INSTALLATION.md)
- [Compatibility notes](docs/COMPATIBILITY.md)
- [Usage examples](examples/USAGE.md)
- [Changelog](CHANGELOG.md)
- [v1.3.0 release notes](docs/releases/v1.3.0.md)

## Version history

- **v1.3.0 — Commit Intelligence**: mandatory structured diff-grounded commit analysis.
- **v1.2.0 — Automatic Codex Integration**: managed Codex instruction activation.
- **v1.1.0 — Risk Gate and CLI**: risk classification and npm/npx installer.
- **v1.0.0 — Initial Public Release**: portable engineering workflow guardrails.

## License

MIT License. See [LICENSE](LICENSE).
