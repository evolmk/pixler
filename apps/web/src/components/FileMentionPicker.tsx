import { useEffect, useRef, useState } from 'react';
import { useWorkspaceFiles } from '../hooks/useWorkspaceFiles';

interface Props {
  workspaceId: string;
  query: string;
  onSelect: (path: string) => void;
  onClose: () => void;
}

export function FileMentionPicker({ workspaceId, query, onSelect, onClose }: Props) {
  const { data } = useWorkspaceFiles(workspaceId);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const files = (data ?? []).filter((f: string) =>
    f.toLowerCase().includes(query.toLowerCase()),
  ).slice(0, 10);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, files.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && files[selectedIdx]) {
        e.preventDefault();
        onSelect(files[selectedIdx]!);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [files, selectedIdx, onSelect, onClose]);

  if (files.length === 0) return null;

  return (
    <div
      ref={listRef}
      className="absolute bottom-full mb-1 left-0 z-50 w-72 rounded-md border border-border bg-popover shadow-md"
    >
      {files.map((f: string, i: number) => (
        <button
          key={f}
          className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-accent ${i === selectedIdx ? 'bg-accent' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onSelect(f); }}
        >
          <span className="truncate font-mono text-muted-foreground">{f}</span>
        </button>
      ))}
    </div>
  );
}
