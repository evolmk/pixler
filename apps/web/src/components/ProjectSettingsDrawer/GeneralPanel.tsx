import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@pixler/ui/components/alert-dialog';
import { Separator } from '@pixler/ui/components/separator';
import { useProject } from '../../hooks/useProject';
import { usePatchProject, useRemoveProject } from '../../hooks/useProjects';
import { useLayoutStore } from '../../stores/layout';
import { useCurrentProject } from '../../hooks/useCurrentProject';


export function GeneralPanel() {
  const { projectId } = useCurrentProject();
  const { data: project, isLoading } = useProject(projectId);
  const patch = usePatchProject();
  const remove = useRemoveProject();
  const setOpen = useLayoutStore((s) => s.setProjectSettingsOpen);

  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);

  if (isLoading || !project) {
    return <p className="text-xs text-muted-foreground">Loading…</p>;
  }

  const displayName = editing ? name : project.name;

  const handleNameSave = async () => {
    if (name.trim() && name.trim() !== project.name) {
      await patch.mutateAsync({ id: project.id, dto: { name: name.trim() } });
    }
    setEditing(false);
  };

  const handleRemove = async () => {
    await remove.mutateAsync({ id: project.id });
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proj-name">Project name</Label>
        <div className="flex gap-2">
          <Input
            id="proj-name"
            value={displayName}
            onFocus={() => { setEditing(true); setName(project.name); }}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNameSave(); }}
            className="text-sm"
          />
        </div>
      </div>

      {/* Path (read-only) */}
      <div className="flex flex-col gap-1.5">
        <Label>Repository path</Label>
        <p className="break-all font-mono text-xs text-muted-foreground">{project.path}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="mb-0.5 text-muted-foreground">Default branch</p>
          <p className="font-mono">{project.default_branch}</p>
        </div>
        <div>
          <p className="mb-0.5 text-muted-foreground">Package manager</p>
          <p className="font-mono">{project.package_manager}</p>
        </div>
      </div>

      <Separator />

      {/* Danger zone */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-destructive">Danger zone</p>

        {/* Remove */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium">Remove project</p>
            <p className="text-xs text-muted-foreground">Removes from Pixler; repo stays on disk.</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Trash2 className="size-3" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove project?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes <strong>{project.name}</strong> from Pixler. The files on disk are
                  untouched.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRemove}>Remove</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

      </div>
    </div>
  );
}
