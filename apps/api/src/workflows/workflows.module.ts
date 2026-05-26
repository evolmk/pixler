import { Module } from '@nestjs/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { StorageProviderService } from './storage-provider.service';
import { WorkflowRunsService } from './workflow-runs.service';

@Module({
  controllers: [WorkflowsController],
  providers: [WorkflowsService, StorageProviderService, WorkflowRunsService],
  exports: [WorkflowsService, StorageProviderService, WorkflowRunsService],
})
export class WorkflowsModule {}
