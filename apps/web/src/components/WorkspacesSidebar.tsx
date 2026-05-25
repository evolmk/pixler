import { useState } from 'react';
import { Maximize2, Minimize2, Plus } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useParams } from '@tanstack/react-router';
import { useLayoutStore } from '../stores/layout';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { WorkspaceCard } from './WorkspaceCard';
import { NewWorkspaceDialog } from './NewWorkspaceDialog';
import { RemoveWorkspaceModal } from './RemoveWorkspaceModal';
import { BigTerminalToggle } from './BigTerminalToggle';
import { LinearTicketList } from './LinearTicketList';
import type { Workspace } from '@pixler/shared-types';

export function WorkspacesSidebar() {
  const fullBleed = useLayoutStore((s) => s.fullBleed);
  const setFullBleed = useLayoutStore((s) => s.setFullBleed);
  const isExpanded = fullBleed === 'sidebar';

  const params = useParams({ strict: false }) as { projectId?: string };
  const projectId = params.projectId;

  const { data: workspaces = [] } = useWorkspaces(projectId);
  const [newOpen, setNewOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<Workspace | null>(null);

  const active = workspaces.filter((w) => w.state !== 'archived');
  const archived = workspaces.filter((w) => w.state === 'archived');

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Workspaces
        </span>
        <div className="flex items-center gap-1">
          {projectId && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setNewOpen(true)}
              aria-label="New workspace"
            >
              <Plus className="size-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setFullBleed(isExpanded ? null : 'sidebar')}
            aria-label={isExpanded ? 'Restore sidebar' : 'Expand sidebar full-bleed'}
          >
            {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* Workspace cards */}
      <div className="flex-1 overflow-y-auto p-2">
        {active.length === 0 && !projectId && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            Select a project to see workspaces.
          </p>
        )}
        {active.length === 0 && projectId && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            No workspaces yet.{' '}
            <button
              className="text-primary hover:underline"
              onClick={() => setNewOpen(true)}
            >
              Create one
            </button>
          </p>
        )}
        <div className="space-y-0.5">
          {active.map((ws) => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              onRemove={() => setPendingRemove(ws)}
            />
          ))}
        </div>

        {archived.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer px-2 text-xs text-muted-foreground hover:text-foreground">
              Archived ({archived.length})
            </summary>
            <div className="mt-1 space-y-0.5">
              {archived.map((ws) => (
                <WorkspaceCard
                  key={ws.id}
                  workspace={ws}
                  onRemove={() => setPendingRemove(ws)}
                />
              ))}
            </div>
          </details>
        )}
      </div>

      {projectId && <LinearTicketList projectId={projectId} />}

      <BigTerminalToggle />

      {projectId && (
        <NewWorkspaceDialog
          open={newOpen}
          onOpenChange={setNewOpen}
          projectId={projectId}
        />
      )}

      <RemoveWorkspaceModal
        workspace={pendingRemove}
        onClose={() => setPendingRemove(null)}
      />
    </div>
  );
}
