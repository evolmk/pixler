import { Injectable, NotFoundException } from '@nestjs/common';
import * as pty from 'node-pty';
import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { SettingsService } from '../settings/settings.service';

interface TerminalProcess {
  id: string;
  workspaceId: string;
  pty: pty.IPty;
  emitter: EventEmitter;
  createdAt: number;
}

@Injectable()
export class TerminalsService {
  private terminals = new Map<string, TerminalProcess>();
  private workspaceTerminals = new Map<string, Set<string>>();

  constructor(
    private readonly workspaces: WorkspacesService,
    private readonly settings: SettingsService,
  ) {}

  create(workspaceId: string, cols = 80, rows = 24): string {
    const workspace = this.workspaces.findOne(workspaceId);
    const shell =
      (this.settings.get('terminal.shell') as string | undefined) ??
      process.env.SHELL ??
      '/bin/bash';

    const id = randomUUID();
    const emitter = new EventEmitter();

    const ptyProcess = pty.spawn(shell, ['-l'], {
      name: 'xterm-256color',
      cols,
      rows,
      cwd: workspace.worktree_path ?? process.env.HOME ?? '/',
      env: process.env as Record<string, string>,
    });

    ptyProcess.onData((data) => emitter.emit('data', data));
    ptyProcess.onExit(({ exitCode }) => {
      emitter.emit('exit', exitCode);
      this.terminals.delete(id);
      this.workspaceTerminals.get(workspaceId)?.delete(id);
    });

    const terminal: TerminalProcess = {
      id,
      workspaceId,
      pty: ptyProcess,
      emitter,
      createdAt: Date.now(),
    };

    this.terminals.set(id, terminal);

    if (!this.workspaceTerminals.has(workspaceId)) {
      this.workspaceTerminals.set(workspaceId, new Set());
    }
    this.workspaceTerminals.get(workspaceId)!.add(id);

    return id;
  }

  findOrCreate(workspaceId: string, cols?: number, rows?: number): string {
    const existing = this.getForWorkspace(workspaceId);
    if (existing.length > 0) return existing[0];
    return this.create(workspaceId, cols, rows);
  }

  getForWorkspace(workspaceId: string): string[] {
    return Array.from(this.workspaceTerminals.get(workspaceId) ?? []);
  }

  findOne(id: string): TerminalProcess {
    const t = this.terminals.get(id);
    if (!t) throw new NotFoundException(`Terminal ${id} not found`);
    return t;
  }

  write(id: string, data: string): void {
    this.findOne(id).pty.write(data);
  }

  resize(id: string, cols: number, rows: number): void {
    this.findOne(id).pty.resize(cols, rows);
  }

  kill(id: string): void {
    const t = this.terminals.get(id);
    if (!t) return;
    t.pty.kill();
    this.terminals.delete(id);
    this.workspaceTerminals.get(t.workspaceId)?.delete(id);
  }

  killForWorkspace(workspaceId: string): void {
    for (const id of this.getForWorkspace(workspaceId)) {
      this.kill(id);
    }
    this.workspaceTerminals.delete(workspaceId);
  }

  onData(id: string, handler: (data: string) => void): () => void {
    const t = this.findOne(id);
    t.emitter.on('data', handler);
    return () => t.emitter.off('data', handler);
  }

  onExit(id: string, handler: (code: number) => void): () => void {
    const t = this.findOne(id);
    t.emitter.on('exit', handler);
    return () => t.emitter.off('exit', handler);
  }
}
