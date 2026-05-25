import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PullRequest, CreatePrDto, MergePrDto } from '@pixler/shared-types';

async function fetchPr(workspaceId: string): Promise<PullRequest> {
  const res = await fetch(`/api/workspaces/${workspaceId}/pr`);
  if (!res.ok) throw new Error('No PR found');
  return res.json();
}

async function createPr(workspaceId: string, dto: CreatePrDto): Promise<PullRequest> {
  const res = await fetch(`/api/workspaces/${workspaceId}/pr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create PR');
  }
  return res.json();
}

async function mergePr(workspaceId: string, dto: MergePrDto): Promise<{ merged: boolean }> {
  const res = await fetch(`/api/workspaces/${workspaceId}/pr/merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Merge failed');
  return res.json();
}

export function usePullRequest(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['pr', workspaceId],
    queryFn: () => fetchPr(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 60_000,
    retry: false,
  });
}

export function useCreatePr(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePrDto) => createPr(workspaceId, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['pr', workspaceId] });
      void qc.invalidateQueries({ queryKey: ['checks', workspaceId] });
    },
  });
}

export function useMergePr(workspaceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: MergePrDto) => mergePr(workspaceId, dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['pr', workspaceId] });
    },
  });
}
