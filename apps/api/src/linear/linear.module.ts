import { Module } from '@nestjs/common';
import { LinearController } from './linear.controller';
import { LinearService } from './linear.service';
import { SecretStoreService } from './secret-store.service';
import { SyncScheduler } from './sync.scheduler';
import { StateMapService } from './state-map.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [LinearController],
  providers: [LinearService, SecretStoreService, SyncScheduler, StateMapService],
  exports: [LinearService, SyncScheduler],
})
export class LinearModule {}
