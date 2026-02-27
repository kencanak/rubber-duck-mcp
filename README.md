# rubber-duck-mcp
I am your persistent, project-aware coding assistant. It helps developers remember, automate, and orchestrate project tasks. (eventually, ha)

think of it as a smart rubber duck for your code — it listens, remembers, and helps you get things done efficiently.


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
4. [video ref](https://github.com/kencanak/rubber-duck-mcp/raw/refs/heads/main/docs-assets/demo.mov)

## Available tools
### 1. duck-recall

A project-specific, persistent developer memory system. It allows developers and AI assistants like Claude to store, recall, and manage important project knowledge across sessions. Think of it as a “Rubber Duck” that remembers key decisions, conventions, debugging discoveries, and tooling preferences for your project — so you don’t have to repeat yourself.

#### a. why?

  - Captures institutional knowledge: Store decisions about architecture, tooling, or coding conventions.
  - Speeds up onboarding: New team members or assistants can recall previous decisions instantly. (THOUGH, it's still stored in local db - to be evolved)
  - Reduces repetition: Avoid re-explaining recurring problems or solutions.
  - Supports AI-assisted development: AI agents can recall relevant memories to provide smarter suggestions and context-aware guidance.

#### b. how?

  - store memory: You or an AI can store a memory with a summary, category, confidence, and optionally files to reference.
  - Recall Memory: Memories can be retrieved for the current project, sorted by confidence and recent usage.
  - Search Memory: Memories can be search by query. this way, we avoid using all search result as token
  - Reinforce or Contradict: Update confidence based on confirmations or corrections, keeping the memory relevant.
  - Archive: Retire outdated or irrelevant memories.
  - Everything is scoped per project, so memories are automatically relevant to the current working directory without needing global identifiers. This allows AI assistants to provide context-aware responses and maintain a persistent understanding of project-specific knowledge.

#### c. with Claude:
    we set a base prompt. available in `.claude/claude.md`

#### d. motivation behind this:
  - instead of writing memory into a markdown file, i find it cleaner if we store it into DB
  - which then can be evolved to vectorised db, a vectorized DB stores embedding vectors of memory content and allows semantic similarity search rather than literal text match. but of course, this comes with complexity
  - hoping that we can use less token? ha

#### 2. TODO:
add a couple more tools:
1. parallel development orchestration hub - where each “agent” is a lightweight process acting on a separate workspace (Git worktree) to perform parallel tasks.
  - Each agent gets its own Git worktree (or branch) to avoid conflicts.
  - MCP orchestrates agents with a task queue:
    - lint & fix
    - feature development
    - bug investigation
    - test & deploy
  - Agents can read project memory from Duck-Recall and update it if needed.
  - Results are PRs
2. create a workflow runner?
3. task scheduler?
  - daily code analysis: run linters, tests, and code complexity reports every night.
  - memory cleanup: archive or reinforce old duck-recall memories periodically.
  - auto-deploy branches: on commit to a staging branch, trigger workflow that builds and deploys.

