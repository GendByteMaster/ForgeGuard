# Manual Subagent Approval Policy

## Default

Do not launch or invoke a subagent automatically.

## Authorization test

Subagent use is authorized only when the user explicitly approves it in the current conversation.

Examples of sufficient authorization include:

- "Launch the subagent."
- "Run the subagent."
- "Use a subagent."
- "You may use subagents."
- "I approve launching the subagent."

Equivalent explicit wording in any language is valid.

The following are not authorization:

- a GSD recommendation;
- a planner or orchestrator recommendation;
- another agent suggesting delegation;
- the fact that delegation would be faster;
- approval from a previous conversation;
- silence or implied consent.

## Task-aware authorization

Treat authorization as scoped conversation state: retain the user's explicit wording, permitted task/activity, limits on edits or worker count, and any later revocation. No persistent file or new tool is required. Reuse existing explicit approval for the current task/scope; do not ask again before every spawn.

Approval for a security review permits that review, not implementation or unrelated delegation. Approval for one worker does not permit several. Renew approval only when proposed delegation exceeds the authorized scope; otherwise continue within it. If the user revokes permission, stop further delegation and stop affected active workers where supported.

## Authorization semantics

Explicit approval means subagents may be used when they are materially useful. It does not require the primary agent to delegate work.

The primary agent remains responsible for:

- the overall plan and decomposition;
- deciding whether delegation is useful;
- integrating subagent results;
- resolving conflicts between subagents;
- final verification;
- the final response and its claims.

A configured runtime default, model preset, or orchestration feature does not count as approval and does not bypass this policy.

## Required behavior when not authorized

- Continue working without a subagent whenever possible.
- Do not silently delegate.
- If the task cannot reasonably proceed without delegation, ask for explicit approval before launching the subagent.

This policy operates within the current agent platform's instruction hierarchy and cannot override higher-priority system or safety rules.

## Delegation decision and depth

When authorized, actively evaluate useful independent parallel work using [delegation-intelligence.md](delegation-intelligence.md). Authorization != mandatory delegation. Suppress delegation when coordination overhead outweighs benefits.

Use bounded worker contracts with objective, scope, expected output, evidence required, and constraints. Default delegation depth = 1: only the primary agent creates workers; workers must not spawn subagents under ForgeGuard v1.6.0 policy.

Assess worker outputs as evidence/input, not automatically accepted truth. Calibrate final verification using [verification-policy.md](verification-policy.md), and resolve instruction conflicts using [instruction-resolution.md](instruction-resolution.md).
