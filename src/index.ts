import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import { registerHelloWorldTool } from './tools/hello-world.js';
import { registerRecallTool } from './tools/duck-recall.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const ENDPOINT = '/rubber-duck-mcp';
const transports = new Map<string, StreamableHTTPServerTransport>();

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'RubberDuckMCPServer',
    version: '1.0.0',
  });
  registerHelloWorldTool(server);
  registerRecallTool(server);
  return server;
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : undefined);
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (url.pathname !== ENDPOINT) {
    res.writeHead(404).end();
    return;
  }

  if (req.method === 'POST') {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.has(sessionId)) {
      transport = transports.get(sessionId)!;
    } else {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          transports.set(id, transport);
        },
      });
      transport.onclose = () => {
        if (transport.sessionId) transports.delete(transport.sessionId);
      };
      await createMcpServer().connect(transport as Transport);
    }

    const body = await readBody(req);
    await transport.handleRequest(req, res, body);
    return;
  }

  if (req.method === 'GET') {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
      res.writeHead(400).end('Missing or invalid mcp-session-id');
      return;
    }
    await transports.get(sessionId)!.handleRequest(req, res);
    return;
  }

  if (req.method === 'DELETE') {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (sessionId && transports.has(sessionId)) {
      await transports.get(sessionId)!.handleRequest(req, res);
      transports.delete(sessionId);
    } else {
      res.writeHead(404).end();
    }
    return;
  }

  res.writeHead(405).end();
}

async function main() {
  const httpServer = createServer((req, res) => {
    handleRequest(req, res).catch((err) => {
      console.error('Request error:', err);
      if (!res.headersSent) res.writeHead(500).end('Internal Server Error');
    });
  });

  httpServer.listen(PORT, () => {
    console.error(`Quack! Rubber Duck MCP Server is live at http://localhost:${PORT}${ENDPOINT}`);
  });
}

main().catch(console.error);
