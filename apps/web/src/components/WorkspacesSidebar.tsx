import { Maximize2, Minimize2, MoreHorizontal } from 'lucide-react';
import { Badge } from '@pixler/ui/components/badge';
import { Button } from '@pixler/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pixler/ui/components/dropdown-menu';
import { useLayoutStore } from '../stores/layout';
import { BigTerminalToggle } from './BigTerminalToggle';

type WorkspaceState = 'idle' | 'running' | 'waiting' | 'done';

interface PlaceholderWorkspace {
  id: string;
  name: string;
  color: string;
  state: WorkspaceState;
}

const BADGE_VARIANT: Record<WorkspaceState, 'default' | 'secondary' | 'outline'> = {
  running: 'default',
  waiting: 'secondary',
  idle: 'outline',
  done: 'secondary',
};

const PLACEHOLDER_WORKSPACES: PlaceholderWorkspace[] = [
  { id: '1', name: 'feat/onboarding', color: '#16a355', state: 'running' },
  { id: '2', name: 'fix/auth-redirect', color: '#3b82f6', state: 'waiting' },
  { id: '3', name: 'chore/upgrade-deps', color: '#f59e0b', state: 'idle' },
];

export function WorkspacesSidebar() {
  const fullBleed = useLayoutStore((s) => s.fullBleed);
  const setFullBleed = useLayoutStore((s) => s.setFullBleed);
  const isExpanded = fullBleed === 'sidebar';

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Workspaces
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setFullBleed(isExpanded ? null : 'sidebar')}
          aria-label={isExpanded ? 'Restore sidebar' : 'Expand sidebar full-bleed'}
        >
          {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        </Button>
      </div>

      {/* Workspace cards */}
      <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {PLACEHOLDER_WORKSPACES.map((ws) => (
          <div
            key={ws.id}
            className="group flex cursor-default items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: ws.color }}
            />
            <span className="flex-1 truncate text-sm">{ws.name}</span>
            <Badge variant={BADGE_VARIANT[ws.state]} className="py-0 text-[10px]">
              {ws.state}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Workspace options"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Actions land in M08
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <BigTerminalToggle />
    </div>
  );
}
