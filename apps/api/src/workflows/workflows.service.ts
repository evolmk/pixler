import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WorkflowLoader } from '@pixler/orchestrator/server';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { load, dump } from 'js-yaml';
import type { WorkflowDefDto } from '@pixler/shared-types';
import type { WorkflowDef } from '@pixler/orchestrator';

const BUILTINS_DIR = join(__dirname, '..', '..', 'workflows', 'defaults');
const USER_DIR = join(homedir(), '.config', 'pixler', 'workflows');

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);
  private readonly loader = new WorkflowLoader(BUILTINS_DIR);

  list(repoDir?: string): WorkflowDefDto[] {
    const all = this.loader.loadAll(repoDir);
    return all.map((wf) => this.toDto(wf, this.detectSource(wf.name, repoDir)));
  }

  read(name: string, repoDir?: string): { yaml: string; source: string } {
    const wf = this.loader.loadByName(name, repoDir);
    if (!wf) throw new NotFoundException(`Workflow '${name}' not found`);
    const source = this.detectSource(name, repoDir);
    const filePath = this.resolveFilePath(name, source, repoDir);
    return { yaml: readFileSync(filePath, 'utf-8'), source };
  }

  save(name: string, yaml: string): void {
    this.ensureUserDir();
    const parsed = load(yaml) as WorkflowDef;
    if (!parsed?.name || !Array.isArray(parsed.steps)) {
      throw new Error('Invalid workflow YAML: missing name or steps');
    }
    const filePath = join(USER_DIR, `${name}.yaml`);
    writeFileSync(filePath, yaml, 'utf-8');
  }

  duplicate(name: string, repoDir?: string): WorkflowDefDto {
    const wf = this.loader.loadByName(name, repoDir);
    if (!wf) throw new NotFoundException(`Workflow '${name}' not found`);

    const newName = `${name}-copy`;
    const newDef: WorkflowDef = { ...wf, name: newName };
    this.ensureUserDir();
    writeFileSync(join(USER_DIR, `${newName}.yaml`), dump(newDef), 'utf-8');
    return this.toDto(newDef, 'user');
  }

  archive(name: string): void {
    const source = this.detectSource(name);
    if (source === 'builtin') {
      // Copy to user dir with archived: true
      this.ensureUserDir();
      const wf = this.loader.loadByName(name);
      if (!wf) throw new NotFoundException(`Workflow '${name}' not found`);
      writeFileSync(join(USER_DIR, `${name}.yaml`), dump({ ...wf, archived: true }), 'utf-8');
      return;
    }
    const filePath = this.resolveFilePath(name, source);
    const yaml = readFileSync(filePath, 'utf-8');
    const def = load(yaml) as WorkflowDef;
    writeFileSync(filePath, dump({ ...def, archived: true }), 'utf-8');
  }

  getLoader(): WorkflowLoader {
    return this.loader;
  }

  private toDto(wf: WorkflowDef, source: 'builtin' | 'user' | 'repo'): WorkflowDefDto {
    return {
      name: wf.name,
      description: wf.description,
      version: wf.version,
      source,
      archived: wf.archived,
      steps: wf.steps.map((s) => ({
        id: s.id,
        label: s.label ?? s.id,
        type: s.type,
        model: s.model,
      })),
    };
  }

  private detectSource(name: string, repoDir?: string): 'builtin' | 'user' | 'repo' {
    if (repoDir) {
      const repoPath = join(repoDir, '.pixler', 'workflows', `${name}.yaml`);
      if (existsSync(repoPath)) return 'repo';
    }
    const userPath = join(USER_DIR, `${name}.yaml`);
    if (existsSync(userPath)) return 'user';
    return 'builtin';
  }

  private resolveFilePath(
    name: string,
    source: 'builtin' | 'user' | 'repo',
    repoDir?: string,
  ): string {
    if (source === 'repo' && repoDir) return join(repoDir, '.pixler', 'workflows', `${name}.yaml`);
    if (source === 'user') return join(USER_DIR, `${name}.yaml`);
    return join(BUILTINS_DIR, `${name}.yaml`);
  }

  private ensureUserDir(): void {
    if (!existsSync(USER_DIR)) mkdirSync(USER_DIR, { recursive: true });
  }
}
