import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { FileStorageService } from './storage/file-storage';
import { InlineStorageService } from './storage/inline-storage';
import { AttachmentStorageService } from './storage/attachment-storage';
import { SettingsModule } from '../settings/settings.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { LinearModule } from '../linear/linear.module';

@Module({
  imports: [SettingsModule, WorkspacesModule, LinearModule],
  controllers: [PlansController],
  providers: [PlansService, FileStorageService, InlineStorageService, AttachmentStorageService],
  exports: [PlansService],
})
export class PlansModule {}
