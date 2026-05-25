import { Module } from '@nestjs/common';
import { LinearController } from './linear.controller';
import { LinearService } from './linear.service';
import { SecretStoreService } from './secret-store.service';
import { SyncScheduler } from './sync.scheduler';
import { StateMapService } from './state-map.service';
import { LinearMutationsService } from './linear-mutations.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [LinearController],
  providers: [LinearService, SecretStoreService, SyncScheduler, StateMapService, LinearMutationsService],
  exports: [LinearService, SyncScheduler, StateMapService],
})
export class LinearModule {}
