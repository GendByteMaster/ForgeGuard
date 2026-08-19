# Goal Definition Policy

Use this reference only when persistent goal-management capabilities are available or the user explicitly requests goal-backed work.

## Decision process

1. Inspect existing goal state before creating new persistent goal state, when the environment supports this.
2. Reuse an unfinished matching goal when appropriate.
3. If an unfinished goal materially conflicts with the new request, surface the conflict and let the user choose whether to complete, replace, or abandon it.
4. Create a new persistent goal only when no suitable unfinished goal exists.
5. Never set a token budget for the goal unless the user explicitly requests one.

## Required goal content

Define:

- desired outcome;
- in-scope work;
- out-of-scope work;
- completion evidence;
- success threshold;
- stop/escalation conditions.

## Portability rule

Do not call tool names such as `get_goal` or `create_goal` unless those tools actually exist in the current environment. If they do not exist, keep the goal definition in the current task context or use the repository's own planning mechanism.
