import { useQuery } from '@tanstack/react-query';

async function fetchFiles(workspaceId: string): Promise<string[]> {
  const res = await fetch(`/api/workspaces/${workspaceId}/files`);
  if (!res.ok) return [];
  const data = await res.json() as { files: string[] };
  return data.files;
}

export function useWorkspaceFiles(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['workspace-files', workspaceId],
    queryFn: () => fetchFiles(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 30_000,
  });
}
