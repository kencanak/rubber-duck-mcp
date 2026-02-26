import { RecallDB } from './recall.db.js';
import type { RecallInput, RecallRecord } from './recall.types.js';

export class RecallMerge {
  constructor(private recall: RecallDB) {}

  // if an existing memory with the same summary exists for the project/global, update it
  // otherwise insert as new
  storeMemory(input: RecallInput): RecallRecord {
    const existing = this.recall
      .recall(input.projectId ?? undefined)
      .find((m) => m.summary === input.summary);

    if (existing) {
      const mergedFiles = this.mergeFiles(existing.files, input.files);

      // adjust confidence slightly upward for repeated evidence
      const newConfidence = Math.min(
        1,
        Math.max(existing.confidence, input.confidence),
      );

      this.recall.updateMemory(existing.id, {
        files: mergedFiles,
        confidence: newConfidence,
        lastAccessed: Date.now(),
      });

      return this.recall.getById(existing.id)!;
    }

    return this.recall.insert(input);
  }

  private mergeFiles(
    oldFiles: string[] | null,
    newFiles: string[] | undefined,
  ): string[] | null {
    if (!oldFiles && !newFiles) return null;
    if (!oldFiles) return newFiles ?? null;
    if (!newFiles) return oldFiles;

    const set = new Set([...oldFiles, ...newFiles]);
    return Array.from(set);
  }
}
