import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { socket } from '../lib/socket';
import type { StepEventType } from '@pixler/orchestrator';
import type { RetryStepDto } from '@pixler/shared-types';

export interface WorkflowStepState {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed' | 'awaiting_approval' | 'awaiting_run';
  prompt?: string;
}

export interface WorkflowRunState {
  steps: WorkflowStepState[];
  currentStepId: string | null;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'paused' | 'idle';
}

interface WorkflowSocketEvent {
  type: 'workflow.step';
  stepEventType: StepEventType;
  stepId: string;
  label?: string;
  payload?: unknown;
  error?: string;
  workspaceId: string;
  timestamp: number;
}

interface WorkflowStepPromptEvent {
  type: 'workflow.step-prompt';
  workspaceId: string;
  stepId: string;
  stepLabel: string;
  prompt: string;
  timestamp: number;
}

interface WorkflowStepAdvancedEvent {
  type: 'workflow.step-advanced';
  workspaceId: string;
  stepId: string;
  status: string;
  timestamp: number;
}

const STEP_EVENT_STATUS: Record<StepEventType, WorkflowStepState['status']> = {
  'step:start': 'running',
  'step:complete': 'completed',
  'step:error': 'failed',
  'step:skipped': 'skipped',
  'step:approval': 'awaiting_approval',
};

export function useWorkflowState(workspaceId: string | undefined): WorkflowRunState {
  const [state, setState] = useState<WorkflowRunState>({
    steps: [],
    currentStepId: null,
    status: 'idle',
  });

  const handleWorkflowStep = useCallback((event: WorkflowSocketEvent) => {
    if (event.workspaceId !== workspaceId) return;

    setState((prev) => {
      const steps = [...prev.steps];
      const idx = steps.findIndex((s) => s.id === event.stepId);
      const newStatus = STEP_EVENT_STATUS[event.stepEventType] ?? 'running';

      const updated: WorkflowStepState = idx >= 0
        ? { ...steps[idx]!, status: newStatus, label: event.label ?? steps[idx]!.label }
        : { id: event.stepId, label: event.label ?? event.stepId, status: newStatus };

      if (idx >= 0) steps[idx] = updated;
      else steps.push(updated);

      const currentStepId =
        newStatus === 'running' || newStatus === 'awaiting_approval' || newStatus === 'awaiting_run'
          ? updated.id
          : newStatus === 'completed' || newStatus === 'skipped' || newStatus === 'failed'
          ? null
          : prev.currentStepId;

      return { steps, currentStepId, status: 'running' };
    });
  }, [workspaceId]);

  const handleStepPrompt = useCallback((event: WorkflowStepPromptEvent) => {
    if (event.workspaceId !== workspaceId) return;

    setState((prev) => {
      const steps = [...prev.steps];
      const idx = steps.findIndex((s) => s.id === event.stepId);

      const updated: WorkflowStepState = idx >= 0
        ? { ...steps[idx]!, status: 'awaiting_run', label: event.stepLabel, prompt: event.prompt }
        : { id: event.stepId, label: event.stepLabel, status: 'awaiting_run', prompt: event.prompt };

      if (idx >= 0) steps[idx] = updated;
      else steps.push(updated);

      return { steps, currentStepId: event.stepId, status: 'running' };
    });
  }, [workspaceId]);

  const handleStepAdvanced = useCallback((event: WorkflowStepAdvancedEvent) => {
    if (event.workspaceId !== workspaceId) return;

    setState((prev) => {
      const steps = prev.steps.map((s) =>
        s.id === event.stepId ? { ...s, status: event.status as WorkflowStepState['status'], prompt: undefined } : s,
      );
      return { ...prev, steps, currentStepId: null };
    });
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) return;

    const handler = (event: unknown) => {
      const e = event as { type?: string };
      if (e.type === 'workflow.step') {
        handleWorkflowStep(event as WorkflowSocketEvent);
      } else if (e.type === 'workflow.step-prompt') {
        handleStepPrompt(event as WorkflowStepPromptEvent);
      } else if (e.type === 'workflow.step-advanced') {
        handleStepAdvanced(event as WorkflowStepAdvancedEvent);
      } else if (e.type === 'agent.done') {
        setState((prev) => ({ ...prev, status: 'completed' }));
      } else if (e.type === 'agent.error') {
        setState((prev) => ({ ...prev, status: 'failed' }));
      }
    };

    socket.on('workspace:event', handler);
    return () => { socket.off('workspace:event', handler); };
  }, [workspaceId, handleWorkflowStep, handleStepPrompt, handleStepAdvanced]);

  return state;
}

// ── Workflow step mutation hooks ──────────────────────────────────────────────

export function useMarkStepDone(workspaceId: string) {
  return useMutation({
    mutationFn: () =>
      fetch(`/api/workspaces/${workspaceId}/orchestrator/step/done`, { method: 'POST' }).then((r) => r.json()),
  });
}

export function usePauseStep(workspaceId: string) {
  return useMutation({
    mutationFn: () =>
      fetch(`/api/workspaces/${workspaceId}/orchestrator/step/pause`, { method: 'POST' }).then((r) => r.json()),
  });
}

export function useSendToTerminal(workspaceId: string) {
  return useMutation({
    mutationFn: () =>
      fetch(`/api/workspaces/${workspaceId}/orchestrator/step/send-to-terminal`, { method: 'POST' }).then((r) => r.json()),
  });
}

export function useRetryStep(workspaceId: string) {
  return useMutation({
    mutationFn: (dto: RetryStepDto) =>
      fetch(`/api/workspaces/${workspaceId}/orchestrator/step/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      }).then((r) => r.json()),
  });
}

export function useCurrentStepPrompt(workspaceId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['workflow-step-prompt', workspaceId],
    queryFn: async () => {
      const r = await fetch(`/api/workspaces/${workspaceId}/orchestrator/step/current-prompt`);
      if (!r.ok) return null;
      return r.json() as Promise<{ stepId: string; label: string; prompt: string } | null>;
    },
    enabled: !!workspaceId && enabled,
    refetchInterval: false,
  });
}
