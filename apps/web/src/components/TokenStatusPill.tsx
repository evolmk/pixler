import { cn } from '@pixler/ui/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pixler/ui/components/popover';
import { Button } from '@pixler/ui/components/button';
import { useUsageWindow, useUsagePerModel } from '../hooks/useUsage';
import { useLayoutStore } from '../stores/layout';

function formatTime(windowEndTs: number, windowHours: number): string {
  const resetAt = new Date((windowEndTs + windowHours * 3600) * 1000);
  const diffMs = resetAt.getTime() - Date.now();
  if (diffMs <= 0) return '0m';
  const h = Math.floor(diffMs / 3_600_000);
  const m = Math.floor((diffMs % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function percentColor(pct: number): string {
  if (pct >= 85) return 'text-destructive';
  if (pct >= 60) return 'text-[oklch(0.75_0.15_85)]';
  return 'text-primary';
}

function pillColor(pct: number): string {
  if (pct >= 85) return 'bg-destructive/10 text-destructive border-destructive/30';
  if (pct >= 60) return 'bg-[oklch(0.75_0.15_85)]/10 text-[oklch(0.65_0.18_75)] border-[oklch(0.75_0.15_85)]/30';
  return 'bg-primary/10 text-primary border-primary/30';
}

export function TokenStatusPill() {
  const { data: window } = useUsageWindow(5);
  const { data: perModel = [] } = useUsagePerModel();
  const setSettingsOpen = useLayoutStore((s) => s.setSettingsOpen);

  if (!window) return null;

  const pct = window.percent;
  const timeLeft = formatTime(window.windowEnd, window.windowHours);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none transition-colors hover:opacity-80',
            pillColor(pct),
          )}
          aria-label={`Token usage: ${pct}% of 5h cap`}
        >
          <span className={cn('size-1.5 rounded-full', pct >= 85 ? 'bg-destructive' : pct >= 60 ? 'bg-[oklch(0.75_0.15_85)]' : 'bg-primary')} />
          {pct}%
          <span className="opacity-60">/ {timeLeft}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-3 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-semibold">Token Usage (5h window)</p>
          <span className={cn('font-bold text-sm', percentColor(pct))}>{pct}%</span>
        </div>
        <p className="mt-0.5 text-muted-foreground">
          {window.totalTokens.toLocaleString()} / {window.capEstimate.toLocaleString()} tokens · resets in {timeLeft}
        </p>

        {/* Model breakdown */}
        {perModel.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">By model</p>
            {perModel.map((m) => (
              <div key={m.model} className="flex items-center gap-2">
                <span className="flex-1 truncate text-muted-foreground">{m.model}</span>
                <span className="tabular-nums">{m.totalTokens.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bar */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', pct >= 85 ? 'bg-destructive' : pct >= 60 ? 'bg-[oklch(0.75_0.15_85)]' : 'bg-primary')}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>

        {/* Link */}
        <Button
          variant="ghost"
          size="xs"
          className="mt-3 w-full justify-center text-[11px]"
          onClick={() => setSettingsOpen(true, 'usage')}
        >
          Open usage panel →
        </Button>
      </PopoverContent>
    </Popover>
  );
}
