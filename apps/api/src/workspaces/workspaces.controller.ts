import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspaces.remove(id);
  }
}
