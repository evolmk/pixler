import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './db/database.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [DatabaseModule, EventsModule, SettingsModule],
  controllers: [HealthController],
})
export class AppModule {}
