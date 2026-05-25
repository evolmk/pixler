import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project, AddLocalProjectDto, PatchProjectDto } from '@pixler/shared-types';

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

async function addLocal(dto: AddLocalProjectDto): Promise<Project> {
  const res = await fetch('/api/projects/add-local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'Failed to add project');
  }
  return res.json();
}

async function cloneRepo(dto: { repo: string; name?: string }): Promise<{ projectId: string }> {
  const res = await fetch('/api/projects/clone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'Failed to start clone');
  }
  return res.json();
}

async function patchProject(id: string, dto: PatchProjectDto): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

async function removeProject(id: string, mode: 'remove' | 'delete'): Promise<void> {
  const res = await fetch(`/api/projects/${id}?mode=${mode}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove project');
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}

export function useAddLocalProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLocal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useCloneProject() {
  return useMutation({ mutationFn: cloneRepo });
}

export function usePatchProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: PatchProjectDto }) => patchProject(id, dto),
    onSuccess: (updated) => {
      queryClient.setQueryData<Project[]>(['projects'], (prev = []) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      queryClient.setQueryData(['project', updated.id], updated);
    },
  });
}

export function useRemoveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, mode }: { id: string; mode: 'remove' | 'delete' }) => removeProject(id, mode),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}
