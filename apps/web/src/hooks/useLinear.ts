import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from '../lib/socket';
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
  const qc = useQueryClient();

  useEffect(() => {
    const handler = (event: { type: string }) => {
      if (event.type === 'auth:linear:connected' || event.type === 'auth:linear:disconnected') {
        void qc.invalidateQueries({ queryKey: ['linear'] });
      }
    };
    socket.on('app:event', handler);
    return () => { socket.off('app:event', handler); };
  }, [qc]);

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
      await fetch('/api/auth/linear/disconnect', { method: 'POST' });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['linear'] });
    },
  });
}

export function useRemoveLinearCredential() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (method: 'pat' | 'oauth') => {
      await fetch('/api/auth/linear/credential', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['linear'] });
    },
  });
}

export function useLinearOAuthUrl() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/linear/url');
      if (!res.ok) throw new Error('Failed to get Linear OAuth URL');
      return res.json() as Promise<{ url: string; state: string }>;
    },
    onSuccess: ({ url }) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    },
  });
}
