import { Controller, Get, Post, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { ToolDetectorService } from './tool-detector.service';

@Controller('api/onboarding')
export class OnboardingController {
  constructor(
    private readonly onboarding: OnboardingService,
    private readonly detector: ToolDetectorService,
  ) {}

  @Get('status')
  getStatus() {
    return this.onboarding.getStatus();
  }

  @Post('complete')
  complete() {
    return this.onboarding.complete();
  }

  @Post('restart')
  restart() {
    return this.onboarding.restart();
  }

  @Post('step')
  setStep(@Body() body: { step: number }) {
    this.onboarding.setStep(body.step);
    return this.onboarding.getStatus();
  }

  @Get('detect-tools')
  detectTools() {
    return this.detector.detect();
  }
}
