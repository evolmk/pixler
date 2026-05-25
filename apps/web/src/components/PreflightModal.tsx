import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@pixler/ui/components/dialog';
import { Button } from '@pixler/ui/components/button';
import { useLayoutStore } from '../stores/layout';

interface Props {
  open: boolean;
  percent: number;
  parallelCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PreflightModal({ open, percent, parallelCount, onConfirm, onCancel }: Props) {
  const setSettingsOpen = useLayoutStore((s) => s.setSettingsOpen);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-[oklch(0.75_0.15_85)]" />
            High token usage
          </DialogTitle>
          <DialogDescription>
            You're at <span className="font-semibold text-foreground">{percent}%</span> of your
            5-hour token window and are about to spawn{' '}
            <span className="font-semibold text-foreground">{parallelCount + 1}</span> parallel agent{parallelCount > 0 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Running multiple agents near the cap may cause rate-limit errors mid-task. Consider waiting
          for the window to reset or reducing parallelism.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="default" onClick={onConfirm}>
            Run anyway
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <button
            onClick={() => { onCancel(); setSettingsOpen(true, 'usage'); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View usage details →
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
