import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

export interface OnboardingStatus {
  complete: boolean;
  completedAt: number | null;
  currentStep: number;
}

@Injectable()
export class OnboardingService {
  constructor(private readonly settings: SettingsService) {}

  getStatus(): OnboardingStatus {
    const completedAt = this.settings.get('onboarding.completedAt') as number;
    const currentStep = this.settings.get('onboarding.currentStep') as number;
    return {
      complete: completedAt > 0,
      completedAt: completedAt > 0 ? completedAt : null,
      currentStep: currentStep ?? 1,
    };
  }

  complete(): OnboardingStatus {
    const now = Math.floor(Date.now() / 1000);
    this.settings.set('onboarding.completedAt', now, { scope: 'global' });
    this.settings.set('onboarding.currentStep', 5, { scope: 'global' });
    return this.getStatus();
  }

  restart(): OnboardingStatus {
    this.settings.set('onboarding.completedAt', 0, { scope: 'global' });
    this.settings.set('onboarding.currentStep', 1, { scope: 'global' });
    return this.getStatus();
  }

  setStep(step: number): void {
    this.settings.set('onboarding.currentStep', step, { scope: 'global' });
  }
}
