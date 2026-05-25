import { useState } from 'react';
import { GitFork, Play, Rewind, Timer, Wrench, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import type { Checkpoint, CheckpointTrigger } from '@pixler/shared-types';

const TRIGGER_META: Record<CheckpointTrigger, { icon: LucideIcon; label: string }> = {
  manual: { icon: Timer, label: 'Manual' },
  before_execution: { icon: Play, label: 'Before execution' },
  pre_batch: { icon: GitFork, label: 'Pre-batch' },
  resolve_conflicts: { icon: Wrench, label: 'Resolve conflicts' },
  rebase: { icon: Rewind, label: 'Rebase' },
};

interface Props {
  checkpoint: Checkpoint;
  onRollback: (checkpoint: Checkpoint) => void;
  onDelete: (checkpointId: string) => void;
}

export function CheckpointCard({ checkpoint, onRollback, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const meta = TRIGGER_META[checkpoint.trigger] ?? TRIGGER_META.manual;
  const Icon = meta.icon;
  const ts = new Date(checkpoint.createdAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="group flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5 transition-colors hover:bg-muted/40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mt-0.5 shrink-0 text-muted-foreground">
        <Icon className="size-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {checkpoint.label || meta.label}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{ts}</span>
          {checkpoint.fileCount > 0 && (
            <span>{checkpoint.fileCount} file{checkpoint.fileCount !== 1 ? 's' : ''}</span>
          )}
          {checkpoint.lineCount > 0 && (
            <span>{checkpoint.lineCount} lines</span>
          )}
        </div>
      </div>

      {hovered && (
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRollback(checkpoint)}
            aria-label="Roll back to this checkpoint"
            title="Roll back"
          >
            <Rewind className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(checkpoint.id)}
            aria-label="Delete checkpoint"
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
