import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GhExecService } from './gh-exec.service';
import { PrBodyTemplateService } from './pr-body-template.service';
import { DatabaseService } from '../db/database.service';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { PullRequest, PrCheck, PrComment, CreatePrDto, MergePrDto } from '@pixler/shared-types';

type DbWorkspace = { branch: string | null; worktree_path: string | null; ticket_id: string | null; project_id: string };
type DbProject = { path: string };

@Injectable()
export class PrService {
  constructor(
    private readonly gh: GhExecService,
    private readonly template: PrBodyTemplateService,
    private readonly db: DatabaseService,
  ) {}

  private getWorkspace(id: string): DbWorkspace {
    const row = this.db.connection
      .prepare('SELECT branch, worktree_path, ticket_id, project_id FROM workspaces WHERE id = ?')
      .get(id) as DbWorkspace | undefined;
    if (!row) throw new NotFoundException(`Workspace ${id} not found`);
    return row;
  }

  private getCwd(ws: DbWorkspace): string {
    return ws.worktree_path ?? (this.db.connection
      .prepare('SELECT path FROM projects WHERE id = ?')
      .get(ws.project_id) as DbProject).path;
  }

  async createPr(workspaceId: string, dto: CreatePrDto): Promise<PullRequest> {
    const ws = this.getWorkspace(workspaceId);
    const cwd = this.getCwd(ws);

    if (!ws.branch) throw new BadRequestException('Workspace has no branch');

    const body = this.template.generate({ worktreePath: cwd, ticketId: ws.ticket_id });
    const bodyFile = join(tmpdir(), `pixler-pr-${randomUUID()}.md`);
    writeFileSync(bodyFile, dto.body ?? body, 'utf-8');

    const args = ['pr', 'create', '--body-file', bodyFile];
    if (dto.title) args.push('--title', dto.title);
    if (dto.base) args.push('--base', dto.base);
    if (dto.draft) args.push('--draft');

    try {
      await this.gh.exec(args, { cwd });
    } finally {
      unlinkSync(bodyFile);
    }

    return this.getPr(workspaceId);
  }

  async getPr(workspaceId: string): Promise<PullRequest> {
    const ws = this.getWorkspace(workspaceId);
    const cwd = this.getCwd(ws);

    const raw = await this.gh.execJson<{
      number: number;
      title: string;
      url: string;
      state: string;
      isDraft: boolean;
      headRefName: string;
      baseRefName: string;
      body: string;
      createdAt: string;
      mergedAt: string | null;
    }>(['pr', 'view', '--json', 'number,title,url,state,isDraft,headRefName,baseRefName,body,createdAt,mergedAt'], { cwd });

    return {
      number: raw.number,
      title: raw.title,
      url: raw.url,
      state: (raw.state?.toUpperCase() ?? 'OPEN') as PullRequest['state'],
      isDraft: raw.isDraft,
      headRefName: raw.headRefName,
      baseRefName: raw.baseRefName,
      body: raw.body,
      createdAt: raw.createdAt,
      mergedAt: raw.mergedAt ?? null,
    };
  }

  async mergePr(workspaceId: string, dto: MergePrDto): Promise<{ merged: boolean }> {
    const ws = this.getWorkspace(workspaceId);
    const cwd = this.getCwd(ws);

    const flagMap: Record<string, string> = {
      merge: '--merge',
      squash: '--squash',
      rebase: '--rebase',
    };
    const flag = flagMap[dto.strategy] ?? '--merge';
    await this.gh.exec(['pr', 'merge', flag, '--auto'], { cwd });
    return { merged: true };
  }

  async getChecks(workspaceId: string): Promise<PrCheck[]> {
    const ws = this.getWorkspace(workspaceId);
    const cwd = this.getCwd(ws);

    const raw = await this.gh.execJson<Array<{
      name: string;
      status: string;
      conclusion: string | null;
      startedAt: string | null;
      completedAt: string | null;
      detailsUrl: string | null;
    }>>(['pr', 'checks', '--json', 'name,status,conclusion,startedAt,completedAt,detailsUrl'], { cwd });

    return raw.map((c) => ({
      name: c.name,
      status: (c.status?.toLowerCase() ?? 'queued') as PrCheck['status'],
      conclusion: (c.conclusion?.toLowerCase() ?? null) as PrCheck['conclusion'],
      startedAt: c.startedAt,
      completedAt: c.completedAt,
      detailsUrl: c.detailsUrl,
    }));
  }

  async getComments(workspaceId: string): Promise<PrComment[]> {
    const ws = this.getWorkspace(workspaceId);
    const cwd = this.getCwd(ws);

    const envelope = await this.gh.execJson<{
      comments: Array<{
        id: number;
        author: { login: string };
        body: string;
        createdAt: string;
        url: string;
      }>;
    }>(['pr', 'view', '--json', 'comments'], { cwd });

    return (envelope.comments ?? []).map((c) => ({
      id: c.id,
      author: c.author?.login ?? 'unknown',
      body: c.body,
      createdAt: c.createdAt,
      url: c.url,
    }));
  }
}
