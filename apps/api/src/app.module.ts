import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './db/database.module';
import { SettingsModule } from './settings/settings.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [DatabaseModule, EventsModule, SettingsModule, ProjectsModule],
  controllers: [HealthController],
})
export class AppModule {}
