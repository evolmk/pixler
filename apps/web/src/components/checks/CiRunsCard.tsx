import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useChecks } from '../../hooks/useChecks';
import { useQueryClient } from '@tanstack/react-query';
import type { PrCheck } from '@pixler/shared-types';

interface Props {
  workspaceId: string;
}

function StatusIcon({ check }: { check: PrCheck }) {
  if (check.status === 'completed') {
    if (check.conclusion === 'success' || check.conclusion === 'skipped') return <CheckCircle className="size-3 text-green-500" />;
    if (check.conclusion === 'failure' || check.conclusion === 'timed_out' || check.conclusion === 'cancelled') return <XCircle className="size-3 text-destructive" />;
  }
  if (check.status === 'in_progress') return <Clock className="size-3 text-yellow-500 animate-pulse" />;
  return <AlertCircle className="size-3 text-muted-foreground" />;
}

export function CiRunsCard({ workspaceId }: Props) {
  const qc = useQueryClient();
  const { data: checks = [], isFetching } = useChecks(workspaceId);

  const refresh = () => void qc.invalidateQueries({ queryKey: ['checks', workspaceId] });

  const failCount = checks.filter((c) => c.status === 'completed' && (c.conclusion === 'failure' || c.conclusion === 'timed_out' || c.conclusion === 'cancelled')).length;

  return (
    <div className={`rounded-md border bg-card p-3 ${failCount > 0 ? 'border-destructive/50' : 'border-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium">CI Checks</span>
          {failCount > 0 && (
            <span className="rounded-full bg-destructive/15 px-1.5 py-0.5 text-[10px] text-destructive">
              {failCount} failing
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon-xs" onClick={refresh} disabled={isFetching}>
          <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      {checks.length === 0 ? (
        <p className="text-xs text-muted-foreground">No CI checks</p>
      ) : (
        <div className="space-y-1">
          {checks.map((check) => (
            <div key={check.name} className="flex items-center gap-1.5 text-xs">
              <StatusIcon check={check} />
              <span className="flex-1 truncate">{check.name}</span>
              <span className="text-[10px] text-muted-foreground">{check.conclusion ?? check.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
