import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CloneService } from './clone.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, CloneService],
  exports: [ProjectsService, CloneService],
})
export class ProjectsModule {}
