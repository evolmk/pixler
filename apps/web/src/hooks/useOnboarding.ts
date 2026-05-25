import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface OnboardingStatus {
  complete: boolean;
  completedAt: number | null;
  currentStep: number;
}

export interface ToolStatus {
  available: boolean;
  version: string | null;
  authenticated: boolean | null;
}

export interface DetectedTools {
  git: ToolStatus;
  claude: ToolStatus;
  codex: ToolStatus;
  gemini: ToolStatus;
  gh: ToolStatus;
}

async function fetchStatus(): Promise<OnboardingStatus> {
  const res = await fetch('/api/onboarding/status');
  return res.json();
}

async function postComplete(): Promise<OnboardingStatus> {
  const res = await fetch('/api/onboarding/complete', { method: 'POST' });
  return res.json();
}

async function postRestart(): Promise<OnboardingStatus> {
  const res = await fetch('/api/onboarding/restart', { method: 'POST' });
  return res.json();
}

async function postStep(step: number): Promise<OnboardingStatus> {
  const res = await fetch('/api/onboarding/step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step }),
  });
  return res.json();
}

async function fetchDetectTools(): Promise<DetectedTools> {
  const res = await fetch('/api/onboarding/detect-tools');
  return res.json();
}

export function useOnboardingStatus() {
  return useQuery({ queryKey: ['onboarding', 'status'], queryFn: fetchStatus });
}

export function useDetectTools(enabled = false) {
  return useQuery({
    queryKey: ['onboarding', 'detect-tools'],
    queryFn: fetchDetectTools,
    enabled,
    staleTime: 30_000,
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postComplete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
  });
}

export function useRestartOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRestart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
  });
}

export function useSetOnboardingStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postStep,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
  });
}
