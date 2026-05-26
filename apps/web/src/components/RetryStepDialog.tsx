import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@pixler/ui/components/dialog';
import { Button } from '@pixler/ui/components/button';
import { Label } from '@pixler/ui/components/label';
import { Textarea } from '@pixler/ui/components/textarea';
import { Checkbox } from '@pixler/ui/components/checkbox';

interface Props {
  open: boolean;
  stepId: string;
  stepLabel: string;
  hasCheckpoint: boolean;
  checkpointLabel?: string;
  checkpointTime?: number;
  onConfirm: (addedContext: string, restoreCheckpoint: boolean) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function RetryStepDialog({
  open,
  stepLabel,
  hasCheckpoint,
  checkpointLabel,
  checkpointTime,
  onConfirm,
  onCancel,
  isPending,
}: Props) {
  const [addedContext, setAddedContext] = useState('');
  const [restoreCheckpoint, setRestoreCheckpoint] = useState(hasCheckpoint);

  function handleConfirm() {
    onConfirm(addedContext, restoreCheckpoint);
  }

  const checkpointTs = checkpointTime ? new Date(checkpointTime).toLocaleTimeString() : '';

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="size-4 text-primary" />
            Retry: {stepLabel}
          </DialogTitle>
          <DialogDescription>
            The step will re-run from the beginning with the original prompt plus any context you add below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm">Additional context (optional)</Label>
            <Textarea
              placeholder="Add context for the agent to consider on retry…"
              value={addedContext}
              onChange={(e) => setAddedContext(e.target.value)}
              rows={4}
              className="text-sm font-mono resize-none"
            />
          </div>

          {hasCheckpoint && (
            <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5">
              <Checkbox
                id="restore-checkpoint"
                checked={restoreCheckpoint}
                onCheckedChange={(v) => setRestoreCheckpoint(v === true)}
                className="mt-0.5"
              />
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="restore-checkpoint" className="text-sm font-medium cursor-pointer">
                  Restore pre-step checkpoint (recommended)
                </Label>
                {checkpointLabel && (
                  <p className="text-xs text-muted-foreground">
                    {checkpointLabel}{checkpointTs ? ` — ${checkpointTs}` : ''}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            <RotateCcw className="mr-1.5 size-3.5" />
            {isPending ? 'Retrying…' : 'Retry step'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
