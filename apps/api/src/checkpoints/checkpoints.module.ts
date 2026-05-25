import { Module } from '@nestjs/common';
import { CheckpointsController, CheckpointItemController } from './checkpoints.controller';
import { CheckpointsService } from './checkpoints.service';
import { EventsModule } from '../events/events.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [EventsModule, WorkspacesModule],
  controllers: [CheckpointsController, CheckpointItemController],
  providers: [CheckpointsService],
  exports: [CheckpointsService],
})
export class CheckpointsModule {}
