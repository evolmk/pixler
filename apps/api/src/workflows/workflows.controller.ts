import { Controller, Get, Put, Post, Patch, Body, Param, Query, HttpCode } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { StorageProviderService } from './storage-provider.service';
import type { SaveWorkflowDto } from '@pixler/shared-types';

@Controller('workflows')
export class WorkflowsController {
  constructor(
    private readonly workflows: WorkflowsService,
    private readonly storage: StorageProviderService,
  ) {}

  @Get()
  list(@Query('repoDir') repoDir?: string) {
    return this.workflows.list(repoDir);
  }

  @Get('storage')
  getStorage(@Query('repoDir') repoDir?: string, @Query('folder') folder?: string) {
    return this.storage.getStorageInfo(repoDir, folder);
  }

  @Get(':name')
  read(@Param('name') name: string, @Query('repoDir') repoDir?: string) {
    return this.workflows.read(name, repoDir);
  }

  @Put(':name')
  @HttpCode(204)
  save(@Param('name') name: string, @Body() dto: SaveWorkflowDto) {
    this.workflows.save(name, dto.yaml);
  }

  @Post(':name/duplicate')
  duplicate(@Param('name') name: string, @Query('repoDir') repoDir?: string) {
    return this.workflows.duplicate(name, repoDir);
  }

  @Patch(':name/archive')
  @HttpCode(204)
  archive(@Param('name') name: string) {
    this.workflows.archive(name);
  }
}
