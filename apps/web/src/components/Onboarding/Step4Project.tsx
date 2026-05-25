import { useState } from 'react';
import { CheckCircle, FolderOpen, Github, SkipForward } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { useAddLocalProject, useCloneProject } from '../../hooks/useProjects';

type Mode = 'pick' | 'local' | 'clone' | 'done';

interface Props {
  onNext?: () => void;
}

export function Step4Project({ onNext }: Props = {}) {
  const [mode, setMode] = useState<Mode>('pick');
  const [localPath, setLocalPath] = useState('');
  const [cloneRepo, setCloneRepo] = useState('');
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  const addLocal = useAddLocalProject();
  const clone = useCloneProject();

  const handleAddLocal = async () => {
    if (!localPath.trim()) return;
    setError('');
    try {
      await addLocal.mutateAsync({ path: localPath.trim(), name: projectName.trim() || undefined });
      setMode('done');
      onNext?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add project');
    }
  };

  const handleClone = async () => {
    if (!cloneRepo.trim()) return;
    setError('');
    try {
      const res = await clone.mutateAsync({ repo: cloneRepo.trim() });
      void res;
      setMode('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Clone failed');
    }
  };

  if (mode === 'done') {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-success">
        <CheckCircle className="size-8" />
        <p className="text-sm font-medium">Project added successfully</p>
      </div>
    );
  }

  if (mode === 'local') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setMode('pick')}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
        <div className="space-y-2">
          <Label className="text-xs">Project path</Label>
          <Input
            value={localPath}
            onChange={(e) => setLocalPath(e.target.value)}
            placeholder="/Users/you/my-project"
            className="font-mono text-xs h-9"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Name (optional)</Label>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="my-project"
            className="text-xs h-9"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          onClick={() => void handleAddLocal()}
          disabled={!localPath.trim() || addLocal.isPending}
          className="w-full"
        >
          Add project
        </Button>
      </div>
    );
  }

  if (mode === 'clone') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setMode('pick')}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
        <div className="space-y-2">
          <Label className="text-xs">GitHub repository</Label>
          <Input
            value={cloneRepo}
            onChange={(e) => setCloneRepo(e.target.value)}
            placeholder="owner/repo"
            className="font-mono text-xs h-9"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button
          onClick={() => void handleClone()}
          disabled={!cloneRepo.trim() || clone.isPending}
          className="w-full"
        >
          Clone via gh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Add your first project to get started.</p>

      <button
        onClick={() => setMode('local')}
        className="w-full flex items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
      >
        <FolderOpen className="size-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-sm font-medium">Open local repo</p>
          <p className="text-xs text-muted-foreground">Point to a repo already on disk</p>
        </div>
      </button>

      <button
        onClick={() => setMode('clone')}
        className="w-full flex items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
      >
        <Github className="size-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-sm font-medium">Clone from GitHub</p>
          <p className="text-xs text-muted-foreground">Requires gh CLI to be authenticated</p>
        </div>
      </button>

      <button
        onClick={() => setMode('done')}
        className="w-full flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-left hover:bg-accent/20 transition-colors"
      >
        <SkipForward className="size-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-sm font-medium text-muted-foreground">Skip for now</p>
          <p className="text-xs text-muted-foreground">Add projects later from the sidebar</p>
        </div>
      </button>
    </div>
  );
}
