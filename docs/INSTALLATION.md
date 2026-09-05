# Installation

ForgeGuard is distributed as the `engineering-guardrails/` Agent Skill directory and as an npm-compatible CLI package.

## Fastest installation with npx

Install ForgeGuard for Codex, Claude Code, and Cursor in the current repository directly from GitHub:

```bash
npx --yes github:GendByteMaster/ForgeGuard install
```

Check status:

```bash
npx --yes github:GendByteMaster/ForgeGuard status
```

Remove it:

```bash
npx --yes github:GendByteMaster/ForgeGuard uninstall
```

Install for one client only:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex
npx --yes github:GendByteMaster/ForgeGuard install --client claude
npx --yes github:GendByteMaster/ForgeGuard install --client cursor
```

Install into user-level skill directories:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --global
```

Preview without changing files:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --dry-run
```

Replace an existing installation:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --force
```

### `npx` does not install a permanent `forgeguard` command

`npx --yes github:GendByteMaster/ForgeGuard ...` downloads/runs the ForgeGuard CLI for that invocation. It does **not** make `forgeguard` a permanent command in your shell.

After using `npx`, continue using the full `npx` form:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --subagents --global --force
npx --yes github:GendByteMaster/ForgeGuard status --client codex --global
```

If you want to type `forgeguard` directly, install the CLI globally from GitHub:

```bash
npm install --global github:GendByteMaster/ForgeGuard
forgeguard --version
```

On Windows, reopen the terminal if the npm global `bin` directory was added to `PATH` after the current shell started.

The ForgeGuard flag `--global` is unrelated to npm global CLI installation. It means **install the ForgeGuard skill/configuration into user-level locations instead of the current repository**.

In other words:

```text
npm install --global ...   -> makes the forgeguard CLI available as a command
forgeguard ... --global    -> targets user-level ForgeGuard/Codex files
```

## Codex subagent runtime preset — v1.5.0+

ForgeGuard can optionally configure Codex runtime defaults for authorized subagents.

Enable the default project-level preset:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --subagents
```

The default preset is:

```toml
[agents]
enabled = true
default_subagent_model = "gpt-5.6-luna"
default_subagent_reasoning_effort = "xhigh"
```

Project-level runtime configuration is written to:

```text
./.codex/config.toml
```

For a global Codex preset:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --global --subagents
```

Global runtime configuration is written to `$CODEX_HOME/config.toml`, or `~/.codex/config.toml` when `CODEX_HOME` is not set.

A normal ForgeGuard install does **not** change Codex subagent runtime settings. Runtime configuration is applied only when `--subagents`, `--subagent-model`, or `--subagent-reasoning` is explicitly supplied.

### Custom subagent defaults

Override the model or reasoning effort explicitly:

```bash
npx --yes github:GendByteMaster/ForgeGuard install \
  --client codex \
  --subagent-model gpt-5.6-luna \
  --subagent-reasoning xhigh
```

If the CLI was installed permanently, the equivalent shorter form is:

```bash
forgeguard install \
  --client codex \
  --subagent-model gpt-5.6-luna \
  --subagent-reasoning xhigh
