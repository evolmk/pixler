import { useEffect, useRef } from 'react';
import { Progress } from '@pixler/ui/components/progress';
import { ScrollArea } from '@pixler/ui/components/scroll-area';
import { useAppEvents } from '../hooks/useAppEvents';

interface CloneProgressProps {
  projectId: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

export function CloneProgress({ projectId, onComplete, onError }: CloneProgressProps) {
  const lines = useRef<string[]>([]);
  const pctRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useAppEvents((event) => {
    if (event.type === 'project.clone-progress' && event.projectId === projectId) {
      lines.current = [...lines.current, event.line];
      pctRef.current = event.pct;
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
    if (event.type === 'project.clone-complete' && event.projectId === projectId) {
      onComplete();
    }
    if (event.type === 'project.clone-error' && event.projectId === projectId) {
      onError(event.error as string);
    }
  });

  const logRef = useRef<HTMLPreElement>(null);
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  });

  return (
    <div className="flex flex-col gap-3">
      <Progress value={pctRef.current} className="h-1.5" />
      <ScrollArea className="h-40 rounded-md border border-border bg-muted/40 p-3">
        <pre
          ref={logRef}
          className="whitespace-pre-wrap break-all font-mono text-xs text-muted-foreground"
        >
          {lines.current.join('\n') || 'Starting clone…'}
        </pre>
      </ScrollArea>
    </div>
  );
}
