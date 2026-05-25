import { Module } from '@nestjs/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { StorageProviderService } from './storage-provider.service';

@Module({
  controllers: [WorkflowsController],
  providers: [WorkflowsService, StorageProviderService],
  exports: [WorkflowsService, StorageProviderService],
})
export class WorkflowsModule {}
