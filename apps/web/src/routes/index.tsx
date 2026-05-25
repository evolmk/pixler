import { FolderPlus } from 'lucide-react';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { Button } from '@pixler/ui/components/button';

/**
 * Home route (`/`). Shown when no project is open. The CTA is a stub here —
 * M07 wires it to the real New Project dialog.
 */
export function HomeRoute() {
  return (
    <div className="grid h-screen w-screen place-items-center bg-background p-6 text-foreground">
      <EmptyState
        icon={FolderPlus}
        title="No projects yet"
        body="Add a local repo or clone one from GitHub to get started."
        className="max-w-sm"
        action={
          <Button
            onClick={() => {
              // Stub: M07 opens the New Project dialog here.
              console.info('[pixler] Create first project — wired up in M07');
            }}
          >
            Create your first project
          </Button>
        }
      />
    </div>
  );
}
