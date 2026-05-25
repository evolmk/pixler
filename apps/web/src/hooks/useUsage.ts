import { useQuery } from '@tanstack/react-query';
import type {
  UsageWindow,
  UsagePerModel,
  UsagePerWorkspace,
  UsageHistoricalPoint,
  McpOverheadSummary,
} from '@pixler/shared-types';

const REFETCH_INTERVAL = 30_000;

async function fetchWindow(hours: number): Promise<UsageWindow> {
  const res = await fetch(`/api/usage/window?hours=${hours}`);
  if (!res.ok) throw new Error('Failed to fetch usage window');
  return res.json();
}

async function fetchPerModel(since?: number, until?: number): Promise<UsagePerModel[]> {
  const params = new URLSearchParams();
  if (since) params.set('since', String(since));
  if (until) params.set('until', String(until));
  const res = await fetch(`/api/usage/per-model?${params}`);
  if (!res.ok) return [];
  return res.json();
}

async function fetchPerWorkspace(workspaceId?: string): Promise<UsagePerWorkspace[]> {
  const params = workspaceId ? `?workspaceId=${workspaceId}` : '';
  const res = await fetch(`/api/usage/per-workspace${params}`);
  if (!res.ok) return [];
  return res.json();
}

async function fetchHistorical(range: 'daily' | 'weekly' | 'monthly'): Promise<UsageHistoricalPoint[]> {
  const res = await fetch(`/api/usage/historical?range=${range}`);
  if (!res.ok) return [];
  return res.json();
}

async function fetchMcpOverhead(): Promise<McpOverheadSummary> {
  const res = await fetch('/api/usage/mcp-overhead');
  if (!res.ok) return { entries: [], totalEstimatedTokens: 0 };
  return res.json();
}

export function useUsageWindow(hours = 5) {
  return useQuery({
    queryKey: ['usage', 'window', hours],
    queryFn: () => fetchWindow(hours),
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useUsagePerModel(since?: number, until?: number) {
  return useQuery({
    queryKey: ['usage', 'per-model', since, until],
    queryFn: () => fetchPerModel(since, until),
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useUsagePerWorkspace(workspaceId?: string) {
  return useQuery({
    queryKey: ['usage', 'per-workspace', workspaceId],
    queryFn: () => fetchPerWorkspace(workspaceId),
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useUsageHistorical(range: 'daily' | 'weekly' | 'monthly' = 'daily') {
  return useQuery({
    queryKey: ['usage', 'historical', range],
    queryFn: () => fetchHistorical(range),
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useMcpOverhead() {
  return useQuery({
    queryKey: ['usage', 'mcp-overhead'],
    queryFn: fetchMcpOverhead,
    refetchInterval: REFETCH_INTERVAL,
  });
}
