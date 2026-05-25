import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@pixler/ui/components/dialog';
import { Button } from '@pixler/ui/components/button';
import type { Checkpoint } from '@pixler/shared-types';

interface Props {
  checkpoint: Checkpoint | null;
  hasUncommitted: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RollbackConfirmModal({ checkpoint, hasUncommitted, onConfirm, onCancel }: Props) {
  if (!checkpoint) return null;

  const ts = new Date(checkpoint.createdAt).toLocaleString();

  return (
    <Dialog open={!!checkpoint} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-[oklch(0.75_0.15_85)]" />
            Roll back to checkpoint?
          </DialogTitle>
          <DialogDescription>
            This will restore the worktree, plan, and chat to the state captured at{' '}
            <span className="font-semibold text-foreground">{ts}</span>
            {checkpoint.label ? (
              <> — <span className="font-semibold text-foreground">{checkpoint.label}</span></>
            ) : null}.
          </DialogDescription>
        </DialogHeader>

        {hasUncommitted && (
          <p className="rounded-md border border-[oklch(0.75_0.15_85/0.3)] bg-[oklch(0.75_0.15_85/0.08)] px-3 py-2 text-sm text-[oklch(0.65_0.15_85)]">
            You have uncommitted changes. Rolling back will discard them permanently.
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. The current worktree state will be lost.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Roll back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
