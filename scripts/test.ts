import { spawn } from 'node:child_process';

const proc = spawn('bash', ['./run.sh'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: {
    ...process.env,     // keep existing env vars
    HOT_RELOAD: 'false'
  },
});

proc.stdout.on('data', (data) => {
  console.log('SERVER:', data.toString());
});

// Send initialize request
proc.stdin.write(JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {}
}) + '\n');

// Example tool call later
setTimeout(() => {
  proc.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list'
  }) + "\n");
}, 500);