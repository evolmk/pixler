import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  Bot,
  FileText,
  FlaskConical,
  GitBranch,
  HardDrive,
  Info,
  Key,
  Keyboard,
  Link,
  Package,
  Palette,
  Terminal,
  UserCircle,
  Wrench,
} from 'lucide-react';
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
import { useLayoutStore } from '../stores/layout';
import { AppearancePanel } from './SettingsDrawer/AppearancePanel';
import { LinearPanel } from './SettingsDrawer/LinearPanel';
import { TerminalPanel } from './SettingsDrawer/TerminalPanel';
import { ProvidersPanel } from './SettingsDrawer/ProvidersPanel';
import { ExternalToolsPanel } from './SettingsDrawer/ExternalToolsPanel';

interface CategoryConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  milestone?: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'account', label: 'Account', icon: UserCircle, milestone: 'M21' },
  { id: 'models', label: 'Models', icon: Bot, milestone: 'M07' },
  { id: 'providers', label: 'Providers', icon: Package },
  { id: 'env', label: 'Environment', icon: Key, milestone: 'M08' },
  { id: 'linear', label: 'Linear', icon: Link, milestone: 'M10' },
  { id: 'git', label: 'Git', icon: GitBranch, milestone: 'M12' },
  { id: 'plans', label: 'Plans', icon: FileText, milestone: 'M14' },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'keyboard', label: 'Keyboard', icon: Keyboard, milestone: 'M22' },
  { id: 'notifications', label: 'Notifications', icon: Bell, milestone: 'M18' },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'external-tools', label: 'External Tools', icon: Wrench, milestone: 'M19' },
  { id: 'storage', label: 'Storage', icon: HardDrive, milestone: 'M14' },
  { id: 'experimental', label: 'Experimental', icon: FlaskConical, milestone: 'M25' },
  { id: 'about', label: 'About', icon: Info, milestone: 'M25' },
];

export function SettingsDrawer() {
  const [activeId, setActiveId] = useState('appearance');
  const open = useLayoutStore((s) => s.settingsOpen);
  const setOpen = useLayoutStore((s) => s.setSettingsOpen);

  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[7];

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex-row p-0 sm:max-w-[480px]">
        {/* Icon rail */}
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

        {/* Panel area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <DrawerHeader className="border-b border-border">
            <DrawerTitle>{active.label}</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {activeId === 'appearance' ? (
              <AppearancePanel />
            ) : activeId === 'linear' ? (
              <LinearPanel />
            ) : activeId === 'terminal' ? (
              <TerminalPanel />
            ) : activeId === 'providers' ? (
              <ProvidersPanel />
            ) : activeId === 'external-tools' ? (
              <ExternalToolsPanel />
            ) : (
              <div className="flex h-full min-h-40 items-center justify-center">
                <EmptyState
                  icon={active.icon}
                  title={`${active.label} settings`}
                  body={active.milestone ? `Ships in ${active.milestone}.` : undefined}
                  className="border-none"
                />
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
