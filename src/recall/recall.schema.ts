export const createTables = `
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,

  summary TEXT NOT NULL,
  category TEXT NOT NULL,

  confidence REAL NOT NULL,

  reinforcementCount INTEGER DEFAULT 0,
  contradictionCount INTEGER DEFAULT 0,

  projectId TEXT,      -- NULL = global memory
  files TEXT,           -- JSON array

  createdAt INTEGER NOT NULL,
  lastAccessed INTEGER NOT NULL,

  archived INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_category
ON memories(category);

CREATE INDEX IF NOT EXISTS idx_confidence
ON memories(confidence);

CREATE INDEX IF NOT EXISTS idx_project
ON memories(projectId);
`;

export const createSearchIndexVirtualTable = `
CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
  id UNINDEXED,
  summary,
  category,
  files,
  tokenize='porter unicode61'
);
`;
