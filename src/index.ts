import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerHelloWorldTool } from './tools/hello-world.js';
import { registerRecallTool } from './tools/duck-recall.js';


const server = new McpServer({
  name: 'RubberDuckMCPServer',
  version: '1.0.0',
});

registerHelloWorldTool(server);
registerRecallTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Quack! Rubber Duck MCP Server is live. Tell me your bugs, I promise not to judge... much.');
}

main().catch(console.error);
