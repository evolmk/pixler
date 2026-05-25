import { Module } from '@nestjs/common';
import { CrashesService } from './crashes.service';
import { CrashesController } from './crashes.controller';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { LogsModule } from '../common/logger/logs.module';

@Module({
  imports: [TelemetryModule, LogsModule],
  controllers: [CrashesController],
  providers: [CrashesService],
  exports: [CrashesService],
})
export class CrashesModule {}
