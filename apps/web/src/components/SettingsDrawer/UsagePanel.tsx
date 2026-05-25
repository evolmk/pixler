import { useState } from 'react';
import { SegmentedControl } from '@pixler/ui/components/segmented-control';
import type { SegmentedOption } from '@pixler/ui/components/segmented-control';
import { cn } from '@pixler/ui/lib/utils';
import { useMutation } from '@tanstack/react-query';
import {
  useUsageWindow,
  useUsagePerModel,
  useUsagePerWorkspace,
  useUsageHistorical,
  useMcpOverhead,
} from '../../hooks/useUsage';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useParams } from '@tanstack/react-router';

type RangeOption = 'daily' | 'weekly' | 'monthly';

const RANGE_OPTIONS: SegmentedOption<RangeOption>[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function PercentBar({ pct, className }: { pct: number; className?: string }) {
  const color = pct >= 85 ? 'bg-destructive' : pct >= 60 ? 'bg-[oklch(0.75_0.15_85)]' : 'bg-primary';
  return (
    <div className={cn('h-1.5 w-full rounded-full bg-muted overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

function SparkLine({ points, max }: { points: number[]; max: number }) {
  if (points.length < 2) return null;
  const w = 120;
  const h = 30;
  const step = w / (points.length - 1);
  const coords = points.map((v, i) => `${i * step},${h - (max > 0 ? (v / max) * h : 0)}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={coords}
        fill="none"
        stroke="oklch(var(--primary))"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UsagePanel() {
  const [range, setRange] = useState<RangeOption>('daily');
  const params = useParams({ strict: false }) as { workspaceId?: string };
  const workspaceId = params.workspaceId;

  const { data: window } = useUsageWindow(5);
  const { data: perModel = [] } = useUsagePerModel();
  const { data: perWorkspace = [] } = useUsagePerWorkspace();
  const { data: historical = [] } = useUsageHistorical(range);
  const { data: mcpOverhead } = useMcpOverhead();
  const { data: activeWs } = useWorkspace(workspaceId);

  const flushMutation = useMutation({
    mutationFn: () => fetch('/api/usage/flush', { method: 'POST' }).then((r) => r.json()),
  });

  const histMax = Math.max(...historical.map((p) => p.totalTokens), 1);

  return (
    <div className="space-y-6">
      {/* Current window */}
      <Section label="Current 5-hour window">
        {window ? (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tabular-nums">{window.percent}%</span>
              <span className="text-xs text-muted-foreground">
                {window.totalTokens.toLocaleString()} / {window.capEstimate.toLocaleString()} tokens
              </span>
            </div>
            <PercentBar pct={window.percent} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Input: {window.inputTokens.toLocaleString()}</span>
              <span>Output: {window.outputTokens.toLocaleString()}</span>
              <span>Cache: {(window.cacheReadTokens + window.cacheWriteTokens).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Loading…</p>
        )}
      </Section>

      {/* Per-model breakdown */}
      {perModel.length > 0 && (
        <Section label="By model">
          <div className="space-y-2">
            {perModel.map((m) => {
              const maxTokens = Math.max(...perModel.map((x) => x.totalTokens), 1);
              return (
                <div key={m.model} className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="truncate text-muted-foreground">{m.model}</span>
                    <span className="tabular-nums">{m.totalTokens.toLocaleString()}</span>
                  </div>
                  <PercentBar pct={(m.totalTokens / maxTokens) * 100} />
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Per-workspace cost */}
      {perWorkspace.length > 0 && (
        <Section label="By workspace (5h)">
          <div className="space-y-1">
            {perWorkspace.slice(0, 5).map((ws) => (
              <div key={ws.workspaceId} className="flex items-center justify-between text-xs">
                <span className="truncate text-muted-foreground max-w-[60%]">
                  {ws.workspaceId === workspaceId && activeWs ? activeWs.name : ws.workspaceId.slice(0, 8) + '…'}
                </span>
                <span className="tabular-nums">{ws.totalTokens.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Historical chart */}
      <Section label="Historical">
        <SegmentedControl options={RANGE_OPTIONS} value={range} onChange={setRange} />
        {historical.length > 0 ? (
          <div className="mt-2 space-y-2">
            <SparkLine points={historical.map((p) => p.totalTokens)} max={histMax} />
            <div className="space-y-0.5">
              {historical.slice(-7).map((p) => (
                <div key={p.date} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{p.date}</span>
                  <span className="tabular-nums">{p.totalTokens.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No historical data yet.</p>
        )}
      </Section>

      {/* MCP overhead */}
      {mcpOverhead && mcpOverhead.entries.length > 0 && (
        <Section label="MCP schema overhead">
          <p className="text-xs text-muted-foreground">
            Estimated {mcpOverhead.totalEstimatedTokens.toLocaleString()} tokens/5h from MCP calls.
          </p>
          <div className="mt-1 space-y-0.5">
            {mcpOverhead.entries.slice(0, 5).map((e) => (
              <div key={e.workspaceId} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{e.workspaceId.slice(0, 8)}…</span>
                <span className="tabular-nums">{e.estimatedTokens.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Refresh */}
      <button
        onClick={() => flushMutation.mutate()}
        disabled={flushMutation.isPending}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {flushMutation.isPending ? 'Syncing…' : 'Sync now'}
      </button>
    </div>
  );
}
