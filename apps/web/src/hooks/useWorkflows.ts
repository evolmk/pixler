import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { WorkflowDefDto } from '@pixler/shared-types';

async function fetchWorkflows(repoDir?: string): Promise<WorkflowDefDto[]> {
  const url = repoDir ? `/api/workflows?repoDir=${encodeURIComponent(repoDir)}` : '/api/workflows';
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

async function fetchWorkflow(name: string, repoDir?: string): Promise<{ yaml: string; source: string }> {
  const url = repoDir ? `/api/workflows/${name}?repoDir=${encodeURIComponent(repoDir)}` : `/api/workflows/${name}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Workflow '${name}' not found`);
  return res.json();
}

export function useWorkflows(repoDir?: string) {
  return useQuery({
    queryKey: ['workflows', repoDir],
    queryFn: () => fetchWorkflows(repoDir),
    staleTime: 60_000,
  });
}

export function useWorkflow(name: string, repoDir?: string) {
  return useQuery({
    queryKey: ['workflows', 'yaml', name, repoDir],
    queryFn: () => fetchWorkflow(name, repoDir),
    enabled: !!name,
    staleTime: 30_000,
  });
}

export function useSaveWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, yaml }: { name: string; yaml: string }) => {
      const res = await fetch(`/api/workflows/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaml }),
      });
      if (!res.ok) throw new Error('Failed to save workflow');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useDuplicateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, repoDir }: { name: string; repoDir?: string }) => {
      const url = repoDir
        ? `/api/workflows/${name}/duplicate?repoDir=${encodeURIComponent(repoDir)}`
        : `/api/workflows/${name}/duplicate`;
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to duplicate workflow');
      return res.json() as Promise<WorkflowDefDto>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useArchiveWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/workflows/${name}/archive`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to archive workflow');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}
