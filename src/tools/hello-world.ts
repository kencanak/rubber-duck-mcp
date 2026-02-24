import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerHelloWorldTool(server: McpServer) {
  server.registerTool(
    'hello-world',
    {
      description: 'Say hello to someone',
      inputSchema: {
        name: z.string().optional().describe('Name to greet'),
      },
    },
    async ({ name }) => ({
      content: [{
        type: 'text' as const,
        text: `Hello, ${name ?? 'World'}!`,
      }],
    }),
  );
}
