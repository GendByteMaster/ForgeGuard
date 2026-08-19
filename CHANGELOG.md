# Changelog

All notable changes to ForgeGuard are documented here.

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
