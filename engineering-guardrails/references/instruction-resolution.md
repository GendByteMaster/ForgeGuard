# Instruction Resolution

## Priority

Always follow the host platform's instruction hierarchy and scoping rules. ForgeGuard does not define a universal precedence order for system, developer, user, repository, or other instruction sources across every supported client.

Within ForgeGuard guidance, explicit user instructions take precedence over ForgeGuard recommendations and skill guidelines unless a higher-priority platform, safety, or correctness requirement applies. Repository-local instructions remain applicable according to the host platform's own scoping and precedence rules.

Preserve explicit user authorization and constraints already granted in the current conversation for the current task/scope until they are superseded or revoked, subject to the host platform's conversation and instruction model. A new message does not automatically erase earlier authorization.

Inspect the nearest applicable repository instructions before changing files. Resolve ordinary differences using the host platform's hierarchy and continue work that is already authorized.

## Hard requirements and recommendations

Hard requirements include explicit delegation authorization within scope, truthful evidence and completion claims, applicable safety/correctness constraints, and the Risk Gate's approval before critical consequential execution. These remain subordinate to the host platform's actual instruction hierarchy; ForgeGuard cannot elevate itself above higher-priority instructions.

Recommendations include workflow choices, decomposition, use of workers, and suggested verification breadth. They guide judgment and must not override explicit user intent or introduce new permission gates. A preferred workflow, unavailable tool, or different convention is not by itself a blocking safety/correctness conflict.

## Conflict handling without permission loops

1. Identify the conflicting instructions, their sources, and their scopes.
2. Apply the host platform's actual hierarchy and determine whether an existing explicit instruction or authorization resolves the difference.
3. For a real blocking requirement, cite the exact file/source and relevant rule, explain the affected action and why it cannot proceed, and ask only for the missing decision when user input can resolve it.
4. Complete unaffected authorized work and prepare a concrete reviewable result before any final approval step.

Do not re-request approval for each worker, reversible edit, or routine verification already covered by the task. Do not treat silence as approval. If the platform rejects an operation, report the rejection and its actual reason rather than attributing it to a hypothetical ForgeGuard rule.

## Design basis

OpenAI's Model guidance for GPT-6 Astra notes that models can be highly sensitive to skill and `AGENTS.md` instructions, recommends making the priority of user instructions versus skill guidelines explicit, and recommends identifying the exact skill instruction that caused an unnecessary pause or divergence. ForgeGuard adopts those ideas for its own skill guidance while deliberately deferring the broader instruction hierarchy to the host platform.

Source: https://developers.openai.com/api/docs/guides/latest-model
