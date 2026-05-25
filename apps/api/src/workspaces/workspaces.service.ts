import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import type { Workspace, PatchWorkspaceDto } from '@pixler/shared-types';

type DbWorkspace = Omit<Workspace, 'pinned'> & { pinned: 0 | 1 };

@Injectable()
export class WorkspacesService {
  constructor(private readonly db: DatabaseService) {}

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

  create(projectId: string): Workspace {
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    this.db.connection
      .prepare(
        `INSERT INTO workspaces (id, project_id, name, state, mode, created_at, updated_at)
         VALUES (?, ?, ?, 'pending', 'chat', ?, ?)`,
      )
      .run(id, projectId, id, now, now);
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

  remove(id: string): { ok: boolean } {
    this.findOne(id);
    this.db.connection.prepare('DELETE FROM workspaces WHERE id = ?').run(id);
    this.db.connection
      .prepare('DELETE FROM settings_workspace WHERE workspace_id = ?')
      .run(id);
    return { ok: true };
  }

  private toWorkspace(row: DbWorkspace): Workspace {
    return {
      ...row,
      pinned: row.pinned === 1,
    };
  }
}
