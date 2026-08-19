# ForgeGuard

**ForgeGuard** is a portable engineering guardrails skill for coding agents.

- **Human name:** ForgeGuard
- **Technical skill name:** `engineering-guardrails`
- **Purpose:** keep repository work deliberate, repository-aware, verifiable, and safe

## What ForgeGuard does

ForgeGuard adds a policy and workflow layer around repository changes. It helps an agent:

- inspect repository instructions before changing code;
- preserve project architecture, conventions, and tooling;
- choose the least heavyweight workflow that fits the task;
- integrate with GSD when GSD is actually available;
- define measurable success criteria for substantial ambiguous work;
- require explicit user approval before launching subagents;
- keep implementation scoped to the requested outcome;
- verify changes instead of claiming unexecuted checks succeeded;
- derive Conventional Commit messages strictly from the actual diff.

ForgeGuard is intentionally **not** a framework-specific coding skill. It does not assume Python, Rust, TypeScript, Next.js, FastAPI, Bevy, a database, CI provider, or deployment model.

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

## Install

Copy the complete `engineering-guardrails/` directory into a skills directory supported by your coding agent/client, for example:

```text
.agents/skills/engineering-guardrails/
```

For clients with their own skill directories, use the location supported by that client.

## Design principle

ForgeGuard should remain a **guardrail/orchestration layer**, not grow into a monolithic do-everything skill. Specialized skills should handle debugging, architecture, testing, security, GitHub operations, and other domain-specific work while ForgeGuard controls workflow discipline around them.

## License

MIT License. See [`LICENSE`](LICENSE).
