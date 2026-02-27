import { spawn } from 'node:child_process';
import readline from 'node:readline';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: any;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number;
  result?: any;
  error?: any;
}

const pendingResponses = new Map<number, (resp: JsonRpcResponse) => void>();

function sendRequest(method: string, params?: any): Promise<JsonRpcResponse> {
  const id = Math.floor(Math.random() * 1_000_000);
  const req: JsonRpcRequest = { jsonrpc: '2.0', id, method, params };
  const promise = new Promise<JsonRpcResponse>((resolve) => {
    pendingResponses.set(id, resolve);
  });
  proc.stdin.write(JSON.stringify(req) + '\n');
  return promise;
}

const proc = spawn('bash', ['./run.sh'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: {
    ...process.env,
  },
});

const rl = readline.createInterface({ input: proc.stdout });

rl.on('line', (line) => {
  try {
    const resp: JsonRpcResponse = JSON.parse(line);
    const resolver = pendingResponses.get(resp.id);
    if (resolver) {
      resolver(resp);
      pendingResponses.delete(resp.id);
    } else {
      console.log('MCP EVENT:', resp);
    }
  } catch {
    console.log('RAW OUTPUT:', line);
  }
});

async function main() {
  const toolsResp = await sendRequest('tools/list', {});
  console.log('Tools response:', JSON.stringify(toolsResp.result) ?? toolsResp.error);

  const helloWorldResp = await sendRequest('tools/call', {
    name: 'hello-world',
    arguments: { name: 'nincompoops' },
  });
  console.log('Hello World response:', helloWorldResp.result ?? helloWorldResp.error);

  const storeResp = await sendRequest('tools/call', {
    name: 'duck-recall',
    arguments: {
      action: 'store',
      data: {
        summary: 'Project uses Node 24 with ESM modules',
        category: 'tooling',
        confidence: 0.95,
        files: ['package.json', '.nvmrc'],
      },
    },
  });
  console.log('Store response:', storeResp.result ?? storeResp.error);

  const recallResp = await sendRequest('tools/call', {
    name: 'duck-recall',
    arguments: {
      action: 'recall',
      data: {},
    },
  });
  console.log('Recall response:', recallResp.result ?? recallResp.error);

  const memories: any[] = recallResp.result?.content
    ? JSON.parse(recallResp.result.content[0].text)
    : [];
  if (memories.length) {
    console.log(`Reinforcing first memory: ${memories[0].summary}`);
    const reinforceResp = await sendRequest('tools/call', {
      name: 'duck-recall',
      arguments: {
        action: 'reinforce',
        data: { id: memories[0].id },
      },
    });
    console.log('Reinforce response:', reinforceResp.result ?? reinforceResp.error);
  }

  const searchResp = await sendRequest('tools/call', {
    name: 'duck-recall',
    arguments: {
      action: 'search',
      data: {
        query: 'persistent memory storage local',
      },
    },
  });

  console.log('Search response:', searchResp.result ?? searchResp.error);

  const listResp = await sendRequest('tools/call', {
    name: 'duck-recall',
    arguments: {
      action: 'list',
      data: {},
    },
  });
  console.log('List response:', listResp.result ?? listResp.error);
}

main().catch(console.error);