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

ForgeGuard adds a reusable **guardrail and orchestration layer** around that workflow. It is intentionally language- and framework-agnostic and does not assume a particular repository host, CI provider, package manager, runtime, database, or deployment model.

## Core capabilities

ForgeGuard provides:

- repository-aware instruction discovery;
- adaptive workflow selection;
- optional GSD integration when GSD is actually present;
- **Goal Intelligence** for measurable substantial work;
- explicit user approval before subagent delegation;
- **Delegation Intelligence** for deciding when authorized workers are actually useful;
- optional Codex subagent defaults with `gpt-5.6-luna` + `xhigh`;
- bounded worker contracts and primary-agent ownership;
- **Low / Medium / High / Critical Risk Gate**;
- risk-aware verification calibration;
- automatic Codex instruction integration;
- **Commit Intelligence** based on the real git diff;
- Conventional Commit generation with a structured description;
- npm/npx CLI installation for supported coding agents.

## Quick start

Run ForgeGuard directly from GitHub with `npx`:

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

## `npx` vs a permanent `forgeguard` command

`npx --yes github:GendByteMaster/ForgeGuard ...` is a **one-shot invocation**. It runs ForgeGuard for that command but does **not** permanently install `forgeguard` into your shell.

After an `npx` invocation, continue using the full form:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --subagents --global --force
npx --yes github:GendByteMaster/ForgeGuard status --client codex --global
```

If you want to type `forgeguard` directly, install the CLI globally from GitHub:

```bash
npm install --global github:GendByteMaster/ForgeGuard
forgeguard --version
```

On Windows, reopen the terminal if the npm global `bin` directory was added to `PATH` after the current shell started.

### Important: two different meanings of “global”

These are separate concepts:

```text
npm install --global ...   -> installs the forgeguard CLI as a shell command
forgeguard ... --global    -> targets user-level ForgeGuard/Codex files
```

ForgeGuard's `--global` flag does **not** install the CLI itself.

## Project and user-level installation

Project-level install:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex
```

User-level install:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --global
```

Typical paths:

| Client | Project skill path | User/global skill path |
|---|---|---|
| Codex | `.agents/skills/engineering-guardrails/` | `~/.agents/skills/engineering-guardrails/` |
| Claude Code | `.claude/skills/engineering-guardrails/` | `~/.claude/skills/engineering-guardrails/` |
| Cursor | `.agents/skills/engineering-guardrails/` or `.cursor/skills/engineering-guardrails/` | `~/.cursor/skills/engineering-guardrails/` |

## Codex subagent runtime

ForgeGuard does not change Codex runtime defaults during a normal install. Enable the optional Luna + Extra High preset explicitly:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --subagents
```

