import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrashesService } from './crashes.service';

interface ReportCrashDto {
  source?: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

@Controller('api/crashes')
export class CrashesController {
  constructor(private readonly crashes: CrashesService) {}

  @Post()
  report(@Body() dto: ReportCrashDto) {
    const id = this.crashes.record(
      dto.source ?? 'web',
      dto.message,
      dto.stack ?? '',
      dto.context ?? {},
    );
    return { id };
  }

  @Get()
  list() {
    return this.crashes.list();
  }
}
