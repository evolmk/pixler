import { ThumbsDown, ThumbsUp, StopCircle } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import {
  useOrchestratorState,
  useOrchestratorApprove,
  useOrchestratorReject,
  useOrchestratorInterrupt,
  GATE_PHASES,
  ACTIVE_PHASES,
} from '../hooks/useOrchestrator';

interface Props {
  workspaceId: string;
  onInterrupt?: () => void;
}

export function RightPaneControls({ workspaceId, onInterrupt }: Props) {
  const { data: state } = useOrchestratorState(workspaceId);
  const approve = useOrchestratorApprove(workspaceId);
  const reject = useOrchestratorReject(workspaceId);
  const interrupt = useOrchestratorInterrupt(workspaceId);

  const phase = state?.phase ?? 'idle';
  const isGate = GATE_PHASES.has(phase);
  const isActive = ACTIVE_PHASES.has(phase);

  const handleInterrupt = () => {
    interrupt.mutate();
    onInterrupt?.();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={!isActive}
        onClick={handleInterrupt}
        className="gap-1.5 text-xs"
      >
        <StopCircle className="size-3.5" />
        Interrupt
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!isGate || reject.isPending}
        onClick={() => reject.mutate(undefined)}
        className="gap-1.5 text-xs"
      >
        <ThumbsDown className="size-3.5" />
        Reject
      </Button>
      <Button
        size="sm"
        disabled={!isGate || approve.isPending}
        onClick={() => approve.mutate()}
        className="gap-1.5 text-xs"
      >
        <ThumbsUp className="size-3.5" />
        Approve
      </Button>
    </>
  );
}
