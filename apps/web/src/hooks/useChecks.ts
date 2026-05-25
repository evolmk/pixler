import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../lib/socket';
import type { PrCheck } from '@pixler/shared-types';

async function fetchChecks(workspaceId: string): Promise<PrCheck[]> {
  const res = await fetch(`/api/workspaces/${workspaceId}/pr/checks`);
  if (!res.ok) return [];
  return res.json();
}

export function useChecks(workspaceId: string | undefined) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;
    const handler = (event: { type: string }) => {
      if (event.type === 'pr.checks-updated') {
        void qc.invalidateQueries({ queryKey: ['checks', workspaceId] });
      }
    };
    socket.on(`workspace:event`, handler);
    return () => { socket.off('workspace:event', handler); };
  }, [workspaceId, qc]);

  return useQuery({
    queryKey: ['checks', workspaceId],
    queryFn: () => fetchChecks(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 30_000,
    retry: false,
  });
}
