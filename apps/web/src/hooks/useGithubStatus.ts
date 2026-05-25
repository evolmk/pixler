import { useQuery } from '@tanstack/react-query';
import type { GithubAuthStatus } from '@pixler/shared-types';

async function fetchGithubStatus(): Promise<GithubAuthStatus> {
  const res = await fetch('/api/github/status');
  return res.json();
}

export function useGithubStatus() {
  return useQuery({
    queryKey: ['github', 'status'],
    queryFn: fetchGithubStatus,
    staleTime: 30_000,
    retry: false,
  });
}
