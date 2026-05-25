import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';

@Controller('api/workspaces/:workspaceId/orchestrator')
export class OrchestratorController {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @Get('state')
  getState(@Param('workspaceId') workspaceId: string) {
    const state = this.orchestrator.getState(workspaceId);
    if (!state) throw new NotFoundException('No orchestrator state for workspace');
    return state;
  }

  @Post('start')
  async start(@Param('workspaceId') workspaceId: string) {
    await this.orchestrator.start(workspaceId);
    return { started: true };
  }

  @Post('approve')
  approve(@Param('workspaceId') workspaceId: string) {
    this.orchestrator.approve(workspaceId);
    return { ok: true };
  }

  @Post('reject')
  reject(
    @Param('workspaceId') workspaceId: string,
    @Body() body: { note?: string },
  ) {
    this.orchestrator.reject(workspaceId, body.note);
    return { ok: true };
  }

  @Post('interrupt')
  interrupt(@Param('workspaceId') workspaceId: string) {
    this.orchestrator.interrupt(workspaceId);
    return { ok: true };
  }

  @Post('stop')
  stop(@Param('workspaceId') workspaceId: string) {
    this.orchestrator.stop(workspaceId);
    return { ok: true };
  }
}
