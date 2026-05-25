import { load } from 'js-yaml';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import type { WorkflowDef } from './workflow-types.js';

export class WorkflowLoader {
  constructor(private readonly builtinsDir: string) {}

  loadAll(repoDir?: string): WorkflowDef[] {
    const builtins = this.loadFromDir(this.builtinsDir);
    const userGlobal = this.loadFromDir(join(homedir(), '.config', 'pixler', 'workflows'));
    const repoScoped = repoDir
      ? this.loadFromDir(join(repoDir, '.pixler', 'workflows'))
      : [];

    // Higher priority shadows lower — repo > user-global > built-in
    const byName = new Map<string, WorkflowDef>();
    for (const wf of [...builtins, ...userGlobal, ...repoScoped]) {
      byName.set(wf.name.toLowerCase(), wf);
    }
    return [...byName.values()].filter((wf) => !wf.archived);
  }

  loadByName(name: string, repoDir?: string): WorkflowDef | null {
    const all = this.loadAll(repoDir);
    return all.find((wf) => wf.name.toLowerCase() === name.toLowerCase()) ?? null;
  }

  loadForLabel(label: string, repoDir?: string): WorkflowDef | null {
    return this.loadByName(label, repoDir);
  }

  private loadFromDir(dir: string): WorkflowDef[] {
    if (!existsSync(dir)) return [];
    try {
      return readdirSync(dir)
        .filter((f: string) => f.endsWith('.yaml') || f.endsWith('.yml'))
        .map((f: string) => {
          try {
            const raw = readFileSync(join(dir, f), 'utf-8');
            const parsed = load(raw) as WorkflowDef;
            if (!parsed?.name || !Array.isArray(parsed.steps)) return null;
            return parsed;
          } catch {
            return null;
          }
        })
        .filter((wf: WorkflowDef | null): wf is WorkflowDef => wf !== null);
    } catch {
      return [];
    }
  }

  /** Resolve builtins directory relative to this file's location (handles dist/ output). */
  static defaultBuiltinsDir(): string {
    // __dirname in dist/ → project root is ../../
    return resolve(__dirname, '..', '..', '..', 'apps', 'api', 'workflows', 'defaults');
  }
}
