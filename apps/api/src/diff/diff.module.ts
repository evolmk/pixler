import { Module } from '@nestjs/common';
import { DiffController } from './diff.controller';
import { DiffService } from './diff.service';
import { WatcherService } from './watcher.service';
import { EventsModule } from '../events/events.module';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [EventsModule, DatabaseModule],
  controllers: [DiffController],
  providers: [DiffService, WatcherService],
  exports: [DiffService, WatcherService],
})
export class DiffModule {}
