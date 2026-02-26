import db from '../db/index.js';
import type { RecallInput, RecallRecord } from './recall.types.js';
import crypto from 'crypto';

export class RecallDB {
  constructor() {
    // db already initialized in src/db/index.ts
  }

  insert(input: RecallInput): RecallRecord {
    const now = Date.now();
    const id = crypto.randomBytes(16).toString('hex');

    const stmt = db.prepare(`
      INSERT INTO memories (
        id, summary, category, confidence,
        projectId, files,
        reinforcementCount, contradictionCount,
        createdAt, lastAccessed, archived
      )
      VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?, 0)
    `);

    stmt.run(
      id,
      input.summary,
      input.category,
      input.confidence,
      input.projectId ?? null,
      input.files ? JSON.stringify(input.files) : null,
      now,
      now,
    );

    return this.getById(id)!;
  }

  getById(id: string): RecallRecord | undefined {
    const row = db.prepare('SELECT * FROM memories WHERE id = ?').get(id);
    return row ? this.mapRow(row) : undefined;
  }

  recall(projectId?: string): RecallRecord[] {
    const stmt = db.prepare(`
      SELECT * FROM memories
      WHERE archived = 0
        AND (projectId = ? OR projectId IS NULL)
      ORDER BY confidence DESC, lastAccessed DESC
    `);
    return stmt.all(projectId ?? null).map(this.mapRow);
  }

  reinforce(id: string) {
    const stmt = db.prepare(`
      UPDATE memories
      SET reinforcementCount = reinforcementCount + 1,
          confidence = (reinforcementCount + 1) / (reinforcementCount + contradictionCount + 1),
          lastAccessed = ?
      WHERE id = ?
    `);
    stmt.run(Date.now(), id);
  }

  contradict(id: string) {
    const stmt = db.prepare(`
      UPDATE memories
      SET contradictionCount = contradictionCount + 1,
          confidence = reinforcementCount / (reinforcementCount + contradictionCount + 1),
          lastAccessed = ?
      WHERE id = ?
    `);
    stmt.run(Date.now(), id);
  }

  archive(id: string) {
    db.prepare('UPDATE memories SET archived = 1 WHERE id = ?').run(id);
  }

  list(category?: string): RecallRecord[] {
    let stmt;
    if (category) {
      stmt = db.prepare(`
        SELECT * FROM memories WHERE archived = 0 AND category = ? ORDER BY confidence DESC
      `);
      return stmt.all(category).map(this.mapRow);
    } else {
      stmt = db.prepare('SELECT * FROM memories WHERE archived = 0 ORDER BY confidence DESC');
      return stmt.all().map(this.mapRow);
    }
  }

  updateMemory(id: string, updates: Partial<Pick<RecallRecord, 'files' | 'confidence' | 'lastAccessed'>>) {
    const stmt = db.prepare(`
      UPDATE memories
      SET files = ?, confidence = ?, lastAccessed = ?
      WHERE id = ?
    `);

    stmt.run(
      updates.files ? JSON.stringify(updates.files) : null,
      updates.confidence ?? 0,
      updates.lastAccessed ?? Date.now(),
      id,
    );
  }

  private mapRow(row: any): RecallRecord {
    return {
      id: row.id,
      summary: row.summary,
      category: row.category,
      confidence: row.confidence,
      projectId: row.projectId ?? null,
      files: row.files ? JSON.parse(row.files) : null,
      reinforcementCount: row.reinforcementCount,
      contradictionCount: row.contradictionCount,
      createdAt: row.createdAt,
      lastAccessed: row.lastAccessed,
      archived: row.archived,
    };
  }
}
