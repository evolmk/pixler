import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { LinearTicket } from '@pixler/shared-types';

async function fetchTickets(projectId: string): Promise<LinearTicket[]> {
  const res = await fetch(`/api/linear/tickets?projectId=${encodeURIComponent(projectId)}`);
  if (!res.ok) return [];
  return res.json();
}

export function useLinearTickets(projectId: string | undefined) {
  const qc = useQueryClient();

  useEffect(() => {
    const handler = (event: { type: string; projectId?: string }) => {
      if (event.type === 'linear.synced' && event.projectId === projectId) {
        qc.invalidateQueries({ queryKey: ['linear', 'tickets', projectId] });
      }
    };
    socket.on('app:event', handler);
    return () => { socket.off('app:event', handler); };
  }, [projectId, qc]);

  return useQuery({
    queryKey: ['linear', 'tickets', projectId],
    queryFn: () => fetchTickets(projectId!),
    enabled: !!projectId,
  });
}

export function useForceLinearSync() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (projectId?: string) => {
      await fetch('/api/linear/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
    },
    onSuccess: (_data, projectId) => {
      qc.invalidateQueries({ queryKey: ['linear', 'tickets', projectId] });
    },
  });
}
