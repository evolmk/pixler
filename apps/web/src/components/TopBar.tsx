import { useState, useEffect } from 'react';
import { Bell, ChevronDown, Command, FolderPlus, Monitor, Moon, Plus, Settings, Settings2, Sun } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@pixler/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pixler/ui/components/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@pixler/ui/components/dialog';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@pixler/ui/components/command';
import { useThemeStore } from '../stores/theme';
import { useLayoutStore } from '../stores/layout';
import { useSetting } from '../hooks/useSetting';
import { useProjects } from '../hooks/useProjects';
import { NewProjectDialog } from './NewProjectDialog';
import { LinearStatusPill } from './LinearStatusPill';
import { RunButton } from './RunButton';
import { OpenAppButton } from './OpenAppButton';
import { OpenInIdeMenu } from './OpenInIdeMenu';
import { useOpenInIde } from '../hooks/useIDEs';
import type { ThemeMode } from '@pixler/ui-styles';

const MODE_ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const MODE_CYCLE: ThemeMode[] = ['light', 'dark', 'system'];

export function TopBar() {
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const { mode, resolvedMode, setMode } = useThemeStore();
  const setSettingsOpen = useLayoutStore((s) => s.setSettingsOpen);
  const setProjectSettingsOpen = useLayoutStore((s) => s.setProjectSettingsOpen);

  const { set: persistMode } = useSetting<ThemeMode>('appearance.mode');
  const { data: projects = [] } = useProjects();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { projectId?: string; workspaceId?: string };
  const activeProject = projects.find((p) => p.id === params.projectId);
  const workspaceId = params.workspaceId;
  const openInIde = useOpenInIde(workspaceId ?? '');

  useEffect(() => {
    if (!workspaceId) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        void openInIde.mutateAsync({});
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [workspaceId, openInIde]);

  const handleModeToggle = () => {
    const next = MODE_CYCLE[(MODE_CYCLE.indexOf(mode) + 1) % MODE_CYCLE.length];
    setMode(next);
    persistMode(next);
  };

  const ModeIcon = MODE_ICONS[mode];

  return (
    <header
      data-testid="topbar"
      className="flex h-10 shrink-0 items-center gap-1 border-b border-border bg-background px-3"
    >
      {/* Wordmark */}
      <span className="mr-1 select-none text-sm font-semibold text-primary">Pixler</span>

      {/* Project switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            {activeProject?.name ?? 'Select project'}
            <ChevronDown className="size-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {projects.length === 0 ? (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              No projects yet
            </DropdownMenuItem>
          ) : (
            projects.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => navigate({ to: '/p/$projectId', params: { projectId: p.id } })}
                className="gap-2 text-xs"
                data-active={p.id === params.projectId}
              >
                {p.name}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setNewProjectOpen(true)}
            className="gap-2 text-xs"
          >
            <FolderPlus className="size-3.5" />
            Add project…
          </DropdownMenuItem>
          {activeProject && (
            <DropdownMenuItem
              onClick={() => setProjectSettingsOpen(true)}
              className="gap-2 text-xs"
            >
              <Settings2 className="size-3.5" />
              Project settings
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* New Project dialog */}
      <NewProjectDialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        onProjectAdded={(id) => navigate({ to: '/p/$projectId', params: { projectId: id } })}
      />

      {/* + Workspace */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setWorkspaceDialogOpen(true)}
        aria-label="Add workspace"
      >
        <Plus />
      </Button>

      <span className="flex-1" />

      <LinearStatusPill />

      {workspaceId && (
        <>
          <RunButton workspaceId={workspaceId} />
          <OpenAppButton workspaceId={workspaceId} />
          <OpenInIdeMenu workspaceId={workspaceId} />
        </>
      )}

      {/* ⌘K command palette */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCommandOpen(true)}
        className="gap-1 text-xs text-muted-foreground"
        aria-label="Open command palette"
      >
        <Command className="size-3" />
        K
      </Button>

      {/* Notification bell — M18 wires real data */}
      <Button variant="ghost" size="icon-sm" aria-label="Notifications (ships in M18)">
        <Bell />
      </Button>

      {/* Settings gear — opens drawer stub; Sprint 4 replaces with real Vaul drawer */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setSettingsOpen(true)}
        aria-label="Settings"
      >
        <Settings />
      </Button>

      {/* Mode toggle: light → dark → system → light */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleModeToggle}
        aria-label={`Current mode: ${mode}. Click to cycle.`}
        title={resolvedMode === 'dark' ? 'Dark mode' : 'Light mode'}
      >
        <ModeIcon />
      </Button>

      {/* + Workspace stub dialog — M08 wires real workspace creation */}
      <Dialog open={workspaceDialogOpen} onOpenChange={setWorkspaceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Workspace</DialogTitle>
            <DialogDescription>Workspaces ship in M08. Check back soon.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* ⌘K command palette stub — M22 wires real commands */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>Command palette ships in M22.</CommandEmpty>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
