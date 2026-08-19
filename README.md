# ForgeGuard

**ForgeGuard** is a portable engineering guardrails skill for coding agents.

> Keep repository work deliberate, scoped, verifiable, and safe.

- **Human name:** ForgeGuard
- **Technical skill name:** `engineering-guardrails`
- **Version:** `1.1.0`
- **License:** MIT

## Quick start with npx

Install ForgeGuard into the current repository for Codex, Claude Code, and Cursor:

```bash
npx --yes github:GendByteMaster/ForgeGuard install
```

Check installation:

```bash
npx --yes github:GendByteMaster/ForgeGuard status
```

Install for one client only:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex
npx --yes github:GendByteMaster/ForgeGuard install --client claude
npx --yes github:GendByteMaster/ForgeGuard install --client cursor
```

Install globally for the current user:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --global
```

After the npm package is published, the shorter registry command is:

```bash
npx @gendbytemaster/forgeguard install
```

CLI commands:

```text
forgeguard install [--client all|codex|claude|cursor] [--global] [--force] [--dry-run]
forgeguard status [--client all|codex|claude|cursor] [--global]
forgeguard uninstall [--client all|codex|claude|cursor] [--global] [--dry-run]
```

## Why ForgeGuard

Coding agents are increasingly capable of planning, editing, testing, delegating, committing, deploying, and operating systems. The failure mode is no longer only "bad code" — it is uncontrolled workflow: ignoring repository instructions, expanding scope, delegating without approval, claiming checks that never ran, executing risky operations without an explicit safety gate, or generating commit summaries unsupported by the diff.

ForgeGuard adds a reusable policy and workflow layer around repository changes.

## What it does

ForgeGuard helps an agent:

- inspect repository instructions before changing code;
- preserve project architecture, conventions, and tooling;
- choose the least heavyweight workflow that fits the task;
- integrate with GSD only when GSD actually exists;
- define measurable success criteria for substantial ambiguous work;
- require explicit user approval before launching subagents;
- classify consequential work with a **Low / Medium / High / Critical Risk Gate**;
- require explicit approval before Critical or irreversible production-impacting execution;
- keep implementation scoped to the requested outcome;
- verify changes instead of claiming unexecuted checks succeeded;
- derive Conventional Commit messages strictly from the actual diff.

ForgeGuard is intentionally **not** framework-specific. It does not assume Python, Rust, TypeScript, Next.js, FastAPI, Bevy, a database, CI provider, repository host, or deployment model.

## Risk Gate

ForgeGuard v1.1 adds a dedicated Risk Gate before consequential operations.

| Level | Typical scope | Default behavior |
|---|---|---|
| Low | docs, tests, local reversible changes | proceed + focused verification |
| Medium | runtime behavior, dependencies, additive schemas | identify impact + rollback + compatibility checks |
| High | auth/security, cryptography, billing, data migrations, production config, breaking contracts | require blast radius + recovery plan + verification before execution |
| Critical | destructive production data changes, irreversible migrations, key/trust-root operations, no-rollback deployment | never execute automatically; explicit user approval required immediately before execution |

The gate distinguishes **preparing** a migration/deployment/runbook from **executing** the consequential operation.

## Architecture

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
    └── diff-grounded commit preparation
            │
            ▼
     specialized tools/skills
```

ForgeGuard is a **guardrail/orchestration layer**, not a monolithic do-everything framework. Debugging, security, architecture, testing, GitHub operations, and other domain work should remain in specialized skills and tools.

## Structure

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

## Manual install

Clone ForgeGuard:

```bash
git clone https://github.com/GendByteMaster/ForgeGuard.git
cd ForgeGuard
```

### Codex

```bash
mkdir -p .agents/skills
cp -R engineering-guardrails .agents/skills/engineering-guardrails
```

### Claude Code

```bash
mkdir -p .claude/skills
cp -R engineering-guardrails .claude/skills/engineering-guardrails
```

### Cursor

```bash
mkdir -p .agents/skills
cp -R engineering-guardrails .agents/skills/engineering-guardrails
```

See [Installation](docs/INSTALLATION.md) for project/global installation details and [Compatibility](docs/COMPATIBILITY.md) for client-specific notes.

## Example

```text
Use ForgeGuard and fix the refresh-token race condition.
```

ForgeGuard should first inspect applicable repository instructions, choose a bug-investigation workflow, classify any consequential operations, avoid unrelated refactoring, require explicit approval before subagent delegation or Critical execution, run relevant verification, and report any checks that could not be completed.

More scenarios: [Usage examples](examples/USAGE.md).

## Core safety rules

ForgeGuard never treats a recommendation from a planner, workflow, GSD, or another agent as permission to launch a subagent. Delegation requires explicit user approval in the current conversation.

Critical destructive or irreversible production-impacting operations are also never executed automatically.

## Compatibility

| Client | Status | Project path |
|---|---|---|
| OpenAI Codex | Supported | `.agents/skills/engineering-guardrails/` |
| Claude Code | Supported | `.claude/skills/engineering-guardrails/` |
| Cursor | Supported | `.agents/skills/engineering-guardrails/` or `.cursor/skills/engineering-guardrails/` |

## npm package

The repository root is an npm CLI package:

```text
@gendbytemaster/forgeguard
```

It has no runtime dependencies and requires Node.js 18 or newer. Until the registry package is published, use the GitHub package spec with `npx` as shown above.

## Versioning

ForgeGuard follows semantic versioning. See [CHANGELOG.md](CHANGELOG.md).

## License

MIT License. See [LICENSE](LICENSE).
