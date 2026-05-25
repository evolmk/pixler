import { Injectable, Logger } from '@nestjs/common';
import * as pty from 'node-pty';
import { EventEmitter } from 'events';
import { SettingsService } from '../settings/settings.service';
import { EventsService } from '../events/events.service';
import type { AgentPhase } from '@pixler/orchestrator';

export interface AgentRunOpts {
  workspaceId: string;
  worktreePath: string;
  phase: AgentPhase;
  prompt: string;
  ticketId?: string;
  branch?: string;
  apiPort?: number;
  onData?: (data: string) => void;
}

export interface AgentRunResult {
  exitCode: number;
  approved: boolean | null;
  critique: string | null;
}

@Injectable()
export class AgentRunnerService {
  private readonly logger = new Logger(AgentRunnerService.name);
  private runningAgents = new Map<string, pty.IPty>();

  constructor(
    private readonly settings: SettingsService,
    private readonly events: EventsService,
  ) {}

  private resolveCommand(phase: AgentPhase): string {
    switch (phase) {
      case 'planning':
      case 'executing':
      case 'validating':
        return (this.settings.get('providers.claude') as string) || 'claude';
      case 'reviewing':
        return (this.settings.get('providers.codex') as string) || 'codex';
      default:
        return 'claude';
    }
  }

  private buildArgs(phase: AgentPhase, prompt: string): string[] {
    switch (phase) {
      case 'planning':
        return ['--permission-mode', 'plan', prompt];
      case 'reviewing':
        return ['exec', prompt];
      case 'executing':
        return ['--execute', prompt];
      case 'validating':
        return ['--execute', prompt];
      default:
        return [prompt];
    }
  }

  async run(opts: AgentRunOpts): Promise<AgentRunResult> {
    const { workspaceId, worktreePath, phase, prompt } = opts;
    const cmd = this.resolveCommand(phase);
    const args = this.buildArgs(phase, prompt);

    const env: Record<string, string> = {
      ...(process.env as Record<string, string>),
      PIXLER_WORKSPACE_ID: workspaceId,
      PIXLER_WORKSPACE_PATH: worktreePath,
    };
    if (opts.ticketId) env.PIXLER_TICKET_ID = opts.ticketId;
    if (opts.branch) env.PIXLER_BRANCH = opts.branch;
    if (opts.apiPort) env.PIXLER_API_PORT = String(opts.apiPort);

    this.logger.log(`[${workspaceId}] phase=${phase} cmd=${cmd} ${args.slice(0, 1).join(' ')}…`);

    const emitter = new EventEmitter();
    let outputBuffer = '';
    let approved: boolean | null = null;
    let critique: string | null = null;

    return new Promise<AgentRunResult>((resolve, reject) => {
      let ptyProcess: pty.IPty;
      try {
        ptyProcess = pty.spawn(cmd, args, {
          name: 'xterm-256color',
          cols: 220,
          rows: 50,
          cwd: worktreePath,
          env,
        });
      } catch (err) {
        reject(err);
        return;
      }

      this.runningAgents.set(workspaceId, ptyProcess);

      ptyProcess.onData((data) => {
        outputBuffer += data;
        opts.onData?.(data);
        this.events.emitWorkspaceEvent(workspaceId, {
          type: 'agent.output',
          workspaceId,
          data,
          timestamp: Date.now(),
        });

        if (phase === 'reviewing') {
          for (const line of data.split('\n')) {
            const trimmed = line.trim();
            if (trimmed.toUpperCase().startsWith('APPROVED')) {
              approved = true;
            } else if (trimmed.toUpperCase().startsWith('REJECTED')) {
              approved = false;
              critique = trimmed.replace(/^REJECTED[:\s]*/i, '').trim() || outputBuffer;
            }
          }
        }
      });

      ptyProcess.onExit(({ exitCode }) => {
        this.runningAgents.delete(workspaceId);
        emitter.emit('done', exitCode);
      });

      emitter.once('done', (exitCode: number) => {
        resolve({ exitCode, approved, critique });
      });
    });
  }

  interrupt(workspaceId: string): void {
    const proc = this.runningAgents.get(workspaceId);
    if (!proc) return;
    try {
      proc.write('\x03');
      setTimeout(() => {
        try { proc.kill(); } catch {}
        this.runningAgents.delete(workspaceId);
      }, 1500);
    } catch {}
  }

  isRunning(workspaceId: string): boolean {
    return this.runningAgents.has(workspaceId);
  }
}
