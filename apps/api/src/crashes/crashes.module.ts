import { Module } from '@nestjs/common';
import { CrashesService } from './crashes.service';
import { CrashesController } from './crashes.controller';
import { TelemetryModule } from '../telemetry/telemetry.module';

@Module({
  imports: [TelemetryModule],
  controllers: [CrashesController],
  providers: [CrashesService],
  exports: [CrashesService],
})
export class CrashesModule {}
