import { spawn, type ChildProcess } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const PORT = 7777;
let proc: ChildProcess | null = null;

async function fetchWithRetry(url: string, retries = 10, delayMs = 500): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      return res;
    } catch {
      if (i === retries - 1) throw new Error(`Failed to reach ${url} after ${retries} attempts`);
      await sleep(delayMs);
    }
  }
  throw new Error('unreachable');
}

async function main() {
  console.log('Starting Pixler server...');
  proc = spawn('node', ['bin/pixler.js'], {
    env: { ...process.env, PORT: String(PORT), PIXLER_HEADLESS: '1' },
    stdio: 'pipe',
  });

  proc.stdout?.on('data', (d: Buffer) => process.stdout.write(`[api] ${d.toString()}`));
  proc.stderr?.on('data', (d: Buffer) => process.stderr.write(`[api] ${d.toString()}`));

  await sleep(2000);

  console.log('Checking /api/health...');
  const health = await fetchWithRetry(`http://localhost:${PORT}/api/health`);
  if (!health.ok) throw new Error(`/api/health returned ${health.status}`);
  console.log('✓ /api/health OK');

  console.log('Checking /api/onboarding/status...');
  const onboarding = await fetchWithRetry(`http://localhost:${PORT}/api/onboarding/status`);
  if (!onboarding.ok) throw new Error(`/api/onboarding/status returned ${onboarding.status}`);
  console.log('✓ /api/onboarding/status OK');

  console.log('Smoke test passed.');
  proc?.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error('Smoke test FAILED:', err);
  proc?.kill();
  process.exit(1);
});
