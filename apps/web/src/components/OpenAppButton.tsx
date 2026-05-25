import { ExternalLink } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useRunStatus } from '../hooks/useRun';

interface Props {
  workspaceId: string;
}

export function OpenAppButton({ workspaceId }: Props) {
  const { data: status } = useRunStatus(workspaceId);

  if (status?.state !== 'ready' || !status.port) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-6 gap-1.5 text-xs"
      onClick={() => window.open(`http://localhost:${status.port}`, '_blank')}
      aria-label="Open running app"
    >
      <ExternalLink className="size-3" />
      Open app
    </Button>
  );
}
