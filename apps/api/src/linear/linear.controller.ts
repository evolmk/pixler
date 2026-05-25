import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { LinearService } from './linear.service';
import { SyncScheduler } from './sync.scheduler';
import { StateMapService } from './state-map.service';
import type { ConnectLinearDto } from '@pixler/shared-types';

@Controller('linear')
export class LinearController {
  constructor(
    private readonly linear: LinearService,
    private readonly sync: SyncScheduler,
    private readonly stateMap: StateMapService,
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
}
