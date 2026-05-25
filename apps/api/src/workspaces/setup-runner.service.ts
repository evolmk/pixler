import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { platform } from 'os';
import { DatabaseService } from '../db/database.service';
import { EventsService } from '../events/events.service';
import type { Workspace } from '@pixler/shared-types';

@Injectable()
export class SetupRunnerService {
  constructor(
    private readonly db: DatabaseService,
    private readonly events: EventsService,
  ) {}

  run(workspace: Workspace, script: string): void {
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PIXLER_ROOT_PATH: workspace.worktree_path ?? '',
      PIXLER_WORKSPACE_PATH: workspace.worktree_path ?? '',
      PIXLER_WORKSPACE_NAME: workspace.name,
      PIXLER_PORT: String(workspace.port ?? ''),
      PIXLER_TICKET_ID: workspace.ticket_id ?? '',
      PIXLER_BRANCH: workspace.branch ?? '',
    };

    const [cmd, args] =
      platform() === 'win32'
        ? ['cmd', ['/c', script]]
        : ['bash', ['-lc', script]];

    const child = spawn(cmd, args, {
      cwd: workspace.worktree_path ?? undefined,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this.setState(workspace.id, 'setting_up');

    let buffer = '';
    const handleLine = (line: string) => {
      if (!line.trim()) return;
      this.events.emitWorkspaceEvent(workspace.id, {
        type: 'workspace.setup-log',
        workspaceId: workspace.id,
        line,
        timestamp: Date.now(),
      });
    };

    const processChunk = (chunk: string) => {
      buffer += chunk;
      const parts = buffer.split(/\r?\n|\r/);
      buffer = parts.pop() ?? '';
      for (const part of parts) handleLine(part);
    };

    child.stdout.on('data', (d: Buffer) => processChunk(d.toString()));
    child.stderr.on('data', (d: Buffer) => processChunk(d.toString()));

    child.on('close', (code) => {
      if (buffer) handleLine(buffer);
      if (code !== 0) {
        this.setState(workspace.id, 'error');
      } else {
        this.setState(workspace.id, 'ready');
      }
    });

    child.on('error', () => {
      this.setState(workspace.id, 'error');
    });
  }

  private setState(id: string, state: string): void {
    const prev = (
      this.db.connection
        .prepare('SELECT state FROM workspaces WHERE id = ?')
        .get(id) as { state: string } | undefined
    )?.state;

    this.db.connection
      .prepare('UPDATE workspaces SET state = ?, updated_at = ? WHERE id = ?')
      .run(state, Math.floor(Date.now() / 1000), id);

    if (prev && prev !== state) {
      this.events.emitWorkspaceEvent(id, {
        type: 'workspace.state-changed',
        workspaceId: id,
        from: prev,
        to: state,
        timestamp: Date.now(),
      });
    }
  }
}
