# Changelog

All notable changes to ForgeGuard are documented here.

## [1.5.0] - 2026-09-04

### Added

- Optional Codex subagent runtime configuration through `forgeguard install --subagents`.
- Default ForgeGuard Codex preset: `gpt-5.6-luna` with `xhigh` reasoning.
- `--subagent-model` and `--subagent-reasoning` overrides for explicit runtime selection.
- Project-level `.codex/config.toml` and global `$CODEX_HOME/config.toml` support.
- ForgeGuard-managed TOML blocks that preserve unrelated Codex configuration and custom agent subtables.
- Runtime status reporting for managed Codex subagent configuration.
- Built-in Node tests covering config creation, preservation, conflicts, idempotency, status, and uninstall cleanup.

### Changed

- Subagent authorization is now explicitly defined as permission rather than an obligation to delegate.
- The primary agent remains responsible for planning, delegation decisions, integration, conflict resolution, final verification, and the final response.
- `forgeguard uninstall` removes only ForgeGuard-managed Codex subagent values; unmanaged user defaults are never overwritten automatically.
- The Codex AGENTS managed block now states primary-agent ownership when subagents are authorized.

### Safety

- ForgeGuard refuses to overwrite existing unmanaged `agents.default_subagent_model` or `agents.default_subagent_reasoning_effort` values.
- An existing unmanaged `agents.enabled = false` is treated as a conflict rather than being silently changed.
- Runtime configuration never bypasses the existing explicit user approval gate for subagent delegation.

## [1.4.0] - 2026-08-19

### Added

- Goal Intelligence for deciding when substantial work needs an explicit measurable goal.
- Goal quality bar covering outcome, evidence, success threshold, scope boundaries, and stop/escalation conditions.
- Quantification heuristics for bugs, tests, performance, quality, research/architecture, and operations.
- Weak-goal detection for activity-only objectives such as "make progress" or "keep investigating".
- Single-question clarification discipline when missing information can materially change the outcome or validator.
- Portable existing-goal handling that reuses compatible active goal state without assuming specific goal-management tools.

### Changed

- The previous Goal Gate is now Goal Intelligence.
- Routine tasks with clear acceptance criteria continue directly without unnecessary goal overhead.
- Substantial ambiguous work is expected to use observable success criteria and explicit evidence before implementation.
- The Codex managed instruction block now activates Goal Intelligence when substantial work lacks measurable success criteria.
- CI and release workflows now accept both `master` and `main` after the repository branch rename.

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