```

`--subagents` is a convenience preset for `gpt-5.6-luna` with `xhigh` reasoning.

### Safe config management

ForgeGuard manages only its own marked block in the top-level `[agents]` table. It preserves unrelated Codex settings and custom `[agents.<role>]` tables.

An existing `[agents]` table is **not automatically a conflict**. ForgeGuard reuses it and preserves unrelated keys.

For example, a Codex configuration created by GSD may already contain:

```toml
# GSD Agent Configuration — managed by gsd-core installer
[agents]
max_depth = 1
```

This is compatible with ForgeGuard. Running:

```bash
npx --yes github:GendByteMaster/ForgeGuard install --client codex --subagents --global --force
```

can produce a shared table like:

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

ForgeGuard does not remove or take ownership of `max_depth = 1`. The same preservation rule applies to unrelated direct `[agents]` keys such as concurrency limits and to custom `[agents.<role>]` subtables.

ForgeGuard refuses to overwrite unmanaged conflicting values for:

- `default_subagent_model`;
- `default_subagent_reasoning_effort`;
- `enabled = false`.

An unmanaged `enabled = true` can be reused. Resolve actual conflicting values manually before enabling the managed preset.

`forgeguard uninstall` removes the ForgeGuard-managed subagent runtime block. User/GSD-owned values such as `max_depth = 1` remain.

Use `--no-subagent-config` when uninstalling the skill but intentionally keeping the managed Codex runtime block.

### Understanding `unmanaged codex subagents`

`forgeguard status` may report a line such as:

```text
unmanaged codex subagents: C:\Users\you\.codex\config.toml
```

This means ForgeGuard found a Codex config path but did **not** find a ForgeGuard-managed subagent block there. By itself, this status does **not** mean the config is incompatible or broken.

For example, a file containing only:

```toml
[agents]
max_depth = 1
```

is unmanaged but compatible.

To distinguish a compatible existing config from a real conflict:

1. Inspect `$CODEX_HOME/config.toml` or `~/.codex/config.toml`.
2. Check whether the existing `[agents]` table owns any of ForgeGuard's managed keys.
3. Run the desired `install --subagents` command. ForgeGuard reports a specific error instead of silently replacing a conflicting unmanaged value.

### Authorization semantics

Runtime configuration does not bypass ForgeGuard's manual approval gate.

If the user says that subagents may be used, that grants permission to delegate when useful. It does not require the primary agent to spawn a subagent. The primary agent remains responsible for planning, integration, conflict resolution, verification, and the final response.

## npm registry commands

After `@gendbytemaster/forgeguard` is published to the npm registry:

```bash
npx @gendbytemaster/forgeguard install
```

or install the CLI globally:

```bash
npm install --global @gendbytemaster/forgeguard
forgeguard install
```

The package requires Node.js 18 or newer and has no runtime dependencies.

## Installation targets

### Project level

| Client | Skill path | Optional runtime config |
|---|---|---|
| Codex | `.agents/skills/engineering-guardrails/` | `.codex/config.toml` with explicit subagent options |
| Claude Code | `.claude/skills/engineering-guardrails/` | Not managed by ForgeGuard v1.6.0 |
| Cursor | `.agents/skills/engineering-guardrails/` | Not managed by ForgeGuard v1.6.0 |

When `--client all` is used, Codex and Cursor share the same `.agents/skills` copy, so the CLI avoids duplicating those files. Claude Code receives its own `.claude/skills` copy.

### User level (`--global`)

| Client | Skill path | Optional runtime config |
|---|---|---|
| Codex | `~/.agents/skills/engineering-guardrails/` | `$CODEX_HOME/config.toml` or `~/.codex/config.toml` |
| Claude Code | `~/.claude/skills/engineering-guardrails/` | Not managed by ForgeGuard v1.6.0 |
| Cursor | `~/.cursor/skills/engineering-guardrails/` | Not managed by ForgeGuard v1.6.0 |

## Manual project-level installation

### Codex

```bash
mkdir -p .agents/skills
cp -R /path/to/ForgeGuard/engineering-guardrails .agents/skills/engineering-guardrails
```

Manual skill installation does not configure the optional Codex subagent runtime preset. Use the ForgeGuard CLI for managed `.codex/config.toml` integration.

### Claude Code

```bash
mkdir -p .claude/skills
cp -R /path/to/ForgeGuard/engineering-guardrails .claude/skills/engineering-guardrails
```

### Cursor

```bash
mkdir -p .agents/skills
cp -R /path/to/ForgeGuard/engineering-guardrails .agents/skills/engineering-guardrails
```

## Clone and install

```bash
git clone https://github.com/GendByteMaster/ForgeGuard.git
cd ForgeGuard
node bin/forgeguard.js install
```

Enable the Codex Luna/xhigh preset from a clone:

```bash
node bin/forgeguard.js install --client codex --subagents
```

## CLI reference

```text
forgeguard install [options]
forgeguard status [options]
forgeguard uninstall [options]
```

The `forgeguard` command in this reference assumes a permanent CLI installation. When running directly from GitHub without installing the CLI, prefix commands with:

```text
npx --yes github:GendByteMaster/ForgeGuard
```

Options:

```text
--client <all|codex|claude|cursor>
--global
--force
--no-agents
--subagents
--subagent-model <model>
--subagent-reasoning <effort>
--no-subagent-config
--dry-run
--help
--version
```

Subagent runtime options require Codex to be among the selected clients.

## Verify discovery and runtime configuration

After installation:

1. Start or restart the coding agent if the new skill is not detected.
2. Open the client's skill selector or invoke ForgeGuard explicitly.
3. Ask for a repository task such as a bug fix or refactor.
4. Confirm that ForgeGuard first inspects repository instructions.
5. Confirm that it does not launch a subagent without explicit approval.
6. If `--subagents` was used, run `npx --yes github:GendByteMaster/ForgeGuard status --client codex` (or `forgeguard status --client codex` after a permanent CLI install) and confirm the managed model is `gpt-5.6-luna` with `xhigh` reasoning.
7. Give the primary agent explicit permission to use subagents and confirm that delegation remains optional rather than mandatory.
8. For consequential operations, confirm that ForgeGuard assigns a Risk Gate classification before execution.

## Official documentation

- Codex Agent Skills: https://learn.chatgpt.com/docs/build-skills
- Claude Code Skills: https://code.claude.com/docs/en/slash-commands
- Cursor Agent Skills: https://cursor.com/docs/skills
- npm package `bin` field: https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin
- npm package specifications: https://docs.npmjs.com/cli/v11/using-npm/package-spec

## Delegation Intelligence - v1.6.0

The portable policy adds scoped authorization reuse, active evaluation of useful parallel work, bounded worker contracts, primary-agent ownership, instruction resolution, and verification calibrated to risk. Authorization is permission, not mandatory delegation. Default depth is 1; workers must not spawn subagents under this policy. Clients without worker support continue locally.

No new CLI flags or runtime behavior are introduced. The Luna + xhigh preset and the user's primary model remain unchanged. Runtime availability is not user authorization; there is no automatic model routing.

See [delegation policy](../engineering-guardrails/references/delegation-intelligence.md) and [usage scenarios](../examples/USAGE.md#13-small-task-with-authorization).

Upgrade with `npx --yes github:GendByteMaster/ForgeGuard install --force` (add `--global` for an existing global installation). If the CLI was installed permanently, `forgeguard install --force` is equivalent. This refreshes the skill references and the concise managed Codex AGENTS block without changing runtime settings. Restart the coding-agent session to load the new instructions.

Validate scoped approval: authorize review only, confirm the agent reuses that approval within the review, and confirm it does not expand to implementation workers. For a small task, confirm that it can choose local work even with authorization.
