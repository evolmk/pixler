import { Module } from '@nestjs/common';
import { UsageService } from './usage.service';
import { UsageController } from './usage.controller';
import { ClaudeLogParserService } from './claude-log-parser.service';
import { McpOverheadEstimatorService } from './mcp-overhead-estimator.service';
import { DatabaseModule } from '../db/database.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [DatabaseModule, SettingsModule],
  providers: [UsageService, ClaudeLogParserService, McpOverheadEstimatorService],
  controllers: [UsageController],
  exports: [UsageService],
})
export class UsageModule {}
