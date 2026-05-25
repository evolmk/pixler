import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { Plan, SavePlanDto } from '@pixler/shared-types';

async function fetchPlan(workspaceId: string): Promise<Plan | null> {
  const res = await fetch(`/api/workspaces/${workspaceId}/plan`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch plan');
  return res.json() as Promise<Plan>;
}

async function fetchRecommendation(workspaceId: string): Promise<{ mode: string; reason: string }> {
  const res = await fetch(`/api/workspaces/${workspaceId}/plan/recommend`);
  if (!res.ok) throw new Error('Failed to fetch recommendation');
  return res.json() as Promise<{ mode: string; reason: string }>;
}

export function usePlan(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;

    const onBigPlanPrompt = (data: unknown) => {
      const evt = data as { workspaceId: string };
      if (evt.workspaceId === workspaceId) {
        void queryClient.invalidateQueries({ queryKey: ['plan', workspaceId] });
      }
    };

    socket.on('plan.big-plan-prompt', onBigPlanPrompt);
    return () => { socket.off('plan.big-plan-prompt', onBigPlanPrompt); };
  }, [workspaceId, queryClient]);

  return useQuery({
    queryKey: ['plan', workspaceId],
    queryFn: () => fetchPlan(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function usePlanRecommendation(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['plan-recommend', workspaceId],
    queryFn: () => fetchRecommendation(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useSavePlan(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: SavePlanDto) =>
      fetch(`/api/workspaces/${workspaceId}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      }).then((r) => r.json() as Promise<Plan>),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan', workspaceId] }),
  });
}

export function useToggleTask(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskIndex, completed }: { taskIndex: number; completed: boolean }) =>
      fetch(`/api/workspaces/${workspaceId}/plan/toggle-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIndex, completed }),
      }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan', workspaceId] }),
  });
}
