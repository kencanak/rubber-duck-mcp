import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { RecallDB } from '../recall/recall.db.js';
import { RecallMerge } from '../recall/recall.merge.js';
import type { RecallRecord } from '../recall/recall.types.js';
import path from 'node:path';
import process from 'node:process';

const recallDB = new RecallDB();
const recallMerge = new RecallMerge(recallDB);

const recallToolSchema = z.object({
  action: z.enum(['store', 'recall', 'search', 'reinforce', 'contradict', 'archive', 'list']).describe(
    'store: save new memory | recall: get all memories for project | search: find by keyword | ' +
    'reinforce: confirm a memory | contradict: flag wrong memory | archive: hide memory | list: list all memories',
  ),
  data: z.object({
    // store fields
    summary: z.string().optional().describe('Summary of the memory (required for store)'),
    category: z.string().optional().describe('Category label e.g. "architecture", "tooling" (required for store)'),
    confidence: z.number().optional().describe('Confidence score 0.0-1.0 (required for store)'),
    files: z.array(z.string()).optional().describe('Related file paths (optional for store)'),
    // search field
    query: z.string().optional().describe('Search query string (required for search)'),
    // id-based actions
    id: z.string().optional().describe('Memory ID (required for reinforce, contradict, archive)'),
  }).optional(),
});

export function registerRecallTool(server: McpServer) {
  server.registerTool(
    'duck-recall',
    {
      description: `
      Persistent development memory system.

      Use this tool to store stable project knowledge:
      - architecture decisions
      - conventions
      - tooling setup
      - non-obvious debugging discoveries

      Do NOT store temporary questions or one-off fixes.

      Prefer recalling relevant memories before answering complex project questions.
      `,
      inputSchema: recallToolSchema,
    },
    async (input) => {
      const projectId = path.basename(process.cwd());

      const { action, data } = input;

      switch (action) {
      case 'store': {
        if (!data?.summary || !data?.category || data?.confidence === undefined) {
          return {
            content: [{ type: 'text', text: 'Error: store requires data.summary, data.category, and data.confidence' }],
          };
        }
        const memory: RecallRecord = recallMerge.storeMemory({
          summary: data.summary,
          category: data.category,
          confidence: data.confidence,
          files: data.files ?? [],
          projectId,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(memory, null, 2) }],
        };
      }

      case 'recall': {
        const recall: RecallRecord[] = recallDB.recall(projectId);
        return {
          content: [{ type: 'text', text: JSON.stringify(recall, null, 2) }],
        };
      }

      case 'search': {
        if (!data?.query) {
          return { content: [{ type: 'text', text: 'Error: search requires data.query' }] };
        }
        const results = recallDB.recallByQuery(data.query, projectId);
        return {
          content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
        };
      }

      case 'reinforce': {
        if (!data?.id) {
          return { content: [{ type: 'text', text: 'Error: reinforce requires data.id' }] };
        }
        recallDB.reinforce(data.id);
        return {
          content: [{ type: 'text', text: `recall ${data.id} reinforced.` }],
        };
      }

      case 'contradict': {
        if (!data?.id) {
          return { content: [{ type: 'text', text: 'Error: contradict requires data.id' }] };
        }
        recallDB.contradict(data.id);
        return {
          content: [{ type: 'text', text: `recall ${data.id} contradicted.` }],
        };
      }

      case 'archive': {
        if (!data?.id) {
          return { content: [{ type: 'text', text: 'Error: archive requires data.id' }] };
        }
        recallDB.archive(data.id);
        return {
          content: [{ type: 'text', text: `recall ${data.id} archived.` }],
        };
      }

      case 'list': {
        const recall: RecallRecord[] = recallDB.list();
        return {
          content: [{ type: 'text', text: JSON.stringify(recall, null, 2) }],
        };
      }
      }
    },
  );
}
