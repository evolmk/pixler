import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GhExecService } from './gh-exec.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [GithubController],
  providers: [GithubService, GhExecService],
  exports: [GithubService, GhExecService],
})
export class GithubModule {}
