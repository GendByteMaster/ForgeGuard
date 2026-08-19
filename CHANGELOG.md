# Changelog

All notable changes to ForgeGuard are documented here.

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
