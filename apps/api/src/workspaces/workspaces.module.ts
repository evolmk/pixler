import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { PortAllocatorService } from './port-allocator.service';
import { NameGeneratorService } from './name-generator.service';
import { WorktreeService } from './worktree.service';
import { SetupRunnerService } from './setup-runner.service';
import { FilesToCopyService } from './files-to-copy.service';
import { ProjectsModule } from '../projects/projects.module';
import { DeeplinkModule } from '../deeplink/deeplink.module';

@Module({
  imports: [ProjectsModule, DeeplinkModule],
  controllers: [WorkspacesController],
  providers: [
    WorkspacesService,
    PortAllocatorService,
    NameGeneratorService,
    WorktreeService,
    SetupRunnerService,
    FilesToCopyService,
  ],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
