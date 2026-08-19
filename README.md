# ForgeGuard

**ForgeGuard** is a portable engineering guardrails skill for coding agents.

> Keep repository work deliberate, scoped, verifiable, and safe.

- **Human name:** ForgeGuard
- **Technical skill name:** `engineering-guardrails`
- **Version:** `1.0.0`
- **License:** MIT

## Why ForgeGuard

Coding agents are increasingly capable of planning, editing, testing, delegating, and committing changes. The failure mode is no longer only "bad code" — it is uncontrolled workflow: ignoring repository instructions, expanding scope, delegating without approval, claiming checks that never ran, or generating commit summaries unsupported by the diff.

ForgeGuard adds a reusable policy and workflow layer around repository changes.

## What it does

ForgeGuard helps an agent:

- inspect repository instructions before changing code;
- preserve project architecture, conventions, and tooling;
- choose the least heavyweight workflow that fits the task;
- integrate with GSD only when GSD actually exists;
- define measurable success criteria for substantial ambiguous work;
- require explicit user approval before launching subagents;
- keep implementation scoped to the requested outcome;
- verify changes instead of claiming unexecuted checks succeeded;
- derive Conventional Commit messages strictly from the actual diff.

ForgeGuard is intentionally **not** framework-specific. It does not assume Python, Rust, TypeScript, Next.js, FastAPI, Bevy, a database, CI provider, repository host, or deployment model.

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
    └── subagent-policy.md
```

## Quick install

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

Invoke with:

```text
$engineering-guardrails
```

### Claude Code

```bash
mkdir -p .claude/skills
cp -R engineering-guardrails .claude/skills/engineering-guardrails
```

Invoke with:

```text
/engineering-guardrails
```

### Cursor

```bash
mkdir -p .agents/skills
cp -R engineering-guardrails .agents/skills/engineering-guardrails
```

You can also use `.cursor/skills/engineering-guardrails/`.

Invoke with:

```text
/engineering-guardrails
```

See [Installation](docs/INSTALLATION.md) for project/global installation details and [Compatibility](docs/COMPATIBILITY.md) for client-specific notes.

## Example

```text
Use ForgeGuard and fix the refresh-token race condition.
```

ForgeGuard should first inspect applicable repository instructions, choose a bug-investigation workflow, avoid unrelated refactoring, require explicit approval before any subagent delegation, run relevant verification, and report any checks that could not be completed.

More scenarios: [Usage examples](examples/USAGE.md).

## Core safety rule

ForgeGuard never treats a recommendation from a planner, workflow, GSD, or another agent as permission to launch a subagent. Delegation requires explicit user approval in the current conversation.

## Compatibility

| Client | Status | Project path |
|---|---|---|
| OpenAI Codex | Supported | `.agents/skills/engineering-guardrails/` |
| Claude Code | Supported | `.claude/skills/engineering-guardrails/` |
| Cursor | Supported | `.agents/skills/engineering-guardrails/` or `.cursor/skills/engineering-guardrails/` |

## Versioning

ForgeGuard follows semantic versioning. See [CHANGELOG.md](CHANGELOG.md).

## License

MIT License. See [LICENSE](LICENSE).
