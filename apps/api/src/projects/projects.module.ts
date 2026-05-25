import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CloneService } from './clone.service';
import { PixlerJsonService } from './pixler-json.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, CloneService, PixlerJsonService],
  exports: [ProjectsService, CloneService, PixlerJsonService],
})
export class ProjectsModule {}
