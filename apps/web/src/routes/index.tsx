import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FolderPlus } from 'lucide-react';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { Button } from '@pixler/ui/components/button';
import { NewProjectDialog } from '../components/NewProjectDialog';

export function HomeRoute() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

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
        onProjectAdded={(id) => navigate({ to: '/p/$projectId', params: { projectId: id } })}
      />
    </div>
  );
}
