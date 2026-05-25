import { Module } from '@nestjs/common';
import { PlansController, ProjectPlansController, GlobalPlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { AutoRecommenderService } from './auto-recommender.service';
import { FileStorageService } from './storage/file-storage';
import { InlineStorageService } from './storage/inline-storage';
import { AttachmentStorageService } from './storage/attachment-storage';
import { SettingsModule } from '../settings/settings.module';
import { EventsModule } from '../events/events.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { LinearModule } from '../linear/linear.module';

@Module({
  imports: [SettingsModule, EventsModule, WorkspacesModule, LinearModule],
  controllers: [PlansController, ProjectPlansController, GlobalPlansController],
  providers: [PlansService, AutoRecommenderService, FileStorageService, InlineStorageService, AttachmentStorageService],
  exports: [PlansService, AutoRecommenderService],
})
export class PlansModule {}
