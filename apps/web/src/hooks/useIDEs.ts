import { useQuery, useMutation } from '@tanstack/react-query';
import type { DetectedIde, OpenInIdeDto } from '@pixler/shared-types';

async function fetchIDEs(): Promise<DetectedIde[]> {
  const res = await fetch('/api/ides');
  if (!res.ok) throw new Error('Failed to fetch IDEs');
  return res.json();
}

async function openInIde(workspaceId: string, dto: OpenInIdeDto): Promise<void> {
  await fetch(`/api/workspaces/${workspaceId}/open-in-ide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}

export function useIDEs() {
  return useQuery<DetectedIde[]>({
    queryKey: ['ides'],
    queryFn: fetchIDEs,
    staleTime: 60_000,
  });
}

export function useOpenInIde(workspaceId: string) {
  return useMutation({
    mutationFn: (dto: OpenInIdeDto = {}) => openInIde(workspaceId, dto),
  });
}
