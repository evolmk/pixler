import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  GitPullRequest,
  Zap,
  Archive,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useActivities, useMarkSeen, useUnseenCount } from '../hooks/useActivities';
import type { Activity, ActivityKind } from '@pixler/shared-types';

const KIND_ICONS: Partial<Record<ActivityKind, LucideIcon>> = {
  'pr.opened': GitPullRequest,
  'pr.merged': GitPullRequest,
  'pr.checks.failed': XCircle,
  'pr.checks.passed': CheckCircle,
  'agent.done': CheckCircle,
  'agent.error': XCircle,
  'agent.stuck': AlertTriangle,
  'workspace.archived': Archive,
  'context.spike': Zap,
};

function ActivityRow({ activity, onClick }: { activity: Activity; onClick: () => void }) {
  const Icon = KIND_ICONS[activity.kind] ?? Info;
  const ts = new Date(activity.created_at * 1000).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const colorClass =
    activity.severity === 'error'
      ? 'text-destructive'
      : activity.severity === 'warning'
        ? 'text-[oklch(0.75_0.15_85)]'
        : activity.severity === 'success'
          ? 'text-green-500'
          : 'text-muted-foreground';

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/40 ${!activity.seen ? 'bg-primary/5' : ''}`}
    >
      <Icon className={`mt-0.5 size-3.5 shrink-0 ${colorClass}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground">{activity.title}</p>
        {activity.body && (
          <p className="truncate text-[10px] text-muted-foreground">{activity.body}</p>
        )}
      </div>
      <span className="shrink-0 text-[10px] text-muted-foreground">{ts}</span>
    </button>
  );
}

export function ActivityTab() {
  const params = useParams({ strict: false }) as { projectId?: string; workspaceId?: string };
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'workspace'>('all');
  const markSeen = useMarkSeen();
  const { data: unseenCount = 0 } = useUnseenCount();

  const scope = filter === 'workspace' && params.workspaceId ? 'workspace' : undefined;
  const scopeId = filter === 'workspace' ? params.workspaceId : undefined;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useActivities({ scope, scopeId });

  const activities = data?.pages.flatMap((p) => p.activities) ?? [];

  const handleClick = (activity: Activity) => {
    if (!activity.seen) {
      markSeen.mutate({ ids: [activity.id] });
    }
    if (activity.scope === 'workspace' && activity.scope_id && params.projectId) {
      void navigate({ to: '/p/$projectId/w/$workspaceId', params: { projectId: params.projectId, workspaceId: activity.scope_id } });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Activity
          </span>
          {unseenCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              {unseenCount}
            </span>
          )}
        </div>
        <div className="flex rounded-md border border-border text-[10px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('workspace')}
            className={`px-2 py-0.5 ${filter === 'workspace' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            This workspace
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">No activity yet</p>
        ) : (
          <>
            {activities.map((a) => (
              <ActivityRow key={a.id} activity={a} onClick={() => handleClick(a)} />
            ))}
            {hasNextPage && (
              <button
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full px-3 py-2 text-center text-[10px] text-muted-foreground hover:text-foreground"
              >
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>

      {unseenCount > 0 && (
        <div className="shrink-0 border-t border-border p-2">
          <button
            onClick={() => {
              const unseenIds = activities.filter((a) => !a.seen).map((a) => a.id);
              if (unseenIds.length) markSeen.mutate({ ids: unseenIds });
            }}
            className="w-full rounded-md py-1 text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Mark all seen
          </button>
        </div>
      )}
    </div>
  );
}
