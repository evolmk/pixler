import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from '../lib/socket';
import type { GithubAuthStatus } from '@pixler/shared-types';

async function fetchGithubAuthStatus(): Promise<GithubAuthStatus> {
  const res = await fetch('/api/github/status');
  return res.json();
}

export function useGithubAuthStatus() {
  const qc = useQueryClient();

  useEffect(() => {
    const handler = (event: { type: string }) => {
      if (event.type === 'auth:github:connected' || event.type === 'auth:github:disconnected') {
        void qc.invalidateQueries({ queryKey: ['github', 'auth'] });
      }
    };
    socket.on('app:event', handler);
    return () => { socket.off('app:event', handler); };
  }, [qc]);

  return useQuery({
    queryKey: ['github', 'auth'],
    queryFn: fetchGithubAuthStatus,
    staleTime: 30_000,
    retry: false,
  });
}

export function useGithubOAuthUrl() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/github/url');
      if (!res.ok) throw new Error('Failed to get GitHub OAuth URL');
      return res.json() as Promise<{ url: string; state: string }>;
    },
    onSuccess: ({ url }) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    },
  });
}

export function useConnectGithubPAT() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pat: string) => {
      const res = await fetch('/api/auth/github/pat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pat }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Invalid GitHub PAT');
      }
      return res.json() as Promise<GithubAuthStatus>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['github'] });
    },
  });
}

export function useDisconnectGithub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/github/disconnect', { method: 'POST' });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['github'] });
    },
  });
}

export function useRemoveGithubCredential() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (method: 'pat' | 'oauth') => {
      await fetch('/api/auth/github/credential', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['github'] });
    },
  });
}
