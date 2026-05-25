import { useState } from 'react';
import { FolderOpen, Github } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@pixler/ui/components/dialog';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { CloneProgress } from './CloneProgress';
import { useAddLocalProject, useCloneProject } from '../hooks/useProjects';

type Step = 'pick' | 'local-form' | 'clone-form' | 'cloning' | 'done';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded?: (projectId: string) => void;
}

export function NewProjectDialog({ open, onOpenChange, onProjectAdded }: NewProjectDialogProps) {
  const [step, setStep] = useState<Step>('pick');
  const [localPath, setLocalPath] = useState('');
  const [cloneRepo, setCloneRepo] = useState('');
  const [cloneProjectId, setCloneProjectId] = useState('');
  const [error, setError] = useState('');

  const addLocal = useAddLocalProject();
  const startClone = useCloneProject();

  const reset = () => {
    setStep('pick');
    setLocalPath('');
    setCloneRepo('');
    setCloneProjectId('');
    setError('');
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleAddLocal = async () => {
    setError('');
    try {
      const project = await addLocal.mutateAsync({ path: localPath.trim() });
      onProjectAdded?.(project.id);
      handleOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add project');
    }
  };

  const handleClone = async () => {
    setError('');
    try {
      const { projectId } = await startClone.mutateAsync({ repo: cloneRepo.trim() });
      setCloneProjectId(projectId);
      setStep('cloning');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start clone');
    }
  };

  const title: Record<Step, string> = {
    pick: 'Add a project',
    'local-form': 'Open local repo',
    'clone-form': 'Clone from GitHub',
    cloning: 'Cloning…',
    done: 'Done',
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title[step]}</DialogTitle>
          <DialogDescription className="sr-only">
            Add a local git repo or clone one from GitHub.
          </DialogDescription>
        </DialogHeader>

        {step === 'pick' && (
          <div className="grid grid-cols-2 gap-3">
            <TileButton
              icon={<FolderOpen className="size-6" />}
              label="Open local folder"
              description="Add an existing git repo from your machine"
              onClick={() => setStep('local-form')}
            />
            <TileButton
              icon={<Github className="size-6" />}
              label="Clone from GitHub"
              description="Clone a public or private repo via gh CLI"
              onClick={() => setStep('clone-form')}
            />
          </div>
        )}

        {step === 'local-form' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="local-path">Repository path</Label>
              <Input
                id="local-path"
                placeholder="/Users/you/projects/my-app"
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLocal()}
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('pick')}>Back</Button>
              <Button
                onClick={handleAddLocal}
                disabled={!localPath.trim() || addLocal.isPending}
              >
                {addLocal.isPending ? 'Adding…' : 'Add project'}
              </Button>
            </div>
          </div>
        )}

        {step === 'clone-form' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clone-repo">GitHub repo</Label>
              <Input
                id="clone-repo"
                placeholder="owner/repo or full URL"
                value={cloneRepo}
                onChange={(e) => setCloneRepo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleClone()}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Clones to ~/pixler/repos/&lt;name&gt;/
              </p>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('pick')}>Back</Button>
              <Button
                onClick={handleClone}
                disabled={!cloneRepo.trim() || startClone.isPending}
              >
                {startClone.isPending ? 'Starting…' : 'Clone'}
              </Button>
            </div>
          </div>
        )}

        {step === 'cloning' && (
          <CloneProgress
            projectId={cloneProjectId}
            onComplete={() => {
              onProjectAdded?.(cloneProjectId);
              handleOpenChange(false);
            }}
            onError={(e) => {
              setError(e);
              setStep('clone-form');
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TileButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  );
}
