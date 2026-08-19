# Installation

ForgeGuard is distributed as the `engineering-guardrails/` Agent Skill directory.

The directory must be copied as a whole because `SKILL.md` references files under `references/`.

## Recommended: project-level installation

### Codex

Install into the repository-wide Agent Skills directory:

```bash
mkdir -p .agents/skills
cp -R /path/to/ForgeGuard/engineering-guardrails .agents/skills/engineering-guardrails
```

Result:

```text
<repo>/.agents/skills/engineering-guardrails/SKILL.md
```

Codex scans `.agents/skills` from the working directory up to the repository root.

Invoke explicitly with:

```text
$engineering-guardrails
```

Codex can also select the skill implicitly when the task matches its description.

### Claude Code

Install into the project skills directory:

```bash
mkdir -p .claude/skills
cp -R /path/to/ForgeGuard/engineering-guardrails .claude/skills/engineering-guardrails
```

Result:

```text
<repo>/.claude/skills/engineering-guardrails/SKILL.md
```

Invoke explicitly with:

```text
/engineering-guardrails
```

Claude Code can also load the skill automatically when relevant.

### Cursor

The portable project-level location is:

```bash
mkdir -p .agents/skills
cp -R /path/to/ForgeGuard/engineering-guardrails .agents/skills/engineering-guardrails
```

Cursor also supports `.cursor/skills/` and compatibility paths for Claude and Codex skills.

Invoke explicitly with:

```text
/engineering-guardrails
```

Cursor can also apply the skill automatically when relevant.

## User-level installation

Use a user-level location when you want ForgeGuard available across repositories.

| Client | User-level location |
|---|---|
| Codex | `~/.agents/skills/engineering-guardrails/` |
| Claude Code | `~/.claude/skills/engineering-guardrails/` |
| Cursor | `~/.agents/skills/engineering-guardrails/` or `~/.cursor/skills/engineering-guardrails/` |

Example for Codex/Cursor:

```bash
mkdir -p ~/.agents/skills
cp -R engineering-guardrails ~/.agents/skills/engineering-guardrails
```

Example for Claude Code:

```bash
mkdir -p ~/.claude/skills
cp -R engineering-guardrails ~/.claude/skills/engineering-guardrails
```

## Clone and install

```bash
git clone https://github.com/GendByteMaster/ForgeGuard.git
cd ForgeGuard
```

Then copy `engineering-guardrails/` to the appropriate skills directory above.

## Keep one source of truth

If multiple coding agents are used in the same repository, avoid maintaining diverging copies of ForgeGuard.

A practical layout is:

```text
<repo>/
├── .agents/skills/engineering-guardrails/   # Codex + Cursor
└── .claude/skills/engineering-guardrails/   # Claude Code
```

Keep both copies pinned to the same ForgeGuard release. Where symlinks are reliable in your environment, you can instead keep one canonical directory and symlink the client-specific path to it.

## Verify discovery

After installation:

1. Start or restart the coding agent if the newly created top-level skill directory is not detected.
2. Open the client's skill selector or invoke ForgeGuard explicitly.
3. Ask for a repository task such as a bug fix or refactor.
4. Confirm that ForgeGuard first inspects repository instructions and does not launch a subagent without explicit approval.

## Official documentation

- Codex Agent Skills: https://learn.chatgpt.com/docs/build-skills
- Claude Code Skills: https://code.claude.com/docs/en/slash-commands
- Cursor Agent Skills: https://cursor.com/docs/skills
