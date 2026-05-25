import { RefreshCw, GitCompare } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useDiffFiles } from '../../hooks/useDiff';
import { useQueryClient } from '@tanstack/react-query';
import type { DiffStatus } from '@pixler/shared-types';

interface Props {
  workspaceId: string;
  onOpenDiff?: () => void;
}

function statusColor(status: DiffStatus): string {
  if (status === 'A') return 'text-green-600 dark:text-green-400';
  if (status === 'D') return 'text-red-500';
  return 'text-yellow-600 dark:text-yellow-400';
}

export function GitStatusCard({ workspaceId, onOpenDiff }: Props) {
  const qc = useQueryClient();
  const { data: files = [], isFetching } = useDiffFiles(workspaceId);

  const refresh = () => void qc.invalidateQueries({ queryKey: ['diff', workspaceId] });

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium">Git Status</span>
        <div className="flex gap-1">
          {onOpenDiff && (
            <Button variant="ghost" size="icon-xs" onClick={onOpenDiff} title="Open diff viewer">
              <GitCompare className="size-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon-xs" onClick={refresh} disabled={isFetching}>
            <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      {files.length === 0 ? (
        <p className="text-xs text-muted-foreground">No changes</p>
      ) : (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">{files.length} changed file{files.length !== 1 ? 's' : ''}</div>
          <div className="mt-1.5 space-y-0.5 max-h-24 overflow-y-auto">
            {files.slice(0, 8).map((f) => (
              <div key={f.path} className="flex items-center gap-1.5 text-[10px]">
                <span className={`font-mono ${statusColor(f.status)}`}>{f.status}</span>
                <span className="truncate text-muted-foreground font-mono">{f.path}</span>
              </div>
            ))}
            {files.length > 8 && (
              <span className="text-[10px] text-muted-foreground">+{files.length - 8} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
