# ForgeGuard

**ForgeGuard** is a portable engineering guardrails skill for coding agents.

> Keep repository work deliberate, scoped, verifiable, and safe.

- **Human name:** ForgeGuard
- **Technical skill name:** `engineering-guardrails`
- **Version:** `1.2.0`
- **License:** MIT

## Quick start with npx

Install ForgeGuard into the current repository for Codex, Claude Code, and Cursor:

```bash
npx --yes github:GendByteMaster/ForgeGuard install
```

For Codex, installation now also adds an idempotent ForgeGuard-managed block to the active repository instruction file (`AGENTS.md`, or `AGENTS.override.md` when that override is active). Start a new Codex session after installation so the updated instructions are loaded.

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

Skip automatic Codex instruction integration when needed:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --no-agents
```

After the npm package is published, the shorter registry command is:

```bash
npx @gendbytemaster/forgeguard install
```

CLI commands:

```text
forgeguard install [--client all|codex|claude|cursor] [--global] [--force] [--no-agents] [--dry-run]
forgeguard status [--client all|codex|claude|cursor] [--global] [--no-agents]
forgeguard uninstall [--client all|codex|claude|cursor] [--global] [--no-agents] [--dry-run]
```

## Automatic Codex integration

When Codex is one of the selected clients, `forgeguard install` manages a small marked block in the active Codex instruction file.

Example:

```md
<!-- forgeguard:managed-start -->
## ForgeGuard

- Before repository implementation, bug fixes, refactors, migrations, security-sensitive changes, production changes, or commit preparation, load and apply the `engineering-guardrails` skill.
- Follow ForgeGuard's Risk Gate and explicit subagent approval gate.
- Keep repository-local instructions authoritative within their scope.
- If the skill cannot be loaded, report that explicitly and continue with the repository's existing instructions; do not invent missing ForgeGuard policy.
<!-- forgeguard:managed-end -->
```

The integration is idempotent: repeated installs update the same block instead of creating duplicates. `forgeguard uninstall` removes only the ForgeGuard-managed block and preserves unrelated repository instructions.

For project-level installation ForgeGuard manages the instruction file in the current repository. For `--global`, it uses the Codex home directory (`$CODEX_HOME`, or `~/.codex` by default).

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

ForgeGuard is a **guardrail/orchestration layer**, not a monolithic do-everything framework.

## Compatibility

| Client | Status | Project path |
|---|---|---|
| OpenAI Codex | Supported | `.agents/skills/engineering-guardrails/` + managed Codex instruction block |
| Claude Code | Supported | `.claude/skills/engineering-guardrails/` |
| Cursor | Supported | `.agents/skills/engineering-guardrails/` or `.cursor/skills/engineering-guardrails/` |

See [Installation](docs/INSTALLATION.md), [Compatibility](docs/COMPATIBILITY.md), and [CHANGELOG.md](CHANGELOG.md).

## npm package

```text
@gendbytemaster/forgeguard
```

The package has no runtime dependencies and requires Node.js 18 or newer.

## License

MIT License. See [LICENSE](LICENSE).
