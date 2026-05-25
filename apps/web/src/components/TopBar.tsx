import { useState } from 'react';
import { Bell, ChevronDown, Command, Monitor, Moon, Plus, Settings, Sun } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

  const { mode, resolvedMode, setMode } = useThemeStore();
  const setSettingsOpen = useLayoutStore((s) => s.setSettingsOpen);

  const { set: persistMode } = useSetting<ThemeMode>('appearance.mode');

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
            Select project
            <ChevronDown className="size-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            Projects load in M07
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
