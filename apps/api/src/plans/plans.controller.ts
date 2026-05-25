import { Controller, Get, Post, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { PlansService } from './plans.service';
import type { SavePlanDto, RevisePlanDto } from '@pixler/shared-types';

@Controller('api/workspaces/:workspaceId/plan')
export class PlansController {
  constructor(private readonly plans: PlansService) {}

  @Get()
  getPlan(@Param('workspaceId') workspaceId: string) {
    const plan = this.plans.findByWorkspace(workspaceId);
    if (!plan) throw new NotFoundException('No plan for this workspace');
    return plan;
  }

  @Get('history')
  getHistory(@Param('workspaceId') workspaceId: string) {
    return this.plans.getHistory(workspaceId);
  }

  @Get('recommend')
  getRecommendation(@Param('workspaceId') workspaceId: string) {
    return this.plans.recommend(workspaceId);
  }

  @Post()
  async savePlan(
    @Param('workspaceId') workspaceId: string,
    @Body() body: SavePlanDto,
  ) {
    return this.plans.save(workspaceId, body);
  }

  @Post('revise')
  async revisePlan(
    @Param('workspaceId') workspaceId: string,
    @Body() body: RevisePlanDto,
  ) {
    return this.plans.revise(workspaceId, body.content);
  }
}

@Controller('api/projects/:projectId/plans')
export class ProjectPlansController {
  constructor(private readonly plans: PlansService) {}

  @Delete('reset-prompts')
  resetProjectPrompts(@Param('projectId') projectId: string) {
    this.plans.resetProjectPrompts(projectId);
    return { ok: true };
  }
}

@Controller('api/plans')
export class GlobalPlansController {
  constructor(private readonly plans: PlansService) {}

  @Delete('reset-all-prompts')
  resetAllPrompts() {
    this.plans.resetAllPrompts();
    return { ok: true };
  }
}
