import { useState } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@pixler/ui/components/dialog';
import { Button } from '@pixler/ui/components/button';
import { Checkbox } from '@pixler/ui/components/checkbox';
import { Label } from '@pixler/ui/components/label';

export type BigPlanChoice = 'file' | 'attachment' | 'cancel';

interface Props {
  open: boolean;
  taskCount: number;
  charCount: number;
  onChoose: (choice: BigPlanChoice, dontAskAgain: boolean) => void;
}

export function BigPlanPromptModal({ open, taskCount, charCount, onChoose }: Props) {
  const [dontAsk, setDontAsk] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onChoose('cancel', false); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Plan exceeds inline thresholds</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This plan has <strong>{taskCount} tasks</strong> and <strong>{charCount} chars</strong>.
          Inline storage is configured for ≤3 tasks.
        </p>

        <p className="text-sm font-medium mt-1">Choose storage for this plan:</p>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="justify-start gap-2 h-auto py-3"
            onClick={() => onChoose('file', dontAsk)}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="flex items-center gap-1.5 font-medium">
                📄 File
                <Star className="size-3 text-yellow-500" aria-label="Recommended" />
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                Write to docs/plans/ — survives machines, shows in PR diff
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start gap-2 h-auto py-3"
            onClick={() => onChoose('attachment', dontAsk)}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-medium">📎 Attach</span>
              <span className="text-xs text-muted-foreground font-normal">
                Upload to Linear as plan.md, v1/v2 tracking
              </span>
            </div>
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <Checkbox
            id="dont-ask"
            checked={dontAsk}
            onCheckedChange={(v) => setDontAsk(!!v)}
          />
          <Label htmlFor="dont-ask" className="text-xs cursor-pointer">
            Don't ask again for this project (use chosen)
          </Label>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onChoose('cancel', false)}>
            Cancel &amp; Revise Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
