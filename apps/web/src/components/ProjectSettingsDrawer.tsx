import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { GitBranch, Settings, Users, Zap } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@pixler/ui/components/drawer';
import { Button } from '@pixler/ui/components/button';
import { EmptyState } from '@pixler/ui/components/empty-state';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pixler/ui/components/tooltip';
import { ScrollArea } from '@pixler/ui/components/scroll-area';
import { useLayoutStore } from '../stores/layout';
import { GeneralPanel } from './ProjectSettingsDrawer/GeneralPanel';

interface CategoryConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  milestone?: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'members', label: 'Members', icon: Users, milestone: 'M08' },
  { id: 'git', label: 'Git', icon: GitBranch, milestone: 'M12' },
  { id: 'integrations', label: 'Integrations', icon: Zap, milestone: 'M10' },
];

export function ProjectSettingsDrawer() {
  const [activeId, setActiveId] = useState('general');
  const open = useLayoutStore((s) => s.projectSettingsOpen);
  const setOpen = useLayoutStore((s) => s.setProjectSettingsOpen);

  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0]!;

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex-row p-0 sm:max-w-[480px]">
        <TooltipProvider delayDuration={300}>
          <nav className="flex w-14 shrink-0 flex-col gap-0.5 border-r border-border px-2 py-3">
            {CATEGORIES.map((cat) => (
              <Tooltip key={cat.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeId === cat.id ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    onClick={() => setActiveId(cat.id)}
                    aria-label={cat.label}
                  >
                    <cat.icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{cat.label}</TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>

        <div className="flex min-w-0 flex-1 flex-col">
          <DrawerHeader className="border-b border-border">
            <DrawerTitle>Project — {active.label}</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1">
            <div className="p-6">
              {activeId === 'general' ? (
                <GeneralPanel />
              ) : (
                <EmptyState
                  icon={active.icon}
                  title={`${active.label} settings`}
                  body={`Ships in ${active.milestone}.`}
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
