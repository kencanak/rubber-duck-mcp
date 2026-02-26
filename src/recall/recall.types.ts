export type RecallInput = {
  summary: string;
  category: string;
  confidence: number;
  projectId?: string | null;

  // evidence files (relative to project root)
  files?: string[];
};

export type RecallRecord = {
  id: string;

  summary: string;
  category: string;
  confidence: number;

  projectId: string | null;
  files: string[] | null;

  reinforcementCount: number;
  contradictionCount: number;

  createdAt: number;
  lastAccessed: number;

  archived: number; // keep as number (SQLite boolean)
};

export type RecallInsert = Omit<
  RecallRecord,
  | 'id'
  | 'reinforcementCount'
  | 'contradictionCount'
  | 'createdAt'
  | 'lastAccessed'
  | 'archived'
>;

export type MemoryCategory =
  | 'preference'
  | 'architecture'
  | 'tooling'
  | 'bug'
  | 'convention'
  | 'decision';
