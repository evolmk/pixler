import { useQuery } from '@tanstack/react-query';
import type { Workspace } from '@pixler/shared-types';

async function fetchWorkspace(id: string): Promise<Workspace> {
  const res = await fetch(`/api/workspaces/${id}`);
  if (!res.ok) throw new Error('Workspace not found');
  return res.json();
}

export function useWorkspace(id?: string) {
  return useQuery({
    queryKey: ['workspace', id],
    queryFn: () => fetchWorkspace(id!),
    enabled: !!id,
  });
}
