import { useEffect } from 'react';
import { useCurrentProjectStore } from '../stores/currentProject';
import { useProjects } from './useProjects';

export function useCurrentProject() {
  const projectId = useCurrentProjectStore((s) => s.projectId);
  const setProjectId = useCurrentProjectStore((s) => s.setProjectId);
  const { data: projects, isSuccess } = useProjects();

  useEffect(() => {
    if (!isSuccess || !projectId || !projects) return;
    if (!projects.some((p) => p.id === projectId)) setProjectId(null);
  }, [isSuccess, projectId, projects, setProjectId]);

  return { projectId, setProjectId };
}
