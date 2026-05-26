import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';
import { DatabaseService } from '../db/database.service';
import { EventsService } from '../events/events.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import type { Checkpoint, CheckpointTrigger } from '@pixler/shared-types';

type DbCheckpoint = {
  id: string;
  workspace_id: string;
  label: string;
  trigger: string;
  stash_ref: string | null;
  plan_content: string | null;
  chat_snapshot: string;
  file_count: number;
  line_count: number;
  created_at: number;
};

export interface TakeSnapshotOpts {
  label?: string;
  trigger?: CheckpointTrigger;
  fileCount?: number;
  lineCount?: number;
}

@Injectable()
export class CheckpointsService {
  private readonly logger = new Logger(CheckpointsService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly events: EventsService,
    private readonly workspaces: WorkspacesService,
  ) {}

  findAllByWorkspace(workspaceId: string): Checkpoint[] {
    const rows = this.db.connection
      .prepare('SELECT * FROM checkpoints WHERE workspace_id = ? ORDER BY created_at DESC')
      .all(workspaceId) as DbCheckpoint[];
    return rows.map(this.toDto);
  }

  findOne(id: string): Checkpoint {
    const row = this.db.connection
      .prepare('SELECT * FROM checkpoints WHERE id = ?')
      .get(id) as DbCheckpoint | undefined;
    if (!row) throw new NotFoundException(`Checkpoint ${id} not found`);
    return this.toDto(row);
  }

  async takeSnapshot(workspaceId: string, opts: TakeSnapshotOpts = {}): Promise<Checkpoint> {
    const ws = this.workspaces.findOne(workspaceId);
    const repoPath = ws.worktree_path ?? process.cwd();
    const trigger: CheckpointTrigger = opts.trigger ?? 'manual';
    const label = opts.label ?? this.defaultLabel(trigger, opts.fileCount, opts.lineCount);
    const id = randomUUID();
    const now = Date.now();

    let stashRef: string | null = null;
    try {
      const message = `pixler-checkpoint:${id}`;
      execSync(`git stash push -u -m "${message}"`, { cwd: repoPath, stdio: 'pipe' });
      const raw = execSync('git stash list --format=%gd', { cwd: repoPath }).toString().trim();
      const line = raw.split('\n').find((l) => l.includes(id));
      if (line) stashRef = line.split(':')[0]?.trim() ?? null;
    } catch {
      // no changes to stash — still record the checkpoint
    }

    const planRow = this.db.connection
      .prepare('SELECT content FROM plans WHERE workspace_id = ? ORDER BY updated_at DESC LIMIT 1')
      .get(workspaceId) as { content: string } | undefined;

    this.db.connection
      .prepare(
        `INSERT INTO checkpoints (id, workspace_id, label, trigger, stash_ref, plan_content,
         chat_snapshot, file_count, line_count, created_at)
         VALUES (?, ?, ?, ?, ?, ?, '[]', ?, ?, ?)`,
      )
      .run(id, workspaceId, label, trigger, stashRef, planRow?.content ?? null,
           opts.fileCount ?? 0, opts.lineCount ?? 0, now);

    this.events.emitWorkspaceEvent(workspaceId, {
      type: 'checkpoint.taken',
      workspaceId,
      checkpointId: id,
      label,
      timestamp: now,
    });

    this.logger.log(`[${workspaceId}] checkpoint taken: ${label} (${id})`);
    return this.findOne(id);
  }

  async rollback(checkpointId: string): Promise<void> {
    const cp = this.findOne(checkpointId);
    const ws = this.workspaces.findOne(cp.workspaceId);
    const repoPath = ws.worktree_path ?? process.cwd();

    if (cp.stashRef) {
      try {
        execSync(`git checkout -- .`, { cwd: repoPath, stdio: 'pipe' });
        execSync(`git clean -fd`, { cwd: repoPath, stdio: 'pipe' });
        // Use apply (not pop) so the stash persists for repeat retries of the same step.
        execSync(`git stash apply ${cp.stashRef}`, { cwd: repoPath, stdio: 'pipe' });
      } catch (e) {
        this.logger.warn(`[${cp.workspaceId}] stash apply failed: ${e}`);
        throw new Error(`Failed to restore checkpoint ${checkpointId}`);
      }
    }

    if (cp.planContent) {
      this.db.connection
        .prepare('UPDATE plans SET content = ?, updated_at = ? WHERE workspace_id = ?')
        .run(cp.planContent, Date.now(), cp.workspaceId);
    }

    this.events.emitWorkspaceEvent(cp.workspaceId, {
      type: 'checkpoint.rolled-back',
      workspaceId: cp.workspaceId,
      checkpointId,
      timestamp: Date.now(),
    });

    this.logger.log(`[${cp.workspaceId}] rolled back to checkpoint ${checkpointId}`);
  }

  delete(checkpointId: string): void {
    this.db.connection.prepare('DELETE FROM checkpoints WHERE id = ?').run(checkpointId);
  }

  private defaultLabel(trigger: CheckpointTrigger, fileCount?: number, lineCount?: number): string {
    switch (trigger) {
      case 'before_execution': return 'Before execution';
      case 'pre_batch': return `Pre-batch (${fileCount ?? 0} files, ${lineCount ?? 0} lines)`;
      case 'resolve_conflicts': return 'Before resolve-conflicts';
      case 'rebase': return 'Before rebase';
      default: return 'Manual checkpoint';
    }
  }

  private toDto(row: DbCheckpoint): Checkpoint {
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      label: row.label,
      trigger: row.trigger as CheckpointTrigger,
      stashRef: row.stash_ref ?? undefined,
      planContent: row.plan_content ?? undefined,
      fileCount: row.file_count,
      lineCount: row.line_count,
      createdAt: row.created_at,
    };
  }
}