For the user-level Codex configuration:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --subagents --global
```

The preset manages:

```toml
[agents]
enabled = true
default_subagent_model = "gpt-5.6-luna"
default_subagent_reasoning_effort = "xhigh"
```

Project runtime configuration is stored in `.codex/config.toml`. Global runtime configuration is stored in `$CODEX_HOME/config.toml`, or `~/.codex/config.toml` when `CODEX_HOME` is not set.

The runtime preset does **not** authorize delegation. User authorization and Delegation Intelligence remain separate policy layers.

### Existing `[agents]` configuration is supported

ForgeGuard manages only its own marked block inside the top-level `[agents]` table. An existing `[agents]` table is **not automatically a conflict**.

For example, GSD may already own:

```toml
# GSD Agent Configuration — managed by gsd-core installer
[agents]
max_depth = 1
```

This is compatible with ForgeGuard. After enabling the ForgeGuard preset, both configurations can coexist:

```toml
# GSD Agent Configuration — managed by gsd-core installer
[agents]
# forgeguard:subagents-managed-start
enabled = true
default_subagent_model = "gpt-5.6-luna"
default_subagent_reasoning_effort = "xhigh"
# forgeguard:subagents-managed-end
max_depth = 1
```

ForgeGuard preserves `max_depth = 1`, unrelated direct `[agents]` keys, and custom `[agents.<role>]` subtables.

ForgeGuard refuses to silently replace actual unmanaged conflicts for:

- `default_subagent_model`;
- `default_subagent_reasoning_effort`;
- `enabled = false`.

An unmanaged `enabled = true` can be reused.

`--force` replaces an existing ForgeGuard skill installation, but it does **not** mean “overwrite arbitrary user-owned Codex runtime settings”.

### Understanding `unmanaged codex subagents`

`forgeguard status` may report:

```text
unmanaged codex subagents: C:\Users\you\.codex\config.toml
```

This means ForgeGuard found the Codex configuration path but did not find a ForgeGuard-managed subagent block there. It does **not** by itself mean that the configuration is broken or incompatible.

A file containing only:

```toml
[agents]
max_depth = 1
```

is unmanaged but compatible.

Run the desired `install --subagents` command to let ForgeGuard add its managed values. If an existing user-owned value really conflicts, ForgeGuard reports that conflict instead of silently replacing it.

## Delegation Intelligence — v1.6.0

Authorization is permission, not an obligation.

When subagents are authorized, ForgeGuard actively evaluates whether independent work would improve execution time, quality, coverage, or verification. Small or strictly sequential tasks should remain with the primary agent when coordination overhead outweighs the benefit.

Each delegated worker receives a bounded contract:

```text
Objective
Scope
Expected output
Evidence required
Constraints
```

Default delegation depth is `1`. Workers must not recursively spawn additional workers under the v1.6.0 ForgeGuard policy.

The primary agent remains responsible for:

- task understanding;
- planning;
- delegation decisions;
- integration;
- conflict resolution;
- final verification;
- the final response.

ForgeGuard also defers the actual instruction hierarchy to the host agent platform. Within ForgeGuard guidance, explicit user instructions take precedence over ForgeGuard skill recommendations unless a higher-priority platform, safety, or correctness requirement applies.

See:

- [Delegation Intelligence](engineering-guardrails/references/delegation-intelligence.md)
- [Instruction Resolution](engineering-guardrails/references/instruction-resolution.md)
- [Verification Policy](engineering-guardrails/references/verification-policy.md)
- [Usage scenarios](examples/USAGE.md#13-small-task-with-authorization)

## Automatic Codex integration

When Codex is selected, ForgeGuard manages a small activation block in the active Codex repository instruction file.

The integration is idempotent:

- repeated installs update the same managed block;
- unrelated project instructions are preserved;
- `AGENTS.override.md` is respected when it is the active override;
- uninstall removes only ForgeGuard-managed content.

For `--global`, ForgeGuard uses `$CODEX_HOME` when configured or `~/.codex` by default for Codex instruction integration.

After changing Codex instructions, start a **new Codex session** so the updated instructions are loaded.

## Goal Intelligence

For substantial work that needs a measurable objective, ForgeGuard defines:

```text
Goal:
- Outcome
- Success Criteria
- Evidence
- In Scope
- Out of Scope
- Stop / Escalate
```

Routine work that already has clear acceptance criteria should not gain unnecessary goal ceremony.

See [goal-policy.md](engineering-guardrails/references/goal-policy.md).

## Risk Gate

Before consequential execution, ForgeGuard classifies risk using the highest applicable level.

| Level | Typical scope | Default behavior |
|---|---|---|
| **Low** | docs, tests, local reversible changes | focused verification |
| **Medium** | runtime behavior, dependencies, additive schemas | impact, rollback, compatibility checks |
| **High** | auth/security, cryptography, billing, migrations, production config, breaking contracts | blast radius, recovery plan, broader verification |
| **Critical** | destructive production data changes, irreversible migrations, key/trust-root operations, no-rollback deployment | never execute automatically; require explicit approval immediately before execution |

Preparation is distinct from execution. ForgeGuard may prepare migration files, manifests, deployment plans, or runbooks without automatically performing the consequential action.

See [risk-gate.md](engineering-guardrails/references/risk-gate.md).

## Commit Intelligence

The actual `git diff` is the primary source of truth for commit preparation.

ForgeGuard produces a Conventional Commit and a structured description:

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

Claims about verification, security, compatibility, performance, deployment, or breaking changes require supporting evidence.

See [commit-policy.md](engineering-guardrails/references/commit-policy.md).

## CLI reference

```text
forgeguard install   [--client all|codex|claude|cursor] [--global] [--force] [--no-agents]
                     [--subagents] [--subagent-model MODEL] [--subagent-reasoning EFFORT]
                     [--no-subagent-config] [--dry-run]
forgeguard status    [--client all|codex|claude|cursor] [--global] [--no-agents]
                     [--no-subagent-config]
forgeguard uninstall [--client all|codex|claude|cursor] [--global] [--no-agents]
                     [--no-subagent-config] [--dry-run]
```

The `forgeguard` command above assumes a permanent CLI installation. When running directly from GitHub without installing the CLI, prefix the command with:

```text
npx --yes github:GendByteMaster/ForgeGuard
```

The package requires Node.js 18 or newer and has no runtime dependencies.

### Keep Codex runtime config during uninstall

```bash
npx --yes github:GendByteMaster/ForgeGuard uninstall --client codex --no-subagent-config
```

## npm registry

The GitHub `npx` form works without an npm registry publication.

After `@gendbytemaster/forgeguard` is available in the npm registry, the shorter forms are:

```bash
npx @gendbytemaster/forgeguard install
```

or:

```bash
npm install --global @gendbytemaster/forgeguard
forgeguard install
```

## Compatibility

| Client | Status | Managed Codex-style subagent runtime |
|---|---|---|
| OpenAI Codex | Supported | Yes, optional |
| Claude Code | Supported | No |
| Cursor | Supported | No |

Client-specific adapters remain optional and must not weaken the portable core policy.

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

## Documentation

- [Installation guide](docs/INSTALLATION.md)
- [Compatibility notes](docs/COMPATIBILITY.md)
- [Usage examples](examples/USAGE.md)
- [Changelog](CHANGELOG.md)
- [v1.6.0 release notes](docs/releases/v1.6.0.md)
- [v1.5.0 release notes](docs/releases/v1.5.0.md)

## Version history

- **v1.6.0 — Delegation Intelligence**: scoped authorization reuse, useful-parallelization decisions, bounded workers, portable instruction resolution, and calibrated verification.
- **v1.5.0 — Codex Subagent Runtime**: optional Luna/xhigh defaults, safe TOML management, and primary-agent ownership.
- **v1.4.0 — Goal Intelligence**: measurable goals, evidence, quantification, scope, and stop conditions.
- **v1.3.0 — Commit Intelligence**: mandatory structured diff-grounded commit analysis.
- **v1.2.0 — Automatic Codex Integration**: managed Codex instruction activation.
- **v1.1.0 — Risk Gate and CLI**: risk classification and npm/npx installer.
- **v1.0.0 — Initial Public Release**: portable engineering workflow guardrails.

## License

MIT License. See [LICENSE](LICENSE).
