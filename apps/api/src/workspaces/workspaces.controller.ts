import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { WorkspacesService } from './workspaces.service';
import type { CreateWorkspaceDto, PatchWorkspaceDto } from '@pixler/shared-types';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspaces: WorkspacesService) {}

  @Get()
  findAll(@Query('projectId') projectId: string) {
    return this.workspaces.findAllByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaces.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWorkspaceDto) {
    return this.workspaces.create(dto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: PatchWorkspaceDto) {
    return this.workspaces.patch(id, dto);
  }

  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.workspaces.archive(id);
  }

  @Post(':id/rerun-setup')
  rerunSetup(@Param('id') id: string) {
    return this.workspaces.rerunSetup(id);
  }

  @Get(':id/files')
  listFiles(@Param('id') id: string) {
    return this.workspaces.listFiles(id);
  }

  @Post(':id/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, cb) => {
          const ws = (req as { workspace?: { worktree_path?: string } }).workspace;
          const dir = join(ws?.worktree_path ?? '/tmp', 'attachments');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const ts = Date.now();
          cb(null, `${ts}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  uploadAttachment(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const ws = this.workspaces.findOne(id);
    const dir = join(ws.worktree_path ?? '/tmp', 'attachments');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaces.remove(id);
  }
}
