import { useEffect } from 'react';
import { useCurrentProjectStore } from '../stores/currentProject';
import { useProjects } from './useProjects';

export function useCurrentProject() {
  const projectId = useCurrentProjectStore((s) => s.projectId);
  const setProjectIdRaw = useCurrentProjectStore((s) => s.setProjectId);
  const { data: projects, isSuccess } = useProjects();

  useEffect(() => {
    if (!isSuccess || !projectId || !projects) return;
    if (!projects.some((p) => p.id === projectId)) setProjectIdRaw(null);
  }, [isSuccess, projectId, projects, setProjectIdRaw]);

  return {
    projectId: projectId ?? undefined,
    setProjectId: (id: string | null) => setProjectIdRaw(id),
  };
}
