import { GitPullRequest, GitMerge, XCircle, Clock } from 'lucide-react';
import { usePullRequest } from '../hooks/usePullRequest';
import { useChecks } from '../hooks/useChecks';
import type { PrCheck } from '@pixler/shared-types';

function checksIcon(checks: PrCheck[]) {
  if (checks.length === 0) return null;
  const failed = checks.some((c) => c.conclusion === 'failure' || c.conclusion === 'timed_out');
  const pending = checks.some((c) => c.status !== 'completed');
  if (failed) return <XCircle className="size-3 text-destructive" />;
  if (pending) return <Clock className="size-3 text-warning" />;
  return null;
}

export function PrStatusBadge({ workspaceId }: { workspaceId: string }) {
  const { data: pr } = usePullRequest(workspaceId);
  const { data: checks = [] } = useChecks(pr ? workspaceId : undefined);

  if (!pr) return null;

  const Icon = pr.state === 'MERGED' ? GitMerge : GitPullRequest;
  const colorClass =
    pr.state === 'MERGED'
      ? 'text-success'
      : pr.state === 'CLOSED'
        ? 'text-muted-foreground'
        : 'text-primary';

  return (
    <a
      href={pr.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium leading-none ${colorClass} hover:bg-accent transition-colors`}
    >
      <Icon className="size-3" />
      #{pr.number}
      {checksIcon(checks)}
    </a>
  );
}
