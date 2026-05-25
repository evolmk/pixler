import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { PortAllocatorService } from './port-allocator.service';
import { NameGeneratorService } from './name-generator.service';
import { WorktreeService } from './worktree.service';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService, PortAllocatorService, NameGeneratorService, WorktreeService],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
