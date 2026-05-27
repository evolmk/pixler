import { useState, useEffect, useRef, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ActivitySquare,
  Bell,
  Bot,
  FileText,
  FlaskConical,
  GitBranch,
  Github,
  HardDrive,
  Info,
  Key,
  Keyboard,
  Link,
  Package,
  Palette,
  Terminal,
  UserCircle,
  Workflow,
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
import { useLayoutStore } from '../stores/layout';
import { AppearancePanel } from './SettingsDrawer/AppearancePanel';
import { LinearPanel } from './SettingsDrawer/LinearPanel';
import { GitHubPanel } from './SettingsDrawer/GitHubPanel';
import { ModelsPanel } from './SettingsDrawer/ModelsPanel';
import { TerminalPanel } from './SettingsDrawer/TerminalPanel';
import { ProvidersPanel } from './SettingsDrawer/ProvidersPanel';
import { ExternalToolsPanel } from './SettingsDrawer/ExternalToolsPanel';
import { KeyboardPanel } from './SettingsDrawer/KeyboardPanel';
import { UsagePanel } from './SettingsDrawer/UsagePanel';
import { PlansPanel } from './SettingsDrawer/PlansPanel';
import { NotificationsPanel } from './SettingsDrawer/NotificationsPanel';
import { AccountPanel } from './SettingsDrawer/AccountPanel';
import { StoragePanel } from './SettingsDrawer/StoragePanel';
import { AboutPanel } from './SettingsDrawer/AboutPanel';
import { WorkflowsPanel } from './SettingsDrawer/WorkflowsPanel';

// ─── Resizable settings pane ────────────────────────────────────────────────
const SETTINGS_WIDTH_KEY = 'pixler:settings-pane-width';
const DEFAULT_WIDTH = 680;
const MIN_WIDTH = 400;
const MAX_WIDTH = 1100;

function useResizableWidth() {
  const [width, setWidth] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_WIDTH_KEY);
      if (stored) {
        const n = parseInt(stored, 10);
        if (!isNaN(n) && n >= MIN_WIDTH && n <= MAX_WIDTH) return n;
      }
    } catch {
      // ignore SSR / private-browsing errors
    }
    return DEFAULT_WIDTH;
  });

  // Keep a ref so mouseMove closure always sees current width, not stale closure value
  const widthRef = useRef(width);
  widthRef.current = width;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = widthRef.current;

    const onMouseMove = (mv: MouseEvent) => {
      // Handle is on the LEFT edge of a right-side drawer:
      // dragging left (smaller clientX) expands; dragging right shrinks.
      const delta = startX - mv.clientX;
      const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + delta));
      setWidth(clamped);
      widthRef.current = clamped;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      try {
        localStorage.setItem(SETTINGS_WIDTH_KEY, String(widthRef.current));
      } catch {
        // ignore
      }
    };

    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  return { width, handleMouseDown };
}
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  milestone?: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'account', label: 'Account', icon: UserCircle, milestone: 'M21' },
  { id: 'models', label: 'Model Defaults', icon: Bot, milestone: 'M07' },
  { id: 'providers', label: 'Providers', icon: Package },
  { id: 'env', label: 'Environment', icon: Key, milestone: 'M08' },
  { id: 'linear', label: 'Linear', icon: Link, milestone: 'M10' },
  { id: 'github', label: 'GitHub', icon: Github, milestone: 'M28' },
  { id: 'git', label: 'Git', icon: GitBranch, milestone: 'M12' },
  { id: 'workflows', label: 'Workflows', icon: Workflow, milestone: 'M28' },
  { id: 'plans', label: 'Plans', icon: FileText },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'usage', label: 'Usage', icon: ActivitySquare },
  { id: 'keyboard', label: 'Keyboard', icon: Keyboard, milestone: 'M22' },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'external-tools', label: 'External Tools', icon: Wrench, milestone: 'M19' },
  { id: 'storage', label: 'Storage', icon: HardDrive, milestone: 'M14' },
  { id: 'experimental', label: 'Experimental', icon: FlaskConical, milestone: 'M25' },
  { id: 'about', label: 'About', icon: Info, milestone: 'M25' },
];

export function SettingsDrawer() {
  const open = useLayoutStore((s) => s.settingsOpen);
  const settingsTab = useLayoutStore((s) => s.settingsTab);
  const setOpen = useLayoutStore((s) => s.setSettingsOpen);
  const [activeId, setActiveId] = useState(settingsTab);
  const { width, handleMouseDown } = useResizableWidth();

  useEffect(() => {
    if (open) setActiveId(settingsTab);
  }, [open, settingsTab]);

  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[7];

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      {/*
        Override vaul's built-in w-3/4 + sm:max-w-sm via inline style.
        maxWidth:'none' is required or the Tailwind max-w class still constrains.
      */}
      <DrawerContent
        className="flex-row p-0"
        style={{ width: `${width}px`, maxWidth: 'none' }}
      >
        {/* Drag-to-resize handle — sits on the left edge of the drawer */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute left-0 top-0 z-20 h-full w-1 cursor-ew-resize transition-colors hover:bg-primary/30"
          aria-hidden="true"
        />

        {/* Icon + label rail */}
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

        {/* Panel area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <DrawerHeader className="border-b border-border">
            <DrawerTitle>{active.label}</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {activeId === 'appearance' ? (
              <AppearancePanel />
            ) : activeId === 'models' ? (
              <ModelsPanel />
            ) : activeId === 'linear' ? (
              <LinearPanel />
            ) : activeId === 'github' ? (
              <GitHubPanel />
            ) : activeId === 'terminal' ? (
              <TerminalPanel />
            ) : activeId === 'providers' ? (
              <ProvidersPanel />
            ) : activeId === 'external-tools' ? (
              <ExternalToolsPanel />
            ) : activeId === 'keyboard' ? (
              <KeyboardPanel />
            ) : activeId === 'usage' ? (
              <UsagePanel />
            ) : activeId === 'workflows' ? (
              <WorkflowsPanel />
            ) : activeId === 'plans' ? (
              <PlansPanel />
            ) : activeId === 'notifications' ? (
              <NotificationsPanel />
            ) : activeId === 'account' ? (
              <AccountPanel />
            ) : activeId === 'storage' ? (
              <StoragePanel />
            ) : activeId === 'about' ? (
              <AboutPanel />
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
