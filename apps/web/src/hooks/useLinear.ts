import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { LinearStatusDto, LinearTeamDto, LinearProjectDto } from '@pixler/shared-types';

async function fetchStatus(): Promise<LinearStatusDto> {
  const res = await fetch('/api/linear/status');
  return res.json();
}

async function fetchTeams(): Promise<LinearTeamDto[]> {
  const res = await fetch('/api/linear/teams');
  if (!res.ok) return [];
  return res.json();
}

async function fetchProjects(teamId: string): Promise<LinearProjectDto[]> {
  const res = await fetch(`/api/linear/projects?teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) return [];
  return res.json();
}

export function useLinearStatus() {
  return useQuery({
    queryKey: ['linear', 'status'],
    queryFn: fetchStatus,
    refetchInterval: 60_000,
  });
}

export function useLinearTeams() {
  const { data: status } = useLinearStatus();
  return useQuery({
    queryKey: ['linear', 'teams'],
    queryFn: fetchTeams,
    enabled: status?.connected === true,
  });
}

export function useLinearProjects(teamId: string | undefined) {
  return useQuery({
    queryKey: ['linear', 'projects', teamId],
    queryFn: () => fetchProjects(teamId!),
    enabled: !!teamId,
  });
}

export function useConnectLinear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pat: string) => {
      const res = await fetch('/api/linear/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pat }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to connect');
      }
      return res.json() as Promise<LinearStatusDto>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['linear'] });
    },
  });
}

export function useDisconnectLinear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch('/api/linear/disconnect', { method: 'POST' });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['linear'] });
    },
  });
}
