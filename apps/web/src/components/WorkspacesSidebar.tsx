import { useState } from 'react';
import { motion } from 'motion/react';
import { staggerContainer, staggerItem } from '../lib/motion';
import { Maximize2, Minimize2, Plus } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useLayoutStore } from '../stores/layout';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useCurrentProject } from '../hooks/useCurrentProject';
import { WorkspaceCard } from './WorkspaceCard';
import { GuidedNewWorkspaceDialog } from './GuidedNewWorkspaceDialog';
import { RemoveWorkspaceModal } from './RemoveWorkspaceModal';
import { BigTerminalToggle } from './BigTerminalToggle';
import { LinearTicketList } from './LinearTicketList';
import { ActivityFeed } from './ActivityFeed';
import type { Workspace } from '@pixler/shared-types';

export function WorkspacesSidebar() {
  const fullBleed = useLayoutStore((s) => s.fullBleed);
  const setFullBleed = useLayoutStore((s) => s.setFullBleed);
  const isExpanded = fullBleed === 'sidebar';

  const { projectId } = useCurrentProject();

  const newOpen = useLayoutStore((s) => s.newWorkspaceOpen);
  const setNewOpen = useLayoutStore((s) => s.setNewWorkspaceOpen);
  const { data: workspaces = [] } = useWorkspaces(projectId);
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
          <div className="px-3 py-6 flex flex-col items-center gap-3 text-center">
            <p className="text-xs text-muted-foreground">No workspaces yet</p>
            <button
              onClick={() => setNewOpen(true)}
              className="w-full rounded-lg border border-dashed border-primary/50 bg-primary/5 py-3 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              + Create your first workspace
            </button>
          </div>
        )}
        <motion.div
          className="space-y-0.5"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {active.map((ws) => (
            <motion.div key={ws.id} variants={staggerItem}>
              <WorkspaceCard
                workspace={ws}
                onRemove={() => setPendingRemove(ws)}
              />
            </motion.div>
          ))}
        </motion.div>

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

      {projectId && <ActivityFeed />}

      <BigTerminalToggle />

      {projectId && (
        <GuidedNewWorkspaceDialog
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
