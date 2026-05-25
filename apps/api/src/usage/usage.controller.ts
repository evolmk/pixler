import { Controller, Get, Query, Post } from '@nestjs/common';
import { UsageService } from './usage.service';
import { McpOverheadEstimatorService } from './mcp-overhead-estimator.service';

@Controller('usage')
export class UsageController {
  constructor(
    private readonly usage: UsageService,
    private readonly mcp: McpOverheadEstimatorService,
  ) {}

  @Get('window')
  getWindow(@Query('hours') hours?: string) {
    return this.usage.getWindow(hours ? parseInt(hours, 10) : 5);
  }

  @Get('per-model')
  getPerModel(
    @Query('since') since?: string,
    @Query('until') until?: string,
  ) {
    return this.usage.getPerModel(
      since ? parseInt(since, 10) : undefined,
      until ? parseInt(until, 10) : undefined,
    );
  }

  @Get('per-workspace')
  getPerWorkspace(@Query('workspaceId') workspaceId?: string) {
    return this.usage.getPerWorkspace(workspaceId);
  }

  @Get('historical')
  getHistorical(@Query('range') range?: 'daily' | 'weekly' | 'monthly') {
    return this.usage.getHistorical(range ?? 'daily');
  }

  @Get('mcp-overhead')
  getMcpOverhead() {
    return this.mcp.estimate();
  }

  @Post('flush')
  flush() {
    this.usage.flush();
    return { ok: true };
  }
}
