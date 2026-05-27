import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Bot, FileText, GitBranch, LayoutGrid, Palette, Settings, Zap, Terminal, Files } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@pixler/ui/components/drawer';
import { Button } from '@pixler/ui/components/button';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { ScrollArea } from '@pixler/ui/components/scroll-area';
import { useLayoutStore } from '../stores/layout';
import { GeneralPanel } from './ProjectSettingsDrawer/GeneralPanel';
import { ModelsPanel } from './ProjectSettingsDrawer/ModelsPanel';
import { ScriptsPanel } from './ProjectSettingsDrawer/ScriptsPanel';
import { FilesToCopyPanel } from './ProjectSettingsDrawer/FilesToCopyPanel';
import { IntegrationsPanel } from './ProjectSettingsDrawer/IntegrationsPanel';
import { GitPanel } from './ProjectSettingsDrawer/GitPanel';
import { ThemePanel } from './ProjectSettingsDrawer/ThemePanel';
import { WorkspacesPanel } from './ProjectSettingsDrawer/WorkspacesPanel';
import { PlansPanel } from './ProjectSettingsDrawer/PlansPanel';

interface CategoryConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  milestone?: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'models', label: 'Models', icon: Bot },
  { id: 'workspaces', label: 'Workspaces', icon: LayoutGrid },
  { id: 'scripts', label: 'Scripts', icon: Terminal },
  { id: 'files-to-copy', label: 'Files to copy', icon: Files },
  { id: 'git', label: 'Git', icon: GitBranch },
  { id: 'plans', label: 'Plans', icon: FileText },
  { id: 'integrations', label: 'Integrations', icon: Zap },
  { id: 'theme', label: 'Theme', icon: Palette },
];

export function ProjectSettingsDrawer() {
  const [activeId, setActiveId] = useState('general');
  const open = useLayoutStore((s) => s.projectSettingsOpen);
  const setOpen = useLayoutStore((s) => s.setProjectSettingsOpen);

  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0]!;

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex-row p-0 sm:max-w-4xl">
        <nav className="flex w-44 shrink-0 flex-col gap-0.5 border-r border-border px-2 py-3">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={activeId === cat.id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveId(cat.id)}
              className="justify-start gap-2"
            >
              <cat.icon className="size-4 shrink-0" />
              <span className="truncate text-xs">{cat.label}</span>
            </Button>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <DrawerHeader className="border-b border-border">
            <DrawerTitle>Project — {active.label}</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1">
            <div className="p-6">
              {activeId === 'general' ? (
                <GeneralPanel />
              ) : activeId === 'models' ? (
                <ModelsPanel />
              ) : activeId === 'workspaces' ? (
                <WorkspacesPanel />
              ) : activeId === 'scripts' ? (
                <ScriptsPanel />
              ) : activeId === 'files-to-copy' ? (
                <FilesToCopyPanel />
              ) : activeId === 'git' ? (
                <GitPanel />
              ) : activeId === 'integrations' ? (
                <IntegrationsPanel />
              ) : activeId === 'plans' ? (
                <PlansPanel />
              ) : activeId === 'theme' ? (
                <ThemePanel />
              ) : (
                <EmptyState
                  icon={active.icon}
                  title={`${active.label} settings`}
                  body={active.milestone ? `Ships in ${active.milestone}.` : undefined}
                  className="border-none"
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
