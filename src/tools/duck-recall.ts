import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { RecallDB } from '../recall/recall.db.js';
import { RecallMerge } from '../recall/recall.merge.js';
import type { RecallInput, RecallRecord } from '../recall/recall.types.js';
import path from 'node:path';
import process from 'node:process';

const recallDB = new RecallDB();
const recallMerge = new RecallMerge(recallDB);

const storeSchema = z.object({
  summary: z.string(),
  category: z.string(),
  confidence: z.number(),
  files: z.array(z.string()).optional().transform((item) => item ?? []),
});

const recallToolSchema = z.object({
  action: z.enum(['store', 'recall', 'reinforce', 'contradict', 'archive', 'list']),
  data: z.any(), // refine per action if needed
});

export function registerRecallTool(server: McpServer) {
  console.error('registered recall tool');

  server.registerTool(
    'duck-recall',
    {
      description: 'Store, recall, and manage developer recall',
      inputSchema: recallToolSchema,
    },
    async ({ action, data }) => {
      // generate projectId from current folder
      const projectId = path.basename(process.cwd());

      switch (action) {
      case 'store': {
        const parsed: RecallInput = storeSchema.parse(data);
        const memory: RecallRecord = recallMerge.storeMemory({
          ...parsed,
          projectId,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(memory, null, 2),
            },
          ],
        };
      }

      case 'recall': {
        const recall: RecallRecord[] = recallDB.recall(projectId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(recall, null, 2),
            },
          ],
        };
      }

      case 'reinforce': {
        const id: string = data.id;
        recallDB.reinforce(id);
        return {
          content: [{ type: 'text', text: `recall ${id} reinforced.` }],
        };
      }

      case 'contradict': {
        const id: string = data.id;
        recallDB.contradict(id);
        return {
          content: [{ type: 'text', text: `recall ${id} contradicted.` }],
        };
      }

      case 'archive': {
        const id: string = data.id;
        recallDB.archive(id);
        return {
          content: [{ type: 'text', text: `recall ${id} archived.` }],
        };
      }

      case 'list': {
        const recall: RecallRecord[] = recallDB.list();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(recall, null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            { type: 'text', text: `unknown action: ${action}` },
          ],
        };
      }
    },
  );
}
