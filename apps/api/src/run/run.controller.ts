import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RunService } from './run.service';
import type { StartRunDto } from '@pixler/shared-types';

@Controller('workspaces/:id/run')
export class RunController {
  constructor(private readonly runService: RunService) {}

  @Get()
  getStatus(@Param('id') id: string) {
    return this.runService.getStatus(id);
  }

  @Post()
  start(@Param('id') id: string, @Body() dto: StartRunDto) {
    return this.runService.start(id, dto.readyPattern);
  }

  @Post('stop')
  stop(@Param('id') id: string) {
    return this.runService.stop(id);
  }
}
