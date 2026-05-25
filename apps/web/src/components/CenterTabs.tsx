import { useState } from 'react';
import {
  CheckSquare,
  FileText,
  GitCompare,
  GitPullRequest,
  Maximize2,
  MessageSquare,
  Minimize2,
  SendHorizontal,
  Terminal,
  Timer,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pixler/ui/components/tabs';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { Button } from '@pixler/ui/components/button';
import { useLayoutStore } from '../stores/layout';
import { DiffTab } from './DiffTab';
import { RunLogsTab } from './RunLogsTab';
import { PlanTab } from './PlanTab';
import { CheckpointsTab } from './CheckpointsTab';
import { ChecksTab } from './ChecksTab';

interface TabConfig {
  value: string;
  label: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyBody: string;
}

const TABS: TabConfig[] = [
  {
    value: 'chat',
    label: 'Chat',
    icon: MessageSquare,
    emptyTitle: 'Chat ships in M16',
    emptyBody: 'The AI conversation pane will appear here.',
  },
  {
    value: 'plan',
    label: 'Plan',
    icon: FileText,
    emptyTitle: 'Plan view ships in M14',
    emptyBody: 'Milestone plans and sprint progress will appear here.',
  },
  {
    value: 'diff',
    label: 'Diff',
    icon: GitCompare,
    emptyTitle: 'Diff viewer',
    emptyBody: '',
  },
  {
    value: 'checks',
    label: 'Checks',
    icon: CheckSquare,
    emptyTitle: 'Checks ship in M18',
    emptyBody: 'CI runs, linting, and test results will appear here.',
  },
  {
    value: 'pr',
    label: 'PR',
    icon: GitPullRequest,
    emptyTitle: 'PR panel ships in M18',
    emptyBody: 'Pull request status, reviews, and merge controls will appear here.',
  },
  {
    value: 'run',
    label: 'Run',
    icon: Terminal,
    emptyTitle: 'Run logs',
    emptyBody: '',
  },
  {
    value: 'checkpoints',
    label: 'Checkpoints',
    icon: Timer,
    emptyTitle: 'Checkpoints',
    emptyBody: '',
  },
];

export function CenterTabs() {
  const [activeTab, setActiveTab] = useState('chat');
  const fullBleed = useLayoutStore((s) => s.fullBleed);
  const setFullBleed = useLayoutStore((s) => s.setFullBleed);
  const isExpanded = fullBleed === 'center';

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="h-full gap-0"
    >
      {/* Tab strip */}
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border px-2">
        <TabsList variant="line" className="h-auto gap-0 p-0">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-3 py-2 text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <span className="flex-1" />
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setFullBleed(isExpanded ? null : 'center')}
          aria-label={isExpanded ? 'Restore center pane' : 'Expand center pane full-bleed'}
        >
          {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        </Button>
      </div>

      {/* Tab panels */}
      {TABS.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-0 h-[calc(100%-40px-53px)] overflow-hidden"
        >
          {tab.value === 'diff' ? (
            <DiffTab />
          ) : tab.value === 'run' ? (
            <RunLogsTab />
          ) : tab.value === 'plan' ? (
            <PlanTab />
          ) : tab.value === 'checkpoints' ? (
            <CheckpointsTab />
          ) : tab.value === 'checks' ? (
            <ChecksTab onOpenDiff={() => setActiveTab('diff')} />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center p-4">
              <EmptyState
                icon={tab.icon}
                title={tab.emptyTitle}
                body={tab.emptyBody}
                className="max-w-xs border-none"
              />
            </div>
          )}
        </TabsContent>
      ))}

      {/* Composer stub */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
          <span className="flex-1 text-sm text-muted-foreground">Composer ships in M16…</span>
          <Button variant="ghost" size="icon-sm" disabled aria-label="Send">
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </Tabs>
  );
}
