import { useEffect, useRef, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { Terminal } from 'lucide-react';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { useRunStatus } from '../hooks/useRun';
import { socket } from '../lib/socket';

export function RunLogsTab() {
  const params = useParams({ strict: false }) as { workspaceId?: string };
  const workspaceId = params.workspaceId;
  const { data: status } = useRunStatus(workspaceId);
  const [lines, setLines] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status?.logs) setLines(status.logs);
  }, [status?.logs]);

  useEffect(() => {
    if (!workspaceId) return;
    const handler = (event: { type: string; line?: string }) => {
      if (event.type === 'run.log' && event.line !== undefined) {
        setLines((prev) => {
          const next = [...prev, event.line!];
          return next.length > 500 ? next.slice(-500) : next;
        });
      }
    };
    socket.on('workspace:event', handler);
    return () => { socket.off('workspace:event', handler); };
  }, [workspaceId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  if (!workspaceId) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState icon={Terminal} title="No workspace selected" body="Open a workspace to see run logs." className="border-none" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={Terminal}
          title={status?.state === 'stopped' ? 'Not running' : 'Starting…'}
          body={status?.state === 'stopped' ? 'Use the Run button to start the dev server.' : 'Waiting for output…'}
          className="border-none"
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#1e1e1e] p-3 font-mono text-[12px] text-[#d4d4d4]">
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-all leading-5">{line}</div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
