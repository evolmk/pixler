import { useState } from 'react';
import { ThumbsDown, ThumbsUp, StopCircle, Play } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import {
  useOrchestratorState,
  useOrchestratorStart,
  useOrchestratorApprove,
  useOrchestratorReject,
  useOrchestratorInterrupt,
  GATE_PHASES,
  ACTIVE_PHASES,
} from '../hooks/useOrchestrator';
import { PreflightModal } from './PreflightModal';
import type { StartResponse } from '../hooks/useOrchestrator';

interface Props {
  workspaceId: string;
  onInterrupt?: () => void;
}

export function RightPaneControls({ workspaceId, onInterrupt }: Props) {
  const { data: state } = useOrchestratorState(workspaceId);
  const start = useOrchestratorStart(workspaceId);
  const approve = useOrchestratorApprove(workspaceId);
  const reject = useOrchestratorReject(workspaceId);
  const interrupt = useOrchestratorInterrupt(workspaceId);

  const [preflight, setPreflight] = useState<StartResponse['preflight'] | null>(null);

  const phase = state?.phase ?? 'idle';
  const isGate = GATE_PHASES.has(phase);
  const isActive = ACTIVE_PHASES.has(phase);
  const isIdle = phase === 'idle' || phase === 'done' || phase === 'error';

  const handleInterrupt = () => {
    interrupt.mutate();
    onInterrupt?.();
  };

  const handleStart = (override = false) => {
    start.mutate(override, {
      onSuccess: (res) => {
        if (res.needsConfirmation && res.preflight) {
          setPreflight(res.preflight);
        }
      },
    });
  };

  return (
    <>
      {isIdle ? (
        <Button
          size="sm"
          disabled={start.isPending}
          onClick={() => handleStart(false)}
          className="gap-1.5 text-xs"
        >
          <Play className="size-3.5" />
          Start Agent
        </Button>
      ) : (
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
      )}

      {preflight && (
        <PreflightModal
          open={true}
          percent={preflight.percent}
          parallelCount={preflight.parallelCount}
          onConfirm={() => { setPreflight(null); handleStart(true); }}
          onCancel={() => setPreflight(null)}
        />
      )}
    </>
  );
}
