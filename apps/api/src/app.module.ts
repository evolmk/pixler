import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
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
import { DeeplinkModule } from './deeplink/deeplink.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { CrashesModule } from './crashes/crashes.module';
import { LogsModule } from './common/logger/logs.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [DatabaseModule, EventsModule, SettingsModule, ProjectsModule, WorkspacesModule, LinearModule, TerminalsModule, GithubModule, DiffModule, RunModule, IdeModule, OnboardingModule, OrchestratorModule, UsageModule, PlansModule, MessagesModule, CheckpointsModule, ActivityModule, DeeplinkModule, TelemetryModule, CrashesModule, LogsModule, AuthModule, ModelsModule],
  controllers: [HealthController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
