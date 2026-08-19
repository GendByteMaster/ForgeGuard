# Changelog

All notable changes to ForgeGuard are documented here.

## [1.3.0] - 2026-08-19

### Added

- Commit Intelligence for evidence-driven git diff analysis.
- Mandatory structured commit `Description` for every prepared commit output.
- Explicit `Changes`, `Reason`, `Implementation Details`, `Impact / Risks`, and `Breaking Changes` sections.
- Detection of materially unrelated changes with guidance to split commits when appropriate.

### Changed

- Commit preparation now treats the real diff as the primary source of truth.
- Commit subjects remain Conventional Commit based and are limited to 72 characters unless the repository is stricter.
- `Reason` is emitted only when inferable from the diff or explicit task context; otherwise ForgeGuard states that the reason is not inferable.
- Verification, security, compatibility, performance, deployment, and breaking-change claims require supporting evidence.
- The mandatory `Description` can no longer be omitted even when the user requests only a commit message.

## [1.2.0] - 2026-08-19

### Added

- Automatic Codex instruction integration during `forgeguard install`.
- Idempotent managed ForgeGuard block in the active `AGENTS.md` or `AGENTS.override.md` file.
- Automatic cleanup of the managed block during `forgeguard uninstall` without deleting unrelated instructions.
- `forgeguard status` reporting for AGENTS integration.
- `--no-agents` flag to disable automatic instruction-file management.
- Global Codex instruction support through `CODEX_HOME` (or `~/.codex` by default).

### Behavior

- If a non-empty `AGENTS.override.md` exists, ForgeGuard uses it because Codex gives it precedence over `AGENTS.md` in the same directory.
- Project installation manages the current repository's instruction file; global installation manages the Codex home instruction file.
- ForgeGuard tells the user to start a new Codex session after installation so the updated instructions are loaded.

## [1.1.0] - 2026-08-19

### Added

- Risk Gate with `Low`, `Medium`, `High`, and `Critical` classifications.
- Explicit safety handling for migrations, destructive data operations, auth/security and cryptography changes, billing, production deployments, and breaking contracts.
- npm-compatible CLI package manifest (`@gendbytemaster/forgeguard`).
- `forgeguard install`, `status`, and `uninstall` commands.
- Client targeting for Codex, Claude Code, Cursor, or all supported clients.
- Project-level and user-level (`--global`) installation.
- `--force` and `--dry-run` installer controls.
- Direct GitHub execution through `npx github:GendByteMaster/ForgeGuard` before npm registry publication.

### Changed

- ForgeGuard completion reporting now includes risk classification for Medium/High/Critical work when relevant.
- Skill metadata version bumped to `1.1.0`.

## [1.0.0] - 2026-08-19

### Added

- Initial public release of ForgeGuard.
- Portable `engineering-guardrails` Agent Skill.
- Repository discovery and instruction-awareness policy.
- GSD-aware workflow selection without making GSD a dependency.
- Goal gate for substantial ambiguous work.
- Explicit user-approval requirement before subagent delegation.
- Scoped implementation and evidence-based verification rules.
- Diff-grounded Conventional Commit guidance.
- Installation documentation for Codex, Claude Code, and Cursor.
- Compatibility matrix and usage examples.

### Design

ForgeGuard is intentionally a guardrail/orchestration layer rather than a monolithic coding framework. Specialized skills remain responsible for domain work such as debugging, security, architecture, testing, and repository-host operations.
