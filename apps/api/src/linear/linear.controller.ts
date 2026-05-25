import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { LinearService } from './linear.service';
import { SyncScheduler } from './sync.scheduler';
import { StateMapService } from './state-map.service';
import { LinearMutationsService } from './linear-mutations.service';
import type { ConnectLinearDto } from '@pixler/shared-types';

@Controller('linear')
export class LinearController {
  constructor(
    private readonly linear: LinearService,
    private readonly sync: SyncScheduler,
    private readonly stateMap: StateMapService,
    private readonly mutations: LinearMutationsService,
  ) {}

  @Get('status')
  status() {
    return this.linear.status();
  }

  @Post('connect')
  connect(@Body() dto: ConnectLinearDto) {
    return this.linear.connect(dto.pat);
  }

  @Post('disconnect')
  disconnect() {
    return this.linear.disconnect();
  }

  @Get('teams')
  teams() {
    return this.linear.teams();
  }

  @Get('projects')
  projects(@Query('teamId') teamId: string) {
    return this.linear.projects(teamId);
  }

  @Get('tickets')
  tickets(@Query('projectId') projectId: string) {
    return this.sync.tickets(projectId);
  }

  @Post('sync')
  forceSync(@Body() body: { projectId?: string }) {
    return this.sync.syncAll(body.projectId);
  }

  @Post('tickets/:identifier/state')
  transitionState(
    @Param('identifier') identifier: string,
    @Body() body: { state: string; teamId: string; projectId?: string },
  ) {
    return this.stateMap.transitionIssue(
      identifier,
      body.state as 'todo' | 'in_progress' | 'in_review' | 'done',
      body.teamId,
      body.projectId,
    );
  }

  @Post('tickets/:identifier/comment')
  createComment(
    @Param('identifier') identifier: string,
    @Body() body: { body: string },
  ) {
    return this.mutations.createComment(identifier, body.body);
  }

  @Post('upload/init')
  initiateUpload(@Body() body: { contentType: string; filename: string; size: number }) {
    return this.mutations.initiateAttachmentUpload(body.contentType, body.filename, body.size);
  }

  @Post('tickets/:identifier/attachment')
  createAttachment(
    @Param('identifier') identifier: string,
    @Body() body: { assetUrl: string; title: string },
  ) {
    return this.mutations.createAttachment(identifier, body.assetUrl, body.title);
  }

  @Delete('attachments/:id')
  deleteAttachment(@Param('id') id: string) {
    return this.mutations.deleteAttachment(id);
  }

  @Post('tickets/:identifier/subissues')
  createSubissue(
    @Param('identifier') identifier: string,
    @Body() body: { title: string },
  ) {
    return this.mutations.createSubissue(identifier, body.title);
  }

  @Post('subissues/:id/complete')
  completeSubissue(@Param('id') id: string) {
    return this.mutations.completeSubissue(id);
  }
}
