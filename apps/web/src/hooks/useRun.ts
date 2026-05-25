import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { RunStatus, StartRunDto } from '@pixler/shared-types';

async function fetchRunStatus(workspaceId: string): Promise<RunStatus> {
  const res = await fetch(`/api/workspaces/${workspaceId}/run`);
  if (!res.ok) throw new Error('Failed to fetch run status');
  return res.json();
}

async function startRun(workspaceId: string, dto: StartRunDto): Promise<RunStatus> {
  const res = await fetch(`/api/workspaces/${workspaceId}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to start run');
  return res.json();
}

async function stopRun(workspaceId: string): Promise<RunStatus> {
  const res = await fetch(`/api/workspaces/${workspaceId}/run/stop`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to stop run');
  return res.json();
}

export function useRunStatus(workspaceId: string | undefined) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!workspaceId) return;
    const handler = (event: { type: string; [key: string]: unknown }) => {
      if (event.type === 'run.status') {
        void qc.invalidateQueries({ queryKey: ['run', workspaceId] });
      }
    };
    socket.on('workspace:event', handler);
    return () => { socket.off('workspace:event', handler); };
  }, [workspaceId, qc]);

  return useQuery<RunStatus>({
    queryKey: ['run', workspaceId],
    queryFn: () => fetchRunStatus(workspaceId!),
    enabled: !!workspaceId,
    refetchInterval: false,
  });
}

export function useStartRun(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: StartRunDto = {}) => startRun(workspaceId, dto),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['run', workspaceId] }),
  });
}

export function useStopRun(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => stopRun(workspaceId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['run', workspaceId] }),
  });
}
