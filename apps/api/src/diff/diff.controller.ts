import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DiffService } from './diff.service';
import { WatcherService } from './watcher.service';

@Controller('workspaces/:id/diff')
export class DiffController {
  constructor(
    private readonly diff: DiffService,
    private readonly watcher: WatcherService,
  ) {}

  @Get()
  listFiles(@Param('id') id: string) {
    this.watcher.start(id);
    return this.diff.listChangedFiles(id);
  }

  @Get('file')
  getFile(
    @Param('id') id: string,
    @Query('path') path: string,
    @Query('against') against: 'workdir' | 'index' | 'head' = 'workdir',
  ) {
    return this.diff.getFileDetail(id, path, against);
  }

  @Post('stage')
  stage(@Param('id') id: string, @Body() body: { path: string; hunks: number[] }) {
    return this.diff.stageHunks(id, body.path, body.hunks);
  }

  @Post('unstage')
  unstage(@Param('id') id: string, @Body() body: { path: string }) {
    return this.diff.unstageFile(id, body.path);
  }
}
