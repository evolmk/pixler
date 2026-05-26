import { CheckCircle2, Circle, Loader2, MinusCircle, XCircle, Clock } from 'lucide-react';
import { useWorkflowState } from '../hooks/useWorkflowState';
import type { WorkflowStepState } from '../hooks/useWorkflowState';

interface Props {
  workspaceId: string;
}

function StepIcon({ status }: { status: WorkflowStepState['status'] }) {
  switch (status) {
    case 'running':
      return <Loader2 className="size-3 animate-spin text-primary" />;
    case 'completed':
      return <CheckCircle2 className="size-3 text-green-500" />;
    case 'failed':
      return <XCircle className="size-3 text-destructive" />;
    case 'skipped':
      return <MinusCircle className="size-3 text-muted-foreground" />;
    case 'awaiting_approval':
    case 'awaiting_run':
      return <Clock className="size-3 text-yellow-500" />;
    default:
      return <Circle className="size-3 text-muted-foreground/40" />;
  }
}

export function WorkflowStepIndicator({ workspaceId }: Props) {
  const { steps, status } = useWorkflowState(workspaceId);

  if (status === 'idle' || steps.length === 0) return null;

  return (
    <div className="border-b border-border bg-muted/30 px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1">
            {i > 0 && <span className="text-muted-foreground/40">›</span>}
            <div className="flex items-center gap-1">
              <StepIcon status={step.status} />
              <span
                className={[
                  'text-[11px]',
                  step.status === 'running' || step.status === 'awaiting_approval' || step.status === 'awaiting_run'
                    ? 'font-medium text-foreground'
                    : step.status === 'completed'
                    ? 'text-muted-foreground line-through'
                    : step.status === 'skipped'
                    ? 'text-muted-foreground/60 line-through'
                    : step.status === 'failed'
                    ? 'text-destructive'
                    : 'text-muted-foreground/40',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
