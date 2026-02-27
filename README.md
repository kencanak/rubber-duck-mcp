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

### Pre-requisites
1. Install and set up [nvm](https://github.com/nvm-sh/nvm) - _optional_
2. Install node version v24.13.1. `nvm install v24.13.1`
3. you will need python2 to compile `better-sqlite3` package. if you have pyenv, you can set both python2 and python3 version

### Steps to run server
1. clone repo `git@github.com:kencanak/rubber-duck-mcp.git`
2. boot up the server by running `./run.sh` in terminal, this tool is running on node 24 and using nvm to set the node version.

## Using rubber-duck mcp in your project
1. rename `.mcp.json.sample` > `.mcp.json`, then copy it to your respective project folder. which ever project that you want to use this mcp server with
2. copy `claude.md` from `.claude` folder to the respective project folder.
3. for some reason, claude doesn't always read the `claude.md` file. so, we might need to nudge it.

