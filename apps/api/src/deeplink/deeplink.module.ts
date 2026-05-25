import { Module } from '@nestjs/common';
import { DeeplinkController } from './deeplink.controller';
import { DeeplinkService } from './deeplink.service';
import { EventsModule } from '../events/events.module';
import { SettingsModule } from '../settings/settings.module';
import { LinearModule } from '../linear/linear.module';

@Module({
  imports: [EventsModule, SettingsModule, LinearModule],
  controllers: [DeeplinkController],
  providers: [DeeplinkService],
  exports: [DeeplinkService],
})
export class DeeplinkModule {}
