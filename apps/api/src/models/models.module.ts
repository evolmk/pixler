import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelProberService } from './model-prober.service';
import { DatabaseModule } from '../db/database.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [ModelsController],
  providers: [ModelProberService],
  exports: [ModelProberService],
})
export class ModelsModule {}
