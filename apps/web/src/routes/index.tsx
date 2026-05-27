import { useEffect, useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { Button } from '@pixler/ui/components/button';
import { NewProjectDialog } from '../components/NewProjectDialog';
import { useProjects } from '../hooks/useProjects';
import { useCurrentProject } from '../hooks/useCurrentProject';
import { ProjectShell } from './project';

/**
 * `/` — renders ProjectShell when a current project is set (via localStorage-
 * backed store), otherwise shows the picker / onboarding. Auto-selects the
 * first project on mount if nothing is stored.
 */
export function RootRoute() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: projects, isLoading } = useProjects();
  const { projectId, setProjectId } = useCurrentProject();

  useEffect(() => {
    if (isLoading || !projects) return;
    if (!projectId && projects.length > 0) setProjectId(projects[0].id);
  }, [isLoading, projects, projectId, setProjectId]);

  if (isLoading) return null;
  if (projectId) return <ProjectShell />;

  return (
    <div className="grid h-screen w-screen place-items-center bg-background p-6 text-foreground">
      <EmptyState
        icon={FolderPlus}
        title="No projects yet"
        body="Add a local repo or clone one from GitHub to get started."
        className="max-w-sm"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            Create your first project
          </Button>
        }
      />
      <NewProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onProjectAdded={(id) => setProjectId(id)}
      />
    </div>
  );
}
