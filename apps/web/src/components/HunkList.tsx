import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@pixler/ui/components/button';
import type { DiffFileDetail, DiffHunk } from '@pixler/shared-types';

async function stageHunks(workspaceId: string, path: string, hunks: number[]) {
  await fetch(`/api/workspaces/${workspaceId}/diff/stage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, hunks }),
  });
}

async function unstageFile(workspaceId: string, path: string) {
  await fetch(`/api/workspaces/${workspaceId}/diff/unstage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  });
}

interface Props {
  workspaceId: string;
  file: DiffFileDetail;
}

function HunkRow({ hunk, index, selected, onToggle }: { hunk: DiffHunk; index: number; selected: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-xs">
      <input type="checkbox" checked={selected} onChange={onToggle} className="accent-primary" />
      <span className="flex-1 truncate font-mono text-muted-foreground">{hunk.header}</span>
      <span className="text-success">+{hunk.lines.filter((l) => l.startsWith('+')).length}</span>
      <span className="text-destructive">-{hunk.lines.filter((l) => l.startsWith('-')).length}</span>
    </div>
  );
}

export function HunkList({ workspaceId, file }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const handleStage = async () => {
    setLoading(true);
    try {
      await stageHunks(workspaceId, file.path, [...selected]);
      setSelected(new Set());
      void qc.invalidateQueries({ queryKey: ['diff', workspaceId] });
      void qc.invalidateQueries({ queryKey: ['diff-file', workspaceId, file.path] });
    } finally {
      setLoading(false);
    }
  };

  const handleUnstage = async () => {
    setLoading(true);
    try {
      await unstageFile(workspaceId, file.path);
      setSelected(new Set());
      void qc.invalidateQueries({ queryKey: ['diff', workspaceId] });
      void qc.invalidateQueries({ queryKey: ['diff-file', workspaceId, file.path] });
    } finally {
      setLoading(false);
    }
  };

  if (file.hunks.length === 0) return null;

  return (
    <div className="shrink-0 border-t border-border">
      <div className="flex h-8 items-center gap-2 border-b border-border px-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Hunks</span>
        <span className="flex-1" />
        <Button variant="outline" size="sm" className="h-6 text-xs" disabled={selected.size === 0 || loading} onClick={() => void handleStage()}>
          Stage selected
        </Button>
        <Button variant="ghost" size="sm" className="h-6 text-xs" disabled={loading} onClick={() => void handleUnstage()}>
          Unstage file
        </Button>
      </div>
      <div className="max-h-32 overflow-y-auto">
        {file.hunks.map((hunk, i) => (
          <HunkRow key={i} hunk={hunk} index={i} selected={selected.has(i)} onToggle={() => toggle(i)} />
        ))}
      </div>
    </div>
  );
}
