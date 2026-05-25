import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { IdeService } from './ide.service';
import { DatabaseService } from '../db/database.service';
import { NotFoundException } from '@nestjs/common';
import type { OpenInIdeDto } from '@pixler/shared-types';

type DbWorkspace = { worktree_path: string | null; project_id: string };
type DbProject = { path: string };

@Controller()
export class IdeController {
  constructor(
    private readonly ideService: IdeService,
    private readonly db: DatabaseService,
  ) {}

  @Get('ides')
  listIdes() {
    return this.ideService.list();
  }

  @Post('workspaces/:id/open-in-ide')
  async openInIde(@Param('id') id: string, @Body() dto: OpenInIdeDto) {
    const ws = this.db.connection
      .prepare('SELECT worktree_path, project_id FROM workspaces WHERE id = ?')
      .get(id) as DbWorkspace | undefined;
    if (!ws) throw new NotFoundException(`Workspace ${id} not found`);

    const project = this.db.connection
      .prepare('SELECT path FROM projects WHERE id = ?')
      .get(ws.project_id) as DbProject | undefined;

    const targetPath = ws.worktree_path ?? project?.path;
    if (!targetPath) throw new NotFoundException('No path for workspace');

    await this.ideService.open(targetPath, dto.ide);
    return { ok: true };
  }
}
