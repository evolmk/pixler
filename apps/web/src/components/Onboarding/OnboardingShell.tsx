import { useEffect, useState } from 'react';
import type React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerPortal,
  DrawerOverlay,
} from '@pixler/ui/components/drawer';
import { Button } from '@pixler/ui/components/button';
import {
  useOnboardingStatus,
  useSetOnboardingStep,
  useCompleteOnboarding,
} from '../../hooks/useOnboarding';
import { Step1Appearance } from './Step1Appearance';
import { Step2Tools } from './Step2Tools';
import { Step3Linear } from './Step3Linear';
import { Step4Project } from './Step4Project';
import { Step5Telemetry } from './Step5Telemetry';

const STEP_LABELS = ['Appearance', 'Tools', 'Linear', 'Project', 'Telemetry'];

const STEPS: Array<() => React.ReactNode> = [
  Step1Appearance,
  Step2Tools,
  Step3Linear,
  Step4Project,
  Step5Telemetry,
];

interface Props {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function OnboardingShell({ forceOpen, onClose }: Props) {
  const { data: status, isLoading } = useOnboardingStatus();
  const setStep = useSetOnboardingStep();
  const complete = useCompleteOnboarding();

  const [step, setLocalStep] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && status) {
      if (forceOpen || !status.complete) {
        setLocalStep(status.currentStep ?? 1);
        setOpen(true);
      }
    }
  }, [isLoading, status, forceOpen]);

  const handleStepChange = (next: number) => {
    setLocalStep(next);
    setStep.mutate(next);
  };

  const handleSkip = () => {
    if (step < 5) {
      handleStepChange(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) handleStepChange(step - 1);
  };

  const handleNext = () => {
    if (step < 5) {
      handleStepChange(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    complete.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        onClose?.();
      },
    });
  };

  const handleOpenChange = (v: boolean) => {
    if (!v && !status?.complete) {
      // treat close as skip all — complete silently
      complete.mutate(undefined);
    }
    setOpen(v);
    if (!v) onClose?.();
  };

  if (isLoading) return null;
  if (!open) return null;

  const StepComponent = STEPS[step - 1];

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="right" modal>
      <DrawerPortal>
        <DrawerOverlay />
        <div
          data-vaul-drawer-direction="right"
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-background shadow-xl outline-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 px-8 pt-8 pb-2">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              return (
                <div key={label} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`h-1 w-full rounded-full transition-colors ${
                      done
                        ? 'bg-primary'
                        : active
                          ? 'bg-primary/60'
                          : 'bg-muted'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <StepComponent />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-8 py-4">
            <Button variant="ghost" size="sm" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Skip — I'll do this later
              </button>
              <Button size="sm" onClick={handleNext} disabled={complete.isPending}>
                {step === 5 ? 'Finish' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </DrawerPortal>
    </Drawer>
  );
}
