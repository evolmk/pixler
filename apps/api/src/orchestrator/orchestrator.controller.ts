import { Controller, Get, Post, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { PreflightService } from './preflight.service';
import { TriggersService } from '../checkpoints/triggers.service';

@Controller('workspaces/:workspaceId/orchestrator')
export class OrchestratorController {
  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly preflight: PreflightService,
    private readonly triggers: TriggersService,
  ) {}

  @Get('state')
  getState(@Param('workspaceId') workspaceId: string) {
    const state = this.orchestrator.getState(workspaceId);
    if (!state) throw new NotFoundException('No orchestrator state for workspace');
    return state;
  }

  @Get('preflight')
  getPreflight(@Query('parallel') parallel?: string) {
    return this.preflight.check(parallel ? parseInt(parallel, 10) : 1);
  }

  @Post('start')
  async start(
    @Param('workspaceId') workspaceId: string,
    @Query('override') override?: string,
  ) {
    if (override !== 'true') {
      const check = this.preflight.check(this.orchestrator.countRunning());
      if (!check.ok) {
        return { started: false, needsConfirmation: true, preflight: check };
      }
    }
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

  @Post('resolve-conflicts')
  async resolveConflicts(@Param('workspaceId') workspaceId: string) {
    await this.triggers.onResolveConflicts(workspaceId);
    return { ok: true };
  }

  @Post('rebase')
  async rebase(@Param('workspaceId') workspaceId: string) {
    await this.triggers.onRebase(workspaceId);
    return { ok: true };
  }
}
