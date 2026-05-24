import { Controller, Get } from '@nestjs/common';

const startTime = Date.now();

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      ok: true,
      version: '0.0.1',
      uptimeMs: Date.now() - startTime,
      env: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
    };
  }
}
