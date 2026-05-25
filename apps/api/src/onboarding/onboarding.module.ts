import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { ToolDetectorService } from './tool-detector.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [OnboardingController],
  providers: [OnboardingService, ToolDetectorService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
