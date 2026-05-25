import { Module } from '@nestjs/common';
import { RunService } from './run.service';
import { RunController } from './run.controller';
import { ReadyDetectorService } from './ready-detector.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProjectsModule],
  providers: [RunService, ReadyDetectorService],
  controllers: [RunController],
  exports: [RunService],
})
export class RunModule {}
