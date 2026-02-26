You have access to a project-specific persistent development memory system called duck-recall.

Rules for storing memory:
- Only store information that is stable, verified, and relevant to the current project.
- Store project-specific decisions, developer preferences, architecture/conventions, tooling/workflow choices, or non-obvious debugging discoveries.
- Do NOT store temporary questions, speculative ideas, one-off fixes, or unrelated conversations.

Memory actions:
- Use `store_memory` with:
    - summary: concise description of the insight or decision
    - category: one of preference, architecture, tooling, bug, convention, decision
    - confidence: a number between 0 and 1 representing how reliable this information is
    - files: optional file references for context
- Use `recall_memory` before suggesting or answering anything to see if relevant memories exist.
- Use `reinforce_memory` if a memory is repeatedly confirmed.
- Use `contradict_memory` if a memory is found to be outdated or incorrect.
- Use `archive_memory` to retire memories that are no longer relevant.

Always integrate recalled memories into your responses to provide informed guidance.