import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';
import { AgentRunnerService } from './agent-runner.service';
import { PromptTemplatesService } from './prompt-templates.service';
import { LinearBridgeService } from './linear-bridge.service';
import { SettingsModule } from '../settings/settings.module';
import { EventsModule } from '../events/events.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { LinearModule } from '../linear/linear.module';

@Module({
  imports: [SettingsModule, EventsModule, WorkspacesModule, LinearModule],
  controllers: [OrchestratorController],
  providers: [OrchestratorService, AgentRunnerService, PromptTemplatesService, LinearBridgeService],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}
