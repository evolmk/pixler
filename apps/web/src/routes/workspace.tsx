import { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@pixler/ui/components/button';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { FileQuestion } from 'lucide-react';
import { useWorkspace } from '../hooks/useWorkspaces';
import { useCurrentProject } from '../hooks/useCurrentProject';
import { ProjectShell } from './project';

/**
 * `/w/$workspaceId` — resolves the workspace's `project_id` server-side and
 * syncs it into the current-project store before rendering the shell. This
 * lets users hard-load a workspace URL without the project being pre-set.
 */
export function WorkspaceRoute() {
  const { workspaceId } = useParams({ from: '/w/$workspaceId' });
  const navigate = useNavigate();
  const { projectId, setProjectId } = useCurrentProject();
  const { data: workspace, isLoading, isError } = useWorkspace(workspaceId);

  useEffect(() => {
    if (workspace && workspace.project_id !== projectId) {
      setProjectId(workspace.project_id);
    }
  }, [workspace, projectId, setProjectId]);

  if (isLoading) {
    return (
      <div className="grid h-screen w-screen place-items-center bg-background text-muted-foreground">
        Loading workspace…
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="grid h-screen w-screen place-items-center bg-background p-6 text-foreground">
        <EmptyState
          icon={FileQuestion}
          title="Workspace not found"
          body={`No workspace with id ${workspaceId}.`}
          className="max-w-sm"
          action={
            <Button onClick={() => navigate({ to: '/' })}>Back to home</Button>
          }
        />
      </div>
    );
  }

  return <ProjectShell />;
}
