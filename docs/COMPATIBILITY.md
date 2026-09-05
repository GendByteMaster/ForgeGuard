# Compatibility

ForgeGuard follows the portable Agent Skills model: a directory containing `SKILL.md` plus optional supporting resources.

ForgeGuard v1.6.0 adds portable Delegation Intelligence while retaining the optional Codex-specific runtime adapter introduced in v1.5.0.

## Compatibility matrix

| Client | Status | Project skill path | User/global skill path | Explicit invocation | Managed subagent runtime |
|---|---|---|---|---|---|
| OpenAI Codex | Supported | `.agents/skills/engineering-guardrails/` | `~/.agents/skills/engineering-guardrails/` | `$engineering-guardrails` | Supported via `.codex/config.toml` / `$CODEX_HOME/config.toml` |
| Claude Code | Supported | `.claude/skills/engineering-guardrails/` | `~/.claude/skills/engineering-guardrails/` | `/engineering-guardrails` | Not managed in v1.6.0 |
| Cursor | Supported | `.agents/skills/engineering-guardrails/` or `.cursor/skills/engineering-guardrails/` | `~/.cursor/skills/engineering-guardrails/` | `/engineering-guardrails` | Not managed in v1.6.0 |

## Notes

### Codex

The core ForgeGuard skill uses portable `SKILL.md` instructions and relative references.

Codex additionally supports optional ForgeGuard-managed runtime defaults for subagents. They are enabled only when the user explicitly installs with `--subagents`, `--subagent-model`, or `--subagent-reasoning`.

The default preset is:

```toml
[agents]
enabled = true
default_subagent_model = "gpt-5.6-luna"
default_subagent_reasoning_effort = "xhigh"
```

Project scope uses `.codex/config.toml`. Global scope uses `$CODEX_HOME/config.toml`, or `~/.codex/config.toml` when `CODEX_HOME` is not set.

ForgeGuard preserves unrelated Codex configuration and custom `[agents.<role>]` tables. It does not automatically overwrite unmanaged conflicting subagent defaults.

The runtime preset is only a default for spawned subagents. A primary Codex agent such as `gpt-5.6-sol` remains the primary agent unless the user or runtime explicitly changes it.

ForgeGuard's policy layer remains authoritative for delegation decisions: explicit user authorization allows subagent use but does not require it. The primary agent remains responsible for planning, integration, verification, and the final response.

#### Coexistence with GSD and existing `[agents]` settings

ForgeGuard does not require ownership of the whole Codex `[agents]` table. It owns only the values inside its marked managed block.

A third-party or user-owned setting such as:

```toml
# GSD Agent Configuration — managed by gsd-core installer
[agents]
max_depth = 1
```

is compatible with ForgeGuard. Enabling the ForgeGuard preset can share the same table:

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

ForgeGuard preserves `max_depth`, unrelated direct `[agents]` keys, and custom `[agents.<role>]` tables. Uninstall removes only the ForgeGuard-managed block.

Actual conflicts are limited to unmanaged values that overlap ForgeGuard's managed runtime keys:

- `default_subagent_model`;
- `default_subagent_reasoning_effort`;
- `enabled = false`.

An unmanaged `enabled = true` can be reused rather than duplicated.

The status text `unmanaged codex subagents: <path>` means ForgeGuard found a Codex configuration file without a ForgeGuard-managed runtime block. It does **not** by itself mean the existing configuration is incompatible. A configuration containing only `max_depth = 1`, for example, is unmanaged but compatible.

### Claude Code

Claude Code follows the Agent Skills standard and supports supporting files next to `SKILL.md`. ForgeGuard intentionally does not set `context: fork` or automatically opt into subagent execution because its policy requires explicit user authorization before delegation.

ForgeGuard v1.6.0 does not modify Claude Code runtime/model configuration.

### Cursor

Cursor supports Agent Skills and project-level `.agents/skills/`. `.cursor/skills/` is also supported. For global installation, `~/.cursor/skills/` is the conservative default.

Some Cursor releases have had skill-discovery/injection bugs even when a skill appears in Settings or the slash menu. If ForgeGuard is installed but automatic invocation is unreliable, invoke `/engineering-guardrails` explicitly and verify that the skill appears under Cursor Settings → Rules, Skills, Subagents.

ForgeGuard v1.6.0 does not modify Cursor runtime/model configuration.

## Runtime compatibility behavior

ForgeGuard deliberately avoids assuming that every supported client exposes the same agent or model configuration surface.

For Codex runtime configuration:

- `--subagents` selects the ForgeGuard Luna/xhigh preset;
- `--subagent-model` and `--subagent-reasoning` allow explicit overrides;
- runtime settings are not changed during a normal install;
- compatible existing `[agents]` settings are preserved;
- unmanaged conflicting defaults cause a clear error instead of silent replacement;
- uninstall removes only ForgeGuard-managed runtime content unless `--no-subagent-config` is used.

If a selected Codex runtime does not support a configured model or reasoning effort, the runtime itself remains the final compatibility authority. ForgeGuard should report the incompatibility rather than silently falling back to another model.

## CLI invocation compatibility

Running ForgeGuard through:

```bash
npx --yes github:GendByteMaster/ForgeGuard ...
```

is a one-shot CLI invocation. It does not install a permanent `forgeguard` executable into the shell's PATH.

To use the direct command permanently from the GitHub source package:

```bash
npm install --global github:GendByteMaster/ForgeGuard
forgeguard --version
```

The ForgeGuard `--global` flag is a target-scope option for user-level skill/config paths; it is not a replacement for `npm install --global`.

## Portability contract

ForgeGuard must remain usable without assuming:

- a particular programming language or framework;
- GSD availability;
- a particular package manager;
- a particular CI system;
- subagent support;
- persistent goal-management tools;
- GitHub as the repository host.

Client-specific adapters must remain optional and must not weaken the portable core policy. Unsupported clients should still receive the core skill without being forced into Codex-specific configuration.

## Delegation Intelligence - v1.6.0

The portable policy adds scoped authorization reuse, active evaluation of useful parallel work, bounded worker contracts, primary-agent ownership, instruction resolution, and verification calibrated to risk. Authorization is permission, not mandatory delegation. Default depth is 1; workers must not spawn subagents under this policy. Clients without worker support continue locally.

No new CLI flags or runtime behavior are introduced. The Luna + xhigh preset and the user's primary model remain unchanged. Runtime availability is not user authorization; there is no automatic model routing.

See [delegation policy](../engineering-guardrails/references/delegation-intelligence.md) and [usage scenarios](../examples/USAGE.md#13-small-task-with-authorization).
