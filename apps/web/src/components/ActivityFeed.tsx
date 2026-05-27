import { useState } from 'react';
import { Bell, CheckCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@pixler/ui/components/button';
import { useActivities, useMarkAllActivitiesSeen, useMarkSeen } from '../hooks/useActivities';
import type { Activity } from '../hooks/useActivities';

const SEVERITY_COLORS: Record<string, string> = {
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-destructive',
  hint: 'text-blue-500',
  info: 'text-muted-foreground',
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function ActivityRow({ activity, onClick }: { activity: Activity; onClick: () => void }) {
  const color = SEVERITY_COLORS[activity.severity] ?? 'text-muted-foreground';
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors ${activity.seen ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-2">
        {!activity.seen && (
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
        )}
        {activity.seen && <span className="mt-1.5 size-1.5 shrink-0" />}
        <div className="min-w-0 flex-1">
          <p className={`text-[11px] font-medium truncate ${color}`}>{activity.title}</p>
          {activity.body && (
            <p className="text-[10px] text-muted-foreground line-clamp-1">{activity.body}</p>
          )}
          <p className="text-[10px] text-muted-foreground/60">{timeAgo(activity.created_at)}</p>
        </div>
      </div>
    </button>
  );
}

export function ActivityFeed() {
  const [open, setOpen] = useState(false);
  const params = useParams({ strict: false }) as { workspaceId?: string };

  const { data } = useActivities({ scope: 'workspace' });
  const allActivities = data?.pages.flatMap((p) => p.activities) ?? [];
  const unseenCount = allActivities.filter((a) => !a.seen).length;

  const markAllSeen = useMarkAllActivitiesSeen();
  const markSeen = useMarkSeen();
  const navigate = useNavigate();

  const handleClick = (activity: Activity) => {
    if (!activity.seen) {
      void markSeen.mutate({ ids: [activity.id] });
    }
    if (activity.scope === 'workspace' && activity.scope_id) {
      void navigate({
        to: '/w/$workspaceId',
        params: { workspaceId: activity.scope_id },
      });
    }
  };

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 px-3 py-2 hover:bg-muted/30 transition-colors"
      >
        {open ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />}
        <Bell className="size-3 text-muted-foreground" />
        <span className="flex-1 text-[11px] text-muted-foreground">Activity</span>
        {unseenCount > 0 && (
          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
            {unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div>
          <div className="flex justify-end px-2 pb-1">
            <Button
              variant="ghost"
              size="icon-xs"
              title="Mark all seen"
              onClick={() => void markAllSeen.mutate()}
            >
              <CheckCheck className="size-3" />
            </Button>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {allActivities.length === 0 ? (
              <p className="px-3 py-4 text-center text-[11px] text-muted-foreground">No activity yet</p>
            ) : (
              allActivities.slice(0, 30).map((a) => (
                <ActivityRow key={a.id} activity={a} onClick={() => handleClick(a)} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
