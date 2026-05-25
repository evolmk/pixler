import { useState } from 'react';
import { Maximize2, MessageSquare, Minimize2, StopCircle, Terminal, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useParams } from '@tanstack/react-router';
import { SegmentedControl } from '@pixler/ui/components/segmented-control';
import { Button } from '@pixler/ui/components/button';
import { EmptyState } from '@pixler/ui/components/empty-state';
import type { SegmentedOption } from '@pixler/ui/components/segmented-control';
import { useLayoutStore } from '../stores/layout';
import { TerminalPane } from './TerminalPane';

type RightPaneMode = 'chat' | 'terminal';

const MODE_OPTIONS: SegmentedOption<RightPaneMode>[] = [
  { value: 'chat', label: 'Chat' },
  { value: 'terminal', label: 'Terminal' },
];

export function RightPane() {
  const [mode, setMode] = useState<RightPaneMode>('chat');
  const fullBleed = useLayoutStore((s) => s.fullBleed);
  const setFullBleed = useLayoutStore((s) => s.setFullBleed);
  const isExpanded = fullBleed === 'right';
  const params = useParams({ strict: false }) as { workspaceId?: string };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header: mode pill + expand */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
        <SegmentedControl
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
          className="h-7"
        />
        <span className="flex-1" />
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setFullBleed(isExpanded ? null : 'right')}
          aria-label={isExpanded ? 'Restore right pane' : 'Expand right pane full-bleed'}
        >
          {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        </Button>
      </div>

      {/* Pane content */}
      <div className="relative flex flex-1 overflow-hidden">
        {mode === 'chat' ? (
          <div className="flex h-full w-full items-center justify-center p-4">
            <EmptyState
              icon={MessageSquare}
              title="Chat pane ships in M16"
              body="Agent conversation will stream here during workspace runs."
              className="max-w-xs border-none"
            />
          </div>
        ) : params.workspaceId ? (
          <TerminalPane workspaceId={params.workspaceId} />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4">
            <EmptyState
              icon={Terminal}
              title="Select a workspace"
              body="Open a workspace to start a terminal session."
              className="max-w-xs border-none"
            />
          </div>
        )}
      </div>

      {/* Persistent action buttons */}
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border p-3">
        <Button variant="outline" size="sm" disabled className="gap-1.5 text-xs">
          <StopCircle className="size-3.5" />
          Interrupt
        </Button>
        <Button variant="outline" size="sm" disabled className="gap-1.5 text-xs">
          <ThumbsDown className="size-3.5" />
          Reject
        </Button>
        <Button size="sm" disabled className="gap-1.5 text-xs">
          <ThumbsUp className="size-3.5" />
          Approve
        </Button>
      </div>
    </div>
  );
}
