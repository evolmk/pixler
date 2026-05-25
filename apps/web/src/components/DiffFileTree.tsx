import { cn } from '@pixler/ui/lib/utils';
import type { DiffFileSummary, DiffStatus } from '@pixler/shared-types';

const STATUS_COLORS: Record<DiffStatus, string> = {
  M: 'text-warning',
  A: 'text-success',
  D: 'text-destructive',
  R: 'text-primary',
  C: 'text-primary',
  '?': 'text-muted-foreground',
};

const STATUS_LABEL: Record<DiffStatus, string> = {
  M: 'M', A: 'A', D: 'D', R: 'R', C: 'C', '?': '?',
};

interface Props {
  files: DiffFileSummary[];
  selected: string | null;
  onSelect: (path: string) => void;
}

export function DiffFileTree({ files, selected, onSelect }: Props) {
  if (files.length === 0) {
    return <p className="px-3 py-4 text-xs text-muted-foreground">No uncommitted changes.</p>;
  }

  return (
    <div className="flex flex-col">
      {files.map((f) => (
        <button
          key={f.path}
          type="button"
          onClick={() => onSelect(f.path)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-accent transition-colors',
            selected === f.path && 'bg-accent',
          )}
        >
          <span className={cn('w-3 shrink-0 font-bold', STATUS_COLORS[f.status])}>
            {STATUS_LABEL[f.status]}
          </span>
          <span className="min-w-0 flex-1 truncate font-mono">{f.path}</span>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {f.additions > 0 && <span className="text-success">+{f.additions}</span>}
            {f.deletions > 0 && <span className="ml-0.5 text-destructive">-{f.deletions}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
