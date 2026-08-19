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

| Client | Path |
|---|---|
| Codex | `.agents/skills/engineering-guardrails/` |
| Claude Code | `.claude/skills/engineering-guardrails/` |
| Cursor | `.agents/skills/engineering-guardrails/` |

When `--client all` is used, Codex and Cursor share the same `.agents/skills` copy, so the CLI avoids duplicating those files. Claude Code receives its own `.claude/skills` copy.

### User level (`--global`)

| Client | Path |
|---|---|
| Codex | `~/.agents/skills/engineering-guardrails/` |
| Claude Code | `~/.claude/skills/engineering-guardrails/` |
| Cursor | `~/.cursor/skills/engineering-guardrails/` |

## Manual project-level installation

### Codex

```bash
mkdir -p .agents/skills
cp -R /path/to/ForgeGuard/engineering-guardrails .agents/skills/engineering-guardrails
```

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

## CLI reference

```text
forgeguard install [options]
forgeguard status [options]
forgeguard uninstall [options]
```

Options:

```text
--client <all|codex|claude|cursor>
--global
--force
--dry-run
--help
--version
```

## Verify discovery

After installation:

1. Start or restart the coding agent if the new skill is not detected.
2. Open the client's skill selector or invoke ForgeGuard explicitly.
3. Ask for a repository task such as a bug fix or refactor.
4. Confirm that ForgeGuard first inspects repository instructions.
5. Confirm that it does not launch a subagent without explicit approval.
6. For consequential operations, confirm that it assigns a Risk Gate classification before execution.

## Official documentation

- Codex Agent Skills: https://learn.chatgpt.com/docs/build-skills
- Claude Code Skills: https://code.claude.com/docs/en/slash-commands
- Cursor Agent Skills: https://cursor.com/docs/skills
- npm package `bin` field: https://docs.npmjs.com/cli/v11/configuring-npm/package-json#bin
- npm package specifications: https://docs.npmjs.com/cli/v11/using-npm/package-spec
