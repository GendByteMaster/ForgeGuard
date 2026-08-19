# Git Diff Analysis and Conventional Commit Policy

Use this reference when analyzing a git diff or preparing a commit message/description.

## 1. Analyze the diff

Determine the primary change type from the actual diff:

- `feat` — new user-visible or developer-facing capability;
- `fix` — bug fix;
- `refactor` — code restructuring without intended behavior change;
- `perf` — performance improvement;
- `docs` — documentation only;
- `style` — formatting/style-only change;
- `test` — tests only or primarily test changes;
- `chore` — maintenance that does not fit the categories above.

Use another Conventional Commit type only when it more accurately matches the repository's established convention.

## 2. Commit subject

Format:

`<type>(<scope>): <short summary>`

The scope is optional when it is not clear or useful.

Rules:

- maximum 72 characters unless the repository defines a stricter limit;
- imperative mood;
- concise and specific;
- no claims unsupported by the diff.

## 3. Commit description

Unless the user asks for subject-only output, provide:

```text
Description:
- Changes:
  - ...

- Reason:
  - ...

- Implementation Details:
  - ...

- Impact / Risks:
  - ...

- Breaking Changes:
  - None
```

Rules:

- `Changes`: list concrete files, logic, contracts, or structure changed by the diff.
- `Reason`: include only when inferable from the diff or supplied task context; otherwise say that the reason is not inferable from the diff.
- `Implementation Details`: describe important technical decisions visible in the diff.
- `Impact / Risks`: identify plausible direct effects supported by the change; do not invent speculative production incidents.
- `Breaking Changes`: describe actual breaking changes; otherwise write `None`.

## 4. Accuracy rules

- Do not invent functionality not present in the diff.
- Do not say tests passed unless test evidence is available.
- Do not infer a migration, deployment, benchmark, security improvement, or compatibility guarantee unless supported by evidence.
- When the diff contains unrelated changes, mention that and consider whether multiple commits would be cleaner.

Default commit output language: clear professional English, unless the user requests another language.
