import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityListeners } from './activity.listeners';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ActivityService, ActivityListeners],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
