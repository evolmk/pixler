import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@pixler/ui/components/sonner';
import { socket } from '../lib/socket';
import type { LinearStatusDto, LinearTeamDto, LinearProjectDto, LinearIssuePageDto, LinearIssueSummaryDto, CreateLinearIssueDto } from '@pixler/shared-types';

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
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg: string = (body as { error?: { message?: string } })?.error?.message ?? 'Failed to get Linear OAuth URL';
        throw new Error(msg);
      }
      return res.json() as Promise<{ url: string; state: string }>;
    },
    onSuccess: ({ url }) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Failed to get Linear OAuth URL';
      toast.error('Linear OAuth unavailable', {
        description: msg.includes('PIXLER_LINEAR_CLIENT_ID')
          ? msg
          : `${msg} — set PIXLER_LINEAR_CLIENT_ID to enable OAuth`,
      });
    },
  });
}

async function fetchIssues(
  teamId: string,
  projectId: string,
  q: string,
): Promise<LinearIssuePageDto> {
  const params = new URLSearchParams({ teamId, projectId });
  if (q) params.set('q', q);
  const res = await fetch(`/api/linear/issues?${params.toString()}`);
  if (!res.ok) return { nodes: [], cursor: null };
  return res.json();
}

export function useLinearIssues(opts: {
  teamId: string | undefined;
  projectId: string | undefined;
  q?: string;
}) {
  const { teamId, projectId, q = '' } = opts;
  const [debouncedQ, setDebouncedQ] = useState(q);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(id);
  }, [q]);

  return useQuery({
    queryKey: ['linear', 'issues', teamId, projectId, debouncedQ],
    queryFn: () => fetchIssues(teamId!, projectId!, debouncedQ),
    enabled: !!teamId && !!projectId,
    staleTime: 30_000,
  });
}

export function useCreateLinearIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateLinearIssueDto): Promise<LinearIssueSummaryDto> => {
      const res = await fetch('/api/linear/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg: string = (body as { error?: { message?: string } })?.error?.message ?? 'Failed to create issue';
        throw new Error(msg);
      }
      return res.json() as Promise<LinearIssueSummaryDto>;
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: ['linear', 'issues', vars.teamId, vars.projectId] });
    },
  });
}
