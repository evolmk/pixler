import { useState } from 'react';
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
import type { Workspace } from '@pixler/shared-types';

interface WorkspaceContextMenuProps {
  workspace: Workspace;
  onRemove: () => void;
}

export function WorkspaceContextMenu({ workspace, onRemove }: WorkspaceContextMenuProps) {
  const patch = usePatchWorkspace();
  const archive = useArchiveWorkspace();
  const rerun = useRerunSetup();

  return (
    <DropdownMenu>
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
        <DropdownMenuItem disabled>
          <Code2 className="mr-2 size-3.5" /> Open in IDE <span className="ml-auto text-xs text-muted-foreground">M19</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <MonitorPlay className="mr-2 size-3.5" /> Open app <span className="ml-auto text-xs text-muted-foreground">M19</span>
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
