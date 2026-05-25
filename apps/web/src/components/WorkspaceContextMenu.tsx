import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pixler/ui/components/dropdown-menu';
import { MoreHorizontal, Pin, PinOff, Archive, Trash2, RefreshCw, MonitorPlay, Code2 } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { usePatchWorkspace, useArchiveWorkspace, useRerunSetup } from '../hooks/useWorkspaces';
import { useRunStatus } from '../hooks/useRun';
import { useOpenInIde } from '../hooks/useIDEs';
import type { Workspace } from '@pixler/shared-types';

interface WorkspaceContextMenuProps {
  workspace: Workspace;
  onRemove: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WorkspaceContextMenu({ workspace, onRemove, open, onOpenChange }: WorkspaceContextMenuProps) {
  const patch = usePatchWorkspace();
  const archive = useArchiveWorkspace();
  const rerun = useRerunSetup();
  const { data: runStatus } = useRunStatus(workspace.id);
  const openInIde = useOpenInIde(workspace.id);

  const isRunReady = runStatus?.state === 'ready';

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="opacity-0 motion-safe:transition-opacity group-hover:opacity-100"
          aria-label="Workspace options"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => patch.mutate({ id: workspace.id, dto: { pinned: !workspace.pinned } })}
        >
          {workspace.pinned ? (
            <><PinOff className="mr-2 size-3.5" /> Unpin</>
          ) : (
            <><Pin className="mr-2 size-3.5" /> Pin</>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => rerun.mutate(workspace.id)}
          disabled={rerun.isPending}
        >
          <RefreshCw className="mr-2 size-3.5" /> Re-run setup
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void openInIde.mutateAsync({})}>
          <Code2 className="mr-2 size-3.5" /> Open in IDE
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!isRunReady || !runStatus?.port}
          onClick={() => isRunReady && runStatus?.port && window.open(`http://localhost:${runStatus.port}`, '_blank')}
        >
          <MonitorPlay className="mr-2 size-3.5" /> Open app
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => archive.mutate(workspace.id)}
          disabled={archive.isPending || workspace.state === 'archived'}
        >
          <Archive className="mr-2 size-3.5" /> Archive
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onRemove}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-3.5" /> Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
