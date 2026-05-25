#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entry = resolve(__dirname, '../packages/linear-cli/dist/cli.js');

const child = spawn('node', [entry, ...process.argv.slice(2)], { stdio: 'inherit' });
child.on('close', (code) => process.exit(code ?? 0));
child.on('error', (err) => {
  process.stderr.write(`[pixler-linear] ${err.message}\n`);
  process.exit(2);
});
