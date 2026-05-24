#!/usr/bin/env node

import { createServer } from 'net';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findFreePort(preferred) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(preferred, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // preferred port is busy, let OS pick one
      const server2 = createServer();
      server2.listen(0, () => {
        const { port } = server2.address();
        server2.close(() => resolve(port));
      });
      server2.on('error', reject);
    });
  });
}

async function openBrowser(url) {
  const { platform } = process;
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
  spawn(cmd, [url], { detached: true, stdio: 'ignore' }).unref();
}

async function main() {
  const port = await findFreePort(7777);
  const apiEntry = resolve(__dirname, '../apps/api/dist/main.js');

  const child = spawn('node', [apiEntry], {
    env: { ...process.env, PORT: String(port) },
    stdio: 'inherit',
  });

  child.on('error', (err) => {
    console.error('Failed to start Pixler API:', err.message);
    process.exit(1);
  });

  // Wait briefly for the server to start before opening the browser
  setTimeout(() => {
    const url = `http://localhost:${port}`;
    console.log(`Pixler running at ${url}`);
    openBrowser(url);
  }, 1500);

  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(0);
  });
}

main();
