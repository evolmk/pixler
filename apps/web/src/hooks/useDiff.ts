import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { socket } from '../lib/socket';
import type { DiffFileSummary, DiffFileDetail } from '@pixler/shared-types';

async function fetchDiffFiles(workspaceId: string): Promise<DiffFileSummary[]> {
  const res = await fetch(`/api/workspaces/${workspaceId}/diff`);
  if (!res.ok) return [];
  return res.json();
}

async function fetchFileDetail(workspaceId: string, path: string, against: string): Promise<DiffFileDetail> {
  const res = await fetch(
    `/api/workspaces/${workspaceId}/diff/file?path=${encodeURIComponent(path)}&against=${against}`,
  );
  if (!res.ok) throw new Error('Failed to fetch file diff');
  return res.json();
}

export function useDiffFiles(workspaceId: string | undefined) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!workspaceId) return;
    const handler = (event: { type: string }) => {
      if (event.type === 'diff.changed') {
        void qc.invalidateQueries({ queryKey: ['diff', workspaceId] });
      }
    };
    socket.on('workspace:event', handler);
    return () => { socket.off('workspace:event', handler); };
  }, [workspaceId, qc]);

  return useQuery({
    queryKey: ['diff', workspaceId],
    queryFn: () => fetchDiffFiles(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 5_000,
  });
}

export function useDiffFile(workspaceId: string | undefined, path: string | undefined, against = 'workdir') {
  return useQuery({
    queryKey: ['diff-file', workspaceId, path, against],
    queryFn: () => fetchFileDetail(workspaceId!, path!, against),
    enabled: !!workspaceId && !!path,
    staleTime: 5_000,
  });
}
