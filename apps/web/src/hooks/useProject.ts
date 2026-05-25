import { useQuery } from '@tanstack/react-query';
import type { Project } from '@pixler/shared-types';

async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error(`Project ${id} not found`);
  return res.json();
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });
}
