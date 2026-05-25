import { Module } from '@nestjs/common';
import { FileLoggerService } from './file-logger.service';
import { SettingsModule } from '../../settings/settings.module';

@Module({
  imports: [SettingsModule],
  providers: [FileLoggerService],
  exports: [FileLoggerService],
})
export class LogsModule {}
