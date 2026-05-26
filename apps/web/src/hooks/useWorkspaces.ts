import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import type { Workspace, CreateWorkspaceDto, PatchWorkspaceDto } from '@pixler/shared-types';

async function fetchWorkspaces(projectId: string): Promise<Workspace[]> {
  const res = await fetch(`/api/workspaces?projectId=${projectId}`);
  if (!res.ok) throw new Error('Failed to fetch workspaces');
  return res.json();
}

async function createWorkspace(dto: CreateWorkspaceDto): Promise<Workspace> {
  const res = await fetch('/api/workspaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? err?.message ?? 'Failed to create workspace');
  }
  return res.json();
}

async function patchWorkspace(id: string, dto: PatchWorkspaceDto): Promise<Workspace> {
  const res = await fetch(`/api/workspaces/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to update workspace');
  return res.json();
}

async function archiveWorkspace(id: string): Promise<Workspace> {
  const res = await fetch(`/api/workspaces/${id}/archive`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to archive workspace');
  return res.json();
}

async function removeWorkspace(id: string): Promise<void> {
  const res = await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove workspace');
}

async function rerunSetup(id: string): Promise<void> {
  const res = await fetch(`/api/workspaces/${id}/rerun-setup`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to rerun setup');
}

export function useWorkspaces(projectId?: string) {
  return useQuery({
    queryKey: ['workspaces', projectId],
    queryFn: () => fetchWorkspaces(projectId!),
    enabled: !!projectId,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (ws) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', ws.project_id] });
    },
  });
}

export function usePatchWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: PatchWorkspaceDto }) => patchWorkspace(id, dto),
    onSuccess: (ws) => {
      queryClient.setQueryData<Workspace[]>(['workspaces', ws.project_id], (prev = []) =>
        prev.map((w) => (w.id === ws.id ? ws : w)),
      );
    },
  });
}

export function useArchiveWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveWorkspace,
    onSuccess: (ws) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', ws.project_id] });
    },
  });
}

export function useRemoveWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeWorkspace,
    onSuccess: (_v, id) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
}

export function useRerunSetup() {
  return useMutation({ mutationFn: rerunSetup });
}
