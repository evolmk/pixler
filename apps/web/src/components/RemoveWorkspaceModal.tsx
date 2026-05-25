import { useState, useRef, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@pixler/ui/components/alert-dialog';
import { Checkbox } from '@pixler/ui/components/checkbox';
import { Label } from '@pixler/ui/components/label';
import { useRemoveWorkspace } from '../hooks/useWorkspaces';
import type { Workspace } from '@pixler/shared-types';

const SILENCE_KEY = 'pixler:remove-workspace-silenced-until';

function isSilenced(): boolean {
  const until = localStorage.getItem(SILENCE_KEY);
  return until != null && Date.now() < Number(until);
}

function setSilenced(): void {
  localStorage.setItem(SILENCE_KEY, String(Date.now() + 60_000));
}

interface RemoveWorkspaceModalProps {
  workspace: Workspace | null;
  onClose: () => void;
}

export function RemoveWorkspaceModal({ workspace, onClose }: RemoveWorkspaceModalProps) {
  const [silenceChecked, setSilenceChecked] = useState(false);
  const remove = useRemoveWorkspace();

  const skipped = useRef(false);
  useEffect(() => {
    if (workspace && isSilenced() && !skipped.current) {
      skipped.current = true;
      remove.mutate(workspace.id, { onSettled: onClose });
    }
  }, [workspace, remove, onClose]);

  if (!workspace) return null;

  const handleConfirm = () => {
    if (silenceChecked) setSilenced();
    remove.mutate(workspace.id, { onSettled: onClose });
  };

  if (isSilenced()) return null;

  return (
    <AlertDialog open={!!workspace} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove "{workspace.name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes the workspace record and removes the worktree from disk. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-2 py-1">
          <Checkbox
            id="silence"
            checked={silenceChecked}
            onCheckedChange={(v) => setSilenceChecked(v === true)}
          />
          <Label htmlFor="silence" className="text-sm font-normal text-muted-foreground cursor-pointer">
            Silence remove confirmations for 1 minute
          </Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={remove.isPending}
          >
            {remove.isPending ? 'Removing…' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
