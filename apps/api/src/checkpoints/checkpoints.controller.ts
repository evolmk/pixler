import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import type { TakeCheckpointDto } from '@pixler/shared-types';

@Controller('workspaces/:workspaceId/checkpoints')
export class CheckpointsController {
  constructor(private readonly checkpoints: CheckpointsService) {}

  @Get()
  list(@Param('workspaceId') workspaceId: string) {
    return this.checkpoints.findAllByWorkspace(workspaceId);
  }

  @Post()
  async take(
    @Param('workspaceId') workspaceId: string,
    @Body() body: TakeCheckpointDto,
  ) {
    return this.checkpoints.takeSnapshot(workspaceId, { label: body.label });
  }
}

@Controller('checkpoints/:checkpointId')
export class CheckpointItemController {
  constructor(private readonly checkpoints: CheckpointsService) {}

  @Post('rollback')
  async rollback(@Param('checkpointId') checkpointId: string) {
    await this.checkpoints.rollback(checkpointId);
    return { ok: true };
  }

  @Delete()
  delete(@Param('checkpointId') checkpointId: string) {
    this.checkpoints.delete(checkpointId);
    return { ok: true };
  }
}
