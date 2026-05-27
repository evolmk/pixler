import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useLinearTeams } from './useLinear';

async function fetchProjectSettings(projectId: string): Promise<Record<string, unknown>> {
  const res = await fetch(`/api/settings?scope=project&id=${encodeURIComponent(projectId)}`);
  return res.json();
}

async function patchProjectSetting(projectId: string, key: string, value: unknown): Promise<void> {
  await fetch('/api/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scope: 'project', id: projectId, patch: { [key]: value } }),
  });
}

export function useProjectLinearLink(projectId: string | undefined) {
  const qc = useQueryClient();
  const { data: teams = [] } = useLinearTeams();

  const { data: settings } = useQuery({
    queryKey: ['settings', 'project', projectId],
    queryFn: () => fetchProjectSettings(projectId!),
    enabled: !!projectId,
  });

  const teamKey = (settings?.['linear.team'] as string | undefined) ?? '';
  const projectId_ = (settings?.['linear.projectId'] as string | undefined) ?? '';
  const activeTeam = teams.find((t) => t.key === teamKey);

  const setTeam = useCallback(
    (key: string) => {
      if (!projectId) return;
      void patchProjectSetting(projectId, 'linear.team', key).then(() => {
        void qc.invalidateQueries({ queryKey: ['settings', 'project', projectId] });
      });
    },
    [projectId, qc],
  );

  const setProject = useCallback(
    (id: string) => {
      if (!projectId) return;
      void patchProjectSetting(projectId, 'linear.projectId', id).then(() => {
        void qc.invalidateQueries({ queryKey: ['settings', 'project', projectId] });
      });
    },
    [projectId, qc],
  );

  const clear = useCallback(() => {
    if (!projectId) return;
    void patchProjectSetting(projectId, 'linear.projectId', '').then(() => {
      void qc.invalidateQueries({ queryKey: ['settings', 'project', projectId] });
    });
  }, [projectId, qc]);

  return {
    teamKey,
    teamId: activeTeam?.id,
    projectId: projectId_,
    setTeam,
    setProject,
    clear,
  };
}
