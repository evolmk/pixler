import { Body, Controller, Get, Post } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

interface TrackDto {
  name: string;
  props?: Record<string, unknown>;
}

@Controller('api/telemetry')
export class TelemetryController {
  constructor(private readonly telemetry: TelemetryService) {}

  @Post('track')
  track(@Body() dto: TrackDto) {
    this.telemetry.track(dto.name, dto.props ?? {});
    return { ok: true };
  }

  @Get('preview')
  preview() {
    return { note: 'Preview shows buffered events — none pending until next flush.', buffer: [] };
  }
}
