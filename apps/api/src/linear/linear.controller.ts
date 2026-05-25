import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LinearService } from './linear.service';
import type { ConnectLinearDto } from '@pixler/shared-types';

@Controller('linear')
export class LinearController {
  constructor(private readonly linear: LinearService) {}

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
}
