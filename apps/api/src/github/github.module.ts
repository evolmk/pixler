import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GhExecService } from './gh-exec.service';
import { PrService } from './pr.service';
import { PrBodyTemplateService } from './pr-body-template.service';
import { ChecksPollerService } from './checks-poller.service';
import { WorkspacePrController } from './workspace-pr.controller';
import { SettingsModule } from '../settings/settings.module';
import { EventsModule } from '../events/events.module';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [SettingsModule, EventsModule, DatabaseModule],
  controllers: [GithubController, WorkspacePrController],
  providers: [GithubService, GhExecService, PrService, PrBodyTemplateService, ChecksPollerService],
  exports: [GithubService, GhExecService, PrService],
})
export class GithubModule {}
