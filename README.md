# rubber-duck-mcp

## Available tools
1. duck-recall

A project-specific, persistent developer memory system. It allows developers and AI assistants like Claude to store, recall, and manage important project knowledge across sessions. Think of it as a “Rubber Duck” that remembers key decisions, conventions, debugging discoveries, and tooling preferences for your project — so you don’t have to repeat yourself.

- why?

  - Captures institutional knowledge: Store decisions about architecture, tooling, or coding conventions.
  - Speeds up onboarding: New team members or assistants can recall previous decisions instantly. (THOUGH, it's still stored in local db - to be evolved)
  - Reduces repetition: Avoid re-explaining recurring problems or solutions.
  - Supports AI-assisted development: AI agents can recall relevant memories to provide smarter suggestions and context-aware guidance.

- How?

  - Store Memory: You or an AI can store a memory with a summary, category, confidence, and optionally files to reference.
  - Recall Memory: Memories can be retrieved for the current project, sorted by confidence and recent usage.
  - Search Memory: Memories can be search by query. this way, we avoid using all search result as token
  - Reinforce or Contradict: Update confidence based on confirmations or corrections, keeping the memory relevant.
  - Archive: Retire outdated or irrelevant memories.
  - Everything is scoped per project, so memories are automatically relevant to the current working directory without needing global identifiers. This allows AI assistants to provide context-aware responses and maintain a persistent understanding of project-specific knowledge.

- with Claude:
    we set a base prompt. available in `.claude/claude.md`

## Running rubber-duck-mcp locally
1. clone repo `git@github.com:kencanak/rubber-duck-mcp.git`
2. rename `.mcp.json.sample` > `.mcp.json`, then copy it to your respective project folder. which ever project that you want to use this mcp server with

    * update the path of the mcp server

    ```json
    {
      "mcpServers": {
        "rubber-duck": {
          "command": "bash",
          "args": ["-c", "./run.sh"],
          "cwd": "[PATH TO LOCAL MCP SERVER]"
        }
      }
    }
    ```
3. start claude in vscode, but before that, make sure you are running node 24. at least node 16 and above
4. [video ref](https://github.com/kencanak/rubber-duck-mcp/raw/refs/heads/main/docs-assets/running-rubber-duck-mcp.mov)
