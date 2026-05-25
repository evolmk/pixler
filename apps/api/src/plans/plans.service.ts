import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import { SettingsService } from '../settings/settings.service';
import { EventsService } from '../events/events.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { AutoRecommenderService } from './auto-recommender.service';
import { FileStorageService } from './storage/file-storage';
import { InlineStorageService } from './storage/inline-storage';
import { AttachmentStorageService } from './storage/attachment-storage';
import type { Plan, PlanStorageMode, SavePlanDto, PlanHistoryEntry } from '@pixler/shared-types';

type DbPlan = {
  id: string;
  workspace_id: string;
  ticket_id: string | null;
  storage: string;
  revision: number;
  status: string;
  content: string;
  linear_url: string | null;
  linear_attachment_current: string | null;
  linear_attachment_previous: string | null;
  sub_issue_map: string;
  created_at: number;
  updated_at: number;
};

@Injectable()
export class PlansService {
  constructor(
    private readonly db: DatabaseService,
    private readonly settings: SettingsService,
    private readonly events: EventsService,
    private readonly workspaces: WorkspacesService,
    private readonly recommender: AutoRecommenderService,
    private readonly fileStorage: FileStorageService,
    private readonly inlineStorage: InlineStorageService,
    private readonly attachmentStorage: AttachmentStorageService,
  ) {}

  findByWorkspace(workspaceId: string): Plan | null {
    const row = this.db.connection
      .prepare('SELECT * FROM plans WHERE workspace_id = ? ORDER BY updated_at DESC LIMIT 1')
      .get(workspaceId) as DbPlan | undefined;
    return row ? this.toDto(row) : null;
  }

  getHistory(workspaceId: string): PlanHistoryEntry[] {
    const rows = this.db.connection
      .prepare('SELECT revision, updated_at, storage FROM plans WHERE workspace_id = ? ORDER BY revision DESC')
      .all(workspaceId) as Pick<DbPlan, 'revision' | 'updated_at' | 'storage'>[];
    return rows.map((r) => ({ revision: r.revision, updatedAt: r.updated_at, storage: r.storage as PlanStorageMode }));
  }

  recommend(workspaceId: string): { mode: PlanStorageMode; reason: string } {
    const ws = this.workspaces.findOne(workspaceId);
    return this.recommender.recommend(ws.ticket_id ?? undefined, ws.project_id);
  }

  async save(workspaceId: string, dto: SavePlanDto): Promise<Plan> {
    const ws = this.workspaces.findOne(workspaceId);
    const rec = this.recommender.recommend(ws.ticket_id ?? undefined, ws.project_id);
    const resolvedMode: PlanStorageMode = dto.mode && dto.mode !== 'auto' ? dto.mode : rec.mode === 'auto' ? 'file' : rec.mode;

    if (resolvedMode === 'inline') {
      const { exceeded, taskCount, charCount } = this.recommender.exceedsInlineThresholds(dto.content, ws.project_id);
      if (exceeded) {
        this.events.emitWorkspaceEvent(workspaceId, {
          type: 'plan.big-plan-prompt',
          workspaceId,
          taskCount,
          charCount,
          timestamp: Date.now(),
        });
        throw new BadRequestException({ code: 'PLAN_TOO_BIG', taskCount, charCount });
      }
    }

    const now = Date.now();
    const existing = this.findByWorkspace(workspaceId);

    if (resolvedMode === 'file') {
      await this.writeFileStorage(ws, dto.content);
    } else if (resolvedMode === 'inline' && ws.ticket_id) {
      const revision = existing ? existing.revision + 1 : 1;
      await this.inlineStorage.write(ws.ticket_id, dto.content, revision);
    }

    if (existing) {
      const newRevision = existing.revision + 1;
      let attachCurrentId: string | null = existing.linearAttachmentCurrent ?? null;
      let attachPrevId: string | null = existing.linearAttachmentPrevious ?? null;

      if (resolvedMode === 'attachment' && ws.ticket_id) {
        const pair = await this.attachmentStorage.upload(
          ws.ticket_id,
          dto.content,
          newRevision,
          attachCurrentId ? { currentId: attachCurrentId, previousId: attachPrevId ?? undefined } : undefined,
        );
        attachCurrentId = pair.currentId;
        attachPrevId = pair.previousId ?? null;
      }

      this.db.connection
        .prepare(
          `UPDATE plans SET content = ?, revision = ?, storage = ?, updated_at = ?,
           linear_attachment_current = ?, linear_attachment_previous = ? WHERE id = ?`,
        )
        .run(dto.content, newRevision, resolvedMode, now, attachCurrentId, attachPrevId, existing.id);

      return this.findByWorkspace(workspaceId)!;
    }

    const id = randomUUID();
    let attachCurrentId: string | null = null;
    let attachPrevId: string | null = null;

    if (resolvedMode === 'attachment' && ws.ticket_id) {
      const pair = await this.attachmentStorage.upload(ws.ticket_id, dto.content, 1);
      attachCurrentId = pair.currentId;
    }

    this.db.connection
      .prepare(
        `INSERT INTO plans (id, workspace_id, ticket_id, storage, revision, status, content,
         linear_url, linear_attachment_current, linear_attachment_previous, sub_issue_map,
         created_at, updated_at) VALUES (?, ?, ?, ?, 1, 'in_progress', ?, ?, ?, ?, '{}', ?, ?)`,
      )
      .run(id, workspaceId, ws.ticket_id ?? null, resolvedMode, dto.content,
           ws.ticket_id ? `https://linear.app/team/issue/${ws.ticket_id}` : null,
           attachCurrentId, attachPrevId, now, now);

    return this.findByWorkspace(workspaceId)!;
  }

  async revise(workspaceId: string, content: string): Promise<Plan> {
    return this.save(workspaceId, { content });
  }

  resetProjectPrompts(projectId: string): void {
    this.recommender.resetProjectPrompts(projectId);
  }

  resetAllPrompts(): void {
    this.recommender.resetAllPrompts();
  }

  private async writeFileStorage(ws: { worktree_path?: string | null; ticket_id?: string | null; branch?: string | null }, content: string): Promise<void> {
    const repoPath = ws.worktree_path ?? process.cwd();
    const ticketId = ws.ticket_id ?? 'plan';
    this.fileStorage.write(repoPath, ticketId, content, ws.branch ?? undefined);
  }

  private toDto(row: DbPlan): Plan {
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      ticketId: row.ticket_id ?? undefined,
      storage: row.storage as PlanStorageMode,
      revision: row.revision,
      status: row.status as Plan['status'],
      content: row.content,
      linearUrl: row.linear_url ?? undefined,
      linearAttachmentCurrent: row.linear_attachment_current ?? undefined,
      linearAttachmentPrevious: row.linear_attachment_previous ?? undefined,
      subIssueMap: JSON.parse(row.sub_issue_map) as Record<string, string>,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
