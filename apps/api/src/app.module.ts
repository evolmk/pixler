import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './db/database.module';
import { SettingsModule } from './settings/settings.module';
import { ProjectsModule } from './projects/projects.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [DatabaseModule, EventsModule, SettingsModule, ProjectsModule, WorkspacesModule],
  controllers: [HealthController],
})
export class AppModule {}
