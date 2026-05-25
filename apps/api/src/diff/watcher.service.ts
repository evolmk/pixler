import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import chokidar, { type FSWatcher } from 'chokidar';
import { EventsService } from '../events/events.service';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class WatcherService implements OnModuleDestroy {
  private readonly logger = new Logger(WatcherService.name);
  private readonly watchers = new Map<string, FSWatcher>();

  constructor(
    private readonly events: EventsService,
    private readonly db: DatabaseService,
  ) {}

  start(workspaceId: string): void {
    if (this.watchers.has(workspaceId)) return;

    const cwd = this.getCwd(workspaceId);
    if (!cwd) return;

    const watcher = chokidar.watch(cwd, {
      ignored: [/(^|[/\\])\../, /node_modules/, /\.git/, /dist/],
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
    });

    const emit = () => {
      this.events.emitWorkspaceEvent(workspaceId, { type: 'diff.changed' });
    };

    watcher.on('add', emit).on('change', emit).on('unlink', emit).on('error', (err) => {
      this.logger.debug(`watcher error for ${workspaceId}: ${String(err)}`);
    });

    this.watchers.set(workspaceId, watcher);
    this.logger.debug(`watching ${cwd} for workspace ${workspaceId}`);
  }

  stop(workspaceId: string): void {
    const w = this.watchers.get(workspaceId);
    if (w) {
      void w.close();
      this.watchers.delete(workspaceId);
    }
  }

  private getCwd(workspaceId: string): string | null {
    const ws = this.db.connection
      .prepare('SELECT worktree_path, project_id FROM workspaces WHERE id = ?')
      .get(workspaceId) as { worktree_path: string | null; project_id: string } | undefined;
    if (!ws) return null;

    if (ws.worktree_path) return ws.worktree_path;

    const proj = this.db.connection
      .prepare('SELECT path FROM projects WHERE id = ?')
      .get(ws.project_id) as { path: string } | undefined;
    return proj?.path ?? null;
  }

  onModuleDestroy() {
    for (const [id] of this.watchers) this.stop(id);
  }
}
