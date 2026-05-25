import { useState, useCallback, useRef } from 'react';
import { Maximize2, MessageSquare, Minimize2, Terminal } from 'lucide-react';
import { useParams } from '@tanstack/react-router';
import { SegmentedControl } from '@pixler/ui/components/segmented-control';
import { Button } from '@pixler/ui/components/button';
import { EmptyState } from '@pixler/ui/components/empty-state';
import type { SegmentedOption } from '@pixler/ui/components/segmented-control';
import { useLayoutStore } from '../stores/layout';
import { TerminalPane } from './TerminalPane';
import { TerminalSwitcher } from './TerminalSwitcher';
import { useTerminalList } from '../hooks/useTerminal';
import { RightPaneControls } from './RightPaneControls';
import { useWorkspaceClearOnSwitch } from '../hooks/useWorkspaceClearOnSwitch';
import { ChatPane } from './ChatPane';

type RightPaneMode = 'chat' | 'terminal';

const MODE_OPTIONS: SegmentedOption<RightPaneMode>[] = [
  { value: 'chat', label: 'Chat' },
  { value: 'terminal', label: 'Terminal' },
];

export function RightPane() {
  const [mode, setMode] = useState<RightPaneMode>('chat');
  const [showInControl, setShowInControl] = useState(false);
  const inControlTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fullBleed = useLayoutStore((s) => s.fullBleed);
  const setFullBleed = useLayoutStore((s) => s.setFullBleed);
  const isExpanded = fullBleed === 'right';
  const params = useParams({ strict: false }) as { workspaceId?: string };

  useWorkspaceClearOnSwitch(params.workspaceId);

  const { terminals, addTerminal } = useTerminalList(
    mode === 'terminal' ? params.workspaceId : null,
  );
  const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null);

  const interruptRef = useRef<(() => void) | null>(null);

  const handleInterrupt = useCallback(() => {
    interruptRef.current?.();
    clearTimeout(inControlTimer.current);
    setShowInControl(true);
    inControlTimer.current = setTimeout(() => setShowInControl(false), 3000);
  }, []);

  const handleNewTerminal = useCallback(async () => {
    const id = await addTerminal();
    if (id) setActiveTerminalId(id);
  }, [addTerminal]);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
        <SegmentedControl
          options={MODE_OPTIONS}
          value={mode}
          onChange={setMode}
          className="h-7"
        />
        {mode === 'terminal' && params.workspaceId && (
          <TerminalSwitcher
            terminals={terminals}
            activeId={activeTerminalId}
            onSelect={setActiveTerminalId}
            onNew={handleNewTerminal}
          />
        )}
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

      {/* "You're in control" banner */}
      {showInControl && (
        <div className="flex shrink-0 items-center justify-center bg-primary/10 px-3 py-1.5 text-xs text-primary">
          You&rsquo;re in control.
        </div>
      )}

      {/* Pane content */}
      <div className="relative flex flex-1 overflow-hidden">
        {mode === 'chat' ? (
          params.workspaceId ? (
            <ChatPane workspaceId={params.workspaceId} />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4">
              <EmptyState
                icon={MessageSquare}
                title="Select a workspace"
                body="Open a workspace to view the agent conversation."
                className="max-w-xs border-none"
              />
            </div>
          )
        ) : params.workspaceId ? (
          <TerminalPane
            workspaceId={params.workspaceId}
            terminalId={activeTerminalId}
            onInterruptRef={interruptRef}
            onTerminalReady={(id) => {
              if (!activeTerminalId) setActiveTerminalId(id);
            }}
          />
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
        {params.workspaceId ? (
          <RightPaneControls workspaceId={params.workspaceId} onInterrupt={handleInterrupt} />
        ) : null}
      </div>
    </div>
  );
}
