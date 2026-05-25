import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { Checkpoint, TakeCheckpointDto } from '@pixler/shared-types';

async function fetchCheckpoints(workspaceId: string): Promise<Checkpoint[]> {
  const res = await fetch(`/api/workspaces/${workspaceId}/checkpoints`);
  if (!res.ok) throw new Error('Failed to fetch checkpoints');
  return res.json() as Promise<Checkpoint[]>;
}

export function useCheckpoints(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;

    const onTaken = (data: unknown) => {
      const evt = data as { workspaceId: string };
      if (evt.workspaceId === workspaceId) {
        void queryClient.invalidateQueries({ queryKey: ['checkpoints', workspaceId] });
      }
    };
    const onRolledBack = (data: unknown) => {
      const evt = data as { workspaceId: string };
      if (evt.workspaceId === workspaceId) {
        void queryClient.invalidateQueries({ queryKey: ['checkpoints', workspaceId] });
      }
    };

    socket.on('checkpoint.taken', onTaken);
    socket.on('checkpoint.rolled-back', onRolledBack);
    return () => {
      socket.off('checkpoint.taken', onTaken);
      socket.off('checkpoint.rolled-back', onRolledBack);
    };
  }, [workspaceId, queryClient]);

  return useQuery({
    queryKey: ['checkpoints', workspaceId],
    queryFn: () => fetchCheckpoints(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useTakeCheckpoint(workspaceId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: TakeCheckpointDto = {}) => {
      const res = await fetch(`/api/workspaces/${workspaceId}/checkpoints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      if (!res.ok) throw new Error('Failed to take checkpoint');
      return res.json() as Promise<Checkpoint>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['checkpoints', workspaceId] });
    },
  });
}

export function useRollbackCheckpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (checkpointId: string) => {
      const res = await fetch(`/api/checkpoints/${checkpointId}/rollback`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to rollback checkpoint');
      return res.json();
    },
    onSuccess: (_data, _checkpointId, _context) => {
      void queryClient.invalidateQueries({ queryKey: ['checkpoints'] });
    },
  });
}

export function useDeleteCheckpoint(workspaceId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (checkpointId: string) => {
      const res = await fetch(`/api/checkpoints/${checkpointId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete checkpoint');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['checkpoints', workspaceId] });
    },
  });
}
