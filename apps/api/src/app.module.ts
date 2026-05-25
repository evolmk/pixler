import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './db/database.module';
import { SettingsModule } from './settings/settings.module';
import { ProjectsModule } from './projects/projects.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { LinearModule } from './linear/linear.module';
import { TerminalsModule } from './terminals/terminals.module';
import { GithubModule } from './github/github.module';
import { DiffModule } from './diff/diff.module';
import { RunModule } from './run/run.module';
import { IdeModule } from './ide/ide.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { UsageModule } from './usage/usage.module';
import { PlansModule } from './plans/plans.module';
import { MessagesModule } from './messages/messages.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [DatabaseModule, EventsModule, SettingsModule, ProjectsModule, WorkspacesModule, LinearModule, TerminalsModule, GithubModule, DiffModule, RunModule, IdeModule, OnboardingModule, OrchestratorModule, UsageModule, PlansModule, MessagesModule, CheckpointsModule, ActivityModule],
  controllers: [HealthController],
})
export class AppModule {}
