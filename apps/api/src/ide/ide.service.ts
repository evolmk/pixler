import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import type { DetectedIde } from '@pixler/shared-types';

const execFileAsync = promisify(execFile);

interface IdeDefinition {
  id: string;
  name: string;
  command: string;
  versionArgs: string[];
  openArgs: (path: string) => string[];
}

const IDE_DEFINITIONS: IdeDefinition[] = [
  { id: 'vscode', name: 'VS Code', command: 'code', versionArgs: ['--version'], openArgs: (p) => [p] },
  { id: 'cursor', name: 'Cursor', command: 'cursor', versionArgs: ['--version'], openArgs: (p) => [p] },
  { id: 'windsurf', name: 'Windsurf', command: 'windsurf', versionArgs: ['--version'], openArgs: (p) => [p] },
  { id: 'zed', name: 'Zed', command: 'zed', versionArgs: ['--version'], openArgs: (p) => [p] },
  { id: 'webstorm', name: 'WebStorm', command: 'webstorm', versionArgs: ['--version'], openArgs: (p) => [p] },
  { id: 'subl', name: 'Sublime Text', command: 'subl', versionArgs: ['--version'], openArgs: (p) => [p] },
  { id: 'nvim', name: 'Neovim', command: 'nvim', versionArgs: ['--version'], openArgs: (p) => [p] },
  { id: 'vim', name: 'Vim', command: 'vim', versionArgs: ['--version'], openArgs: (p) => [p] },
];

@Injectable()
export class IdeService implements OnModuleInit {
  private detected: DetectedIde[] = [];
  private detectPromise: Promise<void> | null = null;

  async onModuleInit() {
    this.detectPromise = this.runDetection();
    await this.detectPromise;
  }

  private async runDetection() {
    const results = await Promise.all(
      IDE_DEFINITIONS.map(async (def) => {
        try {
          const { stdout } = await execFileAsync(def.command, def.versionArgs, { timeout: 3000 });
          const version = stdout.trim().split('\n')[0] ?? null;
          return { id: def.id, name: def.name, command: def.command, version, available: true };
        } catch {
          return { id: def.id, name: def.name, command: def.command, version: null, available: false };
        }
      }),
    );
    this.detected = results;
  }

  list(): DetectedIde[] {
    return this.detected;
  }

  async open(worktreePath: string, ideId?: string): Promise<void> {
    const ides = this.detected.filter((d) => d.available);
    const ide = ideId ? ides.find((d) => d.id === ideId) : ides[0];
    if (!ide) throw new NotFoundException(ideId ? `IDE ${ideId} not available` : 'No IDE available');

    const def = IDE_DEFINITIONS.find((d) => d.id === ide.id)!;
    const args = def.openArgs(worktreePath);

    execFile(ide.command, args, { timeout: 10000 }, () => {});
  }
}
