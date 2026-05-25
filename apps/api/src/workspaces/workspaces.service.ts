import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import { PortAllocatorService } from './port-allocator.service';
import { NameGeneratorService } from './name-generator.service';
import { WorktreeService } from './worktree.service';
import { SetupRunnerService } from './setup-runner.service';
import { FilesToCopyService } from './files-to-copy.service';
import { PixlerJsonService } from '../projects/pixler-json.service';
import type { Workspace, CreateWorkspaceDto, PatchWorkspaceDto } from '@pixler/shared-types';

type DbWorkspace = Omit<Workspace, 'pinned'> & { pinned: 0 | 1 };
type DbProject = { id: string; path: string };

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly portAllocator: PortAllocatorService,
    private readonly nameGenerator: NameGeneratorService,
    private readonly worktree: WorktreeService,
    private readonly setupRunner: SetupRunnerService,
    private readonly filesToCopy: FilesToCopyService,
    private readonly pixlerJson: PixlerJsonService,
  ) {}

  findAllByProject(projectId: string): Workspace[] {
    const rows = this.db.connection
      .prepare(
        'SELECT * FROM workspaces WHERE project_id = ? ORDER BY pinned DESC, created_at DESC',
      )
      .all(projectId) as DbWorkspace[];
    return rows.map(this.toWorkspace);
  }

  findOne(id: string): Workspace {
    const row = this.db.connection
      .prepare('SELECT * FROM workspaces WHERE id = ?')
      .get(id) as DbWorkspace | undefined;
    if (!row) throw new NotFoundException(`Workspace ${id} not found`);
    return this.toWorkspace(row);
  }

  async create(dto: CreateWorkspaceDto): Promise<Workspace> {
    const { projectId, ticketId, ticketSource, mode = 'chat' } = dto;

    const project = this.db.connection
      .prepare('SELECT id, path FROM projects WHERE id = ?')
      .get(projectId) as DbProject | undefined;
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    const name = dto.name ?? this.nameGenerator.generate({ ticketId });
    const branch = this.worktree.branchName({ workspaceName: name });
    const worktreePath = this.worktree.worktreeDir({
      repoPath: project.path,
      workspaceName: name,
    });
    const port = await this.portAllocator.allocate();
    const isColorName = !ticketId && !dto.name;
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);

    this.db.connection
      .prepare(
        `INSERT INTO workspaces
           (id, project_id, name, state, mode, branch, worktree_path, port,
            ticket_id, ticket_source, color_name, pinned, created_at, updated_at)
         VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      )
      .run(
        id, projectId, name, mode, branch, worktreePath, port,
        ticketId ?? null, ticketSource ?? null, isColorName ? name : null,
        now, now,
      );

    await this.worktree.create({ repoPath: project.path, worktreePath, branch });

    this.db.connection
      .prepare(`UPDATE workspaces SET state = 'ready', updated_at = ? WHERE id = ?`)
      .run(Math.floor(Date.now() / 1000), id);

    const teamConfig = this.pixlerJson.load(project.path);
    const globs = teamConfig?.filesToCopy ?? [];
    await this.filesToCopy.copy({ repoPath: project.path, worktreePath, globs });

    const workspace = this.findOne(id);
    const setupScript = teamConfig?.scripts?.setup;
    if (setupScript) {
      this.setupRunner.run(workspace, setupScript);
    }

    return this.findOne(id);
  }

  patch(id: string, dto: PatchWorkspaceDto): Workspace {
    this.findOne(id);
    const now = Math.floor(Date.now() / 1000);
    if (dto.name !== undefined) {
      this.db.connection
        .prepare('UPDATE workspaces SET name = ?, updated_at = ? WHERE id = ?')
        .run(dto.name, now, id);
    }
    if (dto.pinned !== undefined) {
      this.db.connection
        .prepare('UPDATE workspaces SET pinned = ?, updated_at = ? WHERE id = ?')
        .run(dto.pinned ? 1 : 0, now, id);
    }
    return this.findOne(id);
  }

  async archive(id: string): Promise<Workspace> {
    const workspace = this.findOne(id);
    const project = this.db.connection
      .prepare('SELECT path FROM projects WHERE id = ?')
      .get(workspace.project_id) as { path: string } | undefined;

    const teamConfig = project ? this.pixlerJson.load(project.path) : null;
    const archiveScript = teamConfig?.scripts?.archive;

    if (archiveScript && workspace.worktree_path) {
      await this.runScript(workspace, archiveScript);
    }

    if (workspace.worktree_path) {
      await this.worktree.remove(workspace.worktree_path);
    }

    const now = Math.floor(Date.now() / 1000);
    this.db.connection
      .prepare(`UPDATE workspaces SET state = 'archived', archived_at = ?, updated_at = ? WHERE id = ?`)
      .run(now, now, id);

    return this.findOne(id);
  }

  async rerunSetup(id: string): Promise<{ ok: boolean }> {
    const workspace = this.findOne(id);
    const project = this.db.connection
      .prepare('SELECT path FROM projects WHERE id = ?')
      .get(workspace.project_id) as { path: string } | undefined;

    const teamConfig = project ? this.pixlerJson.load(project.path) : null;
    const setupScript = teamConfig?.scripts?.setup;
    if (setupScript) {
      this.setupRunner.run(workspace, setupScript);
    }

    return { ok: true };
  }

  async remove(id: string): Promise<{ ok: boolean }> {
    const workspace = this.findOne(id);
    if (workspace.worktree_path) {
      await this.worktree.remove(workspace.worktree_path);
    }
    this.db.connection.prepare('DELETE FROM workspaces WHERE id = ?').run(id);
    this.db.connection
      .prepare('DELETE FROM settings_workspace WHERE workspace_id = ?')
      .run(id);
    return { ok: true };
  }

  private runScript(workspace: Workspace, script: string): Promise<void> {
    return new Promise((resolve) => {
      this.setupRunner.run(workspace, script);
      resolve();
    });
  }

  private toWorkspace(row: DbWorkspace): Workspace {
    return { ...row, pinned: row.pinned === 1 };
  }
}
