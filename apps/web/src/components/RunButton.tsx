import { Play, Square, Loader2 } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useRunStatus, useStartRun, useStopRun } from '../hooks/useRun';

interface Props {
  workspaceId: string;
}

export function RunButton({ workspaceId }: Props) {
  const { data: status } = useRunStatus(workspaceId);
  const startRun = useStartRun(workspaceId);
  const stopRun = useStopRun(workspaceId);

  const state = status?.state ?? 'stopped';
  const isActive = state === 'starting' || state === 'running' || state === 'ready';
  const isPending = state === 'starting' || state === 'stopping' || startRun.isPending || stopRun.isPending;

  const handleClick = () => {
    if (isActive) {
      void stopRun.mutateAsync();
    } else {
      void startRun.mutateAsync({});
    }
  };

  return (
    <Button
      variant={isActive ? 'destructive' : 'outline'}
      size="sm"
      className="h-6 gap-1.5 text-xs"
      disabled={isPending}
      onClick={handleClick}
      aria-label={isActive ? 'Stop dev server' : 'Start dev server'}
    >
      {isPending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : isActive ? (
        <Square className="size-3" />
      ) : (
        <Play className="size-3" />
      )}
      {isActive ? 'Stop' : 'Run'}
    </Button>
  );
}
