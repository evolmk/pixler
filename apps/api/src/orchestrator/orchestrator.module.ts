import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorService } from './orchestrator.service';
import { AgentRunnerService } from './agent-runner.service';
import { PromptTemplatesService } from './prompt-templates.service';
import { LinearBridgeService } from './linear-bridge.service';
import { PreflightService } from './preflight.service';
import { SettingsModule } from '../settings/settings.module';
import { EventsModule } from '../events/events.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { LinearModule } from '../linear/linear.module';
import { UsageModule } from '../usage/usage.module';
import { CheckpointsModule } from '../checkpoints/checkpoints.module';
import { WorkflowsModule } from '../workflows/workflows.module';

@Module({
  imports: [SettingsModule, EventsModule, WorkspacesModule, LinearModule, UsageModule, CheckpointsModule, WorkflowsModule],
  controllers: [OrchestratorController],
  providers: [OrchestratorService, AgentRunnerService, PromptTemplatesService, LinearBridgeService, PreflightService],
  exports: [OrchestratorService, PreflightService],
})
export class OrchestratorModule {}
