import { useCallback, useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import type { StepEventType } from '@pixler/orchestrator';

export interface WorkflowStepState {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed' | 'awaiting_approval';
}

export interface WorkflowRunState {
  steps: WorkflowStepState[];
  currentStepId: string | null;
  status: 'running' | 'completed' | 'failed' | 'cancelled' | 'idle';
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
        newStatus === 'running' || newStatus === 'awaiting_approval'
          ? updated.id
          : newStatus === 'completed' || newStatus === 'skipped' || newStatus === 'failed'
          ? null
          : prev.currentStepId;

      return { steps, currentStepId, status: 'running' };
    });
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) return;

    const handler = (event: unknown) => {
      const e = event as { type?: string };
      if (e.type === 'workflow.step') {
        handleWorkflowStep(event as WorkflowSocketEvent);
      } else if (e.type === 'agent.done') {
        setState((prev) => ({ ...prev, status: 'completed' }));
      } else if (e.type === 'agent.error') {
        setState((prev) => ({ ...prev, status: 'failed' }));
      }
    };

    socket.on('workspace:event', handler);
    return () => { socket.off('workspace:event', handler); };
  }, [workspaceId, handleWorkflowStep]);

  return state;
}
