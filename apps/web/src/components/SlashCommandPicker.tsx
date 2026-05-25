import { useEffect, useRef, useState } from 'react';

export interface SlashCommand {
  id: string;
  label: string;
  description: string;
}

const COMMANDS: SlashCommand[] = [
  { id: '/plan', label: '/plan', description: 'Write or revise the plan for this workspace' },
  { id: '/review', label: '/review', description: 'Review the current implementation' },
  { id: '/test', label: '/test', description: 'Run the test suite and report results' },
  { id: '/commit', label: '/commit', description: 'Stage and commit all changes' },
  { id: '/rebase', label: '/rebase', description: 'Rebase onto the base branch' },
  { id: '/resolve-conflicts', label: '/resolve-conflicts', description: 'Resolve merge conflicts' },
  { id: '/compact', label: '/compact', description: 'Compact context to reduce token usage' },
  { id: '/clear', label: '/clear', description: 'Clear conversation history' },
];

interface Props {
  query: string;
  onSelect: (cmd: SlashCommand) => void;
  onClose: () => void;
}

export function SlashCommandPicker({ query, onSelect, onClose }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = COMMANDS.filter((c) =>
    c.id.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => { setSelectedIdx(0); }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[selectedIdx]) {
        e.preventDefault();
        onSelect(filtered[selectedIdx]!);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [filtered, selectedIdx, onSelect, onClose]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={listRef}
      className="absolute bottom-full mb-1 left-0 z-50 w-80 rounded-md border border-border bg-popover shadow-md"
    >
      {filtered.map((cmd, i) => (
        <button
          key={cmd.id}
          className={`flex w-full flex-col gap-0.5 px-3 py-1.5 text-left hover:bg-accent ${i === selectedIdx ? 'bg-accent' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onSelect(cmd); }}
        >
          <span className="text-xs font-mono font-medium">{cmd.label}</span>
          <span className="text-[10px] text-muted-foreground">{cmd.description}</span>
        </button>
      ))}
    </div>
  );
}
