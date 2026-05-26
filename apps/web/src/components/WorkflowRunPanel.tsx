import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Loader2, MinusCircle, RotateCcw, Square, XCircle } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { cn } from '@pixler/ui/lib/utils';
import {
  useWorkflowState,
  useMarkStepDone,
  usePauseStep,
  useSendToTerminal,
  useRetryStep,
} from '../hooks/useWorkflowState';
import type { WorkflowStepState } from '../hooks/useWorkflowState';
import { StepPromptAccordion } from './StepPromptAccordion';
import { RetryStepDialog } from './RetryStepDialog';

interface Props {
  workspaceId: string;
}

function StepStatusIcon({ status }: { status: WorkflowStepState['status'] }) {
  switch (status) {
    case 'running':
      return <Loader2 className="size-3.5 animate-spin text-primary" />;
    case 'awaiting_run':
      return <Clock className="size-3.5 text-yellow-500" />;
    case 'awaiting_approval':
      return <Clock className="size-3.5 text-blue-500" />;
    case 'completed':
      return <CheckCircle2 className="size-3.5 text-green-500" />;
    case 'failed':
      return <XCircle className="size-3.5 text-destructive" />;
    case 'skipped':
      return <MinusCircle className="size-3.5 text-muted-foreground" />;
    default:
      return <Circle className="size-3.5 text-muted-foreground/30" />;
  }
}

interface RetryTarget {
  stepId: string;
  stepLabel: string;
  hasCheckpoint: boolean;
  checkpointLabel?: string;
  checkpointTime?: number;
}

export function WorkflowRunPanel({ workspaceId }: Props) {
  const wfState = useWorkflowState(workspaceId);
  const markDone = useMarkStepDone(workspaceId);
  const pauseStep = usePauseStep(workspaceId);
  const sendToTerminal = useSendToTerminal(workspaceId);
  const retryStep = useRetryStep(workspaceId);

  const [retryTarget, setRetryTarget] = useState<RetryTarget | null>(null);

  if (wfState.status === 'idle' || wfState.steps.length === 0) return null;

  const currentStep = wfState.steps.find((s) => s.id === wfState.currentStepId);
  const isAwaitingRun = currentStep?.status === 'awaiting_run';

  function handleRetry(step: WorkflowStepState) {
    setRetryTarget({
      stepId: step.id,
      stepLabel: step.label,
      hasCheckpoint: false, // TODO: fetch checkpoint info from run record
      checkpointLabel: undefined,
      checkpointTime: undefined,
    });
  }

  function handleRetryConfirm(addedContext: string, restoreCheckpoint: boolean) {
    if (!retryTarget) return;
    retryStep.mutate(
      { stepId: retryTarget.stepId, addedContext: addedContext || undefined, restoreCheckpoint },
      { onSuccess: () => setRetryTarget(null) },
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Workflow steps
        </p>
        <div className="flex items-center gap-1">
          {isAwaitingRun && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => markDone.mutate()}
                disabled={markDone.isPending}
              >
                <CheckCircle2 className="mr-1 size-3" />
                Mark done
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground"
                onClick={() => pauseStep.mutate()}
                disabled={pauseStep.isPending}
              >
                <Square className="mr-1 size-3" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {wfState.steps.map((step) => {
          const isActive = step.status === 'running' || step.status === 'awaiting_run' || step.status === 'awaiting_approval';
          const isFailed = step.status === 'failed';

          return (
            <div
              key={step.id}
              className={cn(
                'group flex flex-col gap-1 rounded px-2 py-1',
                isActive && 'bg-muted/50',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <StepStatusIcon status={step.status} />
                  <span
                    className={cn(
                      'text-xs truncate',
                      isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
                      step.status === 'completed' && 'line-through opacity-60',
                      isFailed && 'text-destructive',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {(isFailed || step.status === 'completed') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRetry(step)}
                    title="Retry step"
                  >
                    <RotateCcw className="size-3" />
                  </Button>
                )}
              </div>

              {step.status === 'awaiting_run' && step.prompt && (
                <div className="mt-1">
                  <StepPromptAccordion
                    stepId={step.id}
                    stepLabel={step.label}
                    prompt={step.prompt}
                    onSendToTerminal={() => sendToTerminal.mutate()}
                    isSending={sendToTerminal.isPending}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {retryTarget && (
        <RetryStepDialog
          open={!!retryTarget}
          stepId={retryTarget.stepId}
          stepLabel={retryTarget.stepLabel}
          hasCheckpoint={retryTarget.hasCheckpoint}
          checkpointLabel={retryTarget.checkpointLabel}
          checkpointTime={retryTarget.checkpointTime}
          onConfirm={handleRetryConfirm}
          onCancel={() => setRetryTarget(null)}
          isPending={retryStep.isPending}
        />
      )}
    </div>
  );
}
