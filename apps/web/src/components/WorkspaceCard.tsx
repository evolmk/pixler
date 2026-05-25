import type { Workspace, WorkspaceState } from '@pixler/shared-types';
import { Badge } from '@pixler/ui/components/badge';
import { WorkspaceContextMenu } from './WorkspaceContextMenu';

const STATE_COLORS: Record<WorkspaceState, string> = {
  pending: '#94a3b8',
  setting_up: '#f59e0b',
  ready: '#16a355',
  error: '#ef4444',
  archived: '#6b7280',
};

const STATE_BADGE: Record<WorkspaceState, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'outline',
  setting_up: 'secondary',
  ready: 'default',
  error: 'destructive',
  archived: 'outline',
};

const STATE_LABEL: Record<WorkspaceState, string> = {
  pending: 'pending',
  setting_up: 'setup',
  ready: 'ready',
  error: 'error',
  archived: 'archived',
};

interface WorkspaceCardProps {
  workspace: Workspace;
  onRemove: () => void;
}

export function WorkspaceCard({ workspace, onRemove }: WorkspaceCardProps) {
  const dotColor = STATE_COLORS[workspace.state];

  return (
    <div className="group flex cursor-default items-center gap-2 rounded-md px-2 py-2 hover:bg-accent">
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      <span className="flex-1 truncate text-sm">{workspace.name}</span>
      {workspace.pinned && (
        <span className="text-xs text-muted-foreground">📌</span>
      )}
      <Badge variant={STATE_BADGE[workspace.state]} className="py-0 text-[10px]">
        {STATE_LABEL[workspace.state]}
      </Badge>
      <WorkspaceContextMenu workspace={workspace} onRemove={onRemove} />
    </div>
  );
}
