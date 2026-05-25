import { Controller, Post, Get, Body, HttpCode } from '@nestjs/common';
import { DeeplinkService } from './deeplink.service';

@Controller('deeplink')
export class DeeplinkController {
  constructor(private readonly deeplink: DeeplinkService) {}

  @Post()
  @HttpCode(200)
  handle(@Body('url') url: string): { ok: boolean } {
    if (typeof url !== 'string') return { ok: false };
    this.deeplink.handle(url);
    return { ok: true };
  }

  @Get('scheme-status')
  schemeStatus() {
    return this.deeplink.schemeStatus();
  }

  @Post('register-scheme')
  @HttpCode(200)
  registerScheme() {
    return this.deeplink.registerScheme();
  }
}
