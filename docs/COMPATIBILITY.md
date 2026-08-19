# Compatibility

ForgeGuard follows the portable Agent Skills model: a directory containing `SKILL.md` plus optional supporting resources.

## Compatibility matrix

| Client | Status | Project path | User/global path | Explicit invocation |
|---|---|---|---|---|
| OpenAI Codex | Supported | `.agents/skills/engineering-guardrails/` | `~/.agents/skills/engineering-guardrails/` | `$engineering-guardrails` |
| Claude Code | Supported | `.claude/skills/engineering-guardrails/` | `~/.claude/skills/engineering-guardrails/` | `/engineering-guardrails` |
| Cursor | Supported | `.agents/skills/engineering-guardrails/` or `.cursor/skills/engineering-guardrails/` | `~/.cursor/skills/engineering-guardrails/` | `/engineering-guardrails` |

## Notes

### Codex

ForgeGuard uses only portable `SKILL.md` instructions and relative references. It does not require a Codex-only extension.

### Claude Code

Claude Code follows the Agent Skills standard and supports supporting files next to `SKILL.md`. ForgeGuard intentionally does not set `context: fork` or automatically opt into subagent execution because its policy requires explicit user authorization before delegation.

### Cursor

Cursor supports Agent Skills and project-level `.agents/skills/`. `.cursor/skills/` is also supported. For global installation, `~/.cursor/skills/` is the conservative default.

Some Cursor releases have had skill-discovery/injection bugs even when a skill appears in Settings or the slash menu. If ForgeGuard is installed but automatic invocation is unreliable, invoke `/engineering-guardrails` explicitly and verify that the skill appears under Cursor Settings → Rules, Skills, Subagents.

## Portability contract

ForgeGuard must remain usable without assuming:

- a particular programming language or framework;
- GSD availability;
- a particular package manager;
- a particular CI system;
- subagent support;
- persistent goal-management tools;
- GitHub as the repository host.

Client-specific behavior should stay in documentation or optional adapters, not in the core policy unless required for correctness.
