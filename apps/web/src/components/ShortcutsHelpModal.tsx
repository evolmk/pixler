import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@pixler/ui/components/dialog';
import { getActions } from '../lib/palette/registry';
import { getKey, formatKey } from '../lib/palette/keyboard';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShortcutsHelpModal({ open, onOpenChange }: Props) {
  const bound = getActions()
    .filter((a) => a.group !== 'workspaces' && a.group !== 'tickets' && a.group !== 'files')
    .map((a) => ({ ...a, key: getKey(a.id) }))
    .filter((a) => !!a.key);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-0.5 pt-2">
          {bound.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No shortcuts configured.
            </p>
          )}
          {bound.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.id} className="flex items-center gap-2 px-2 py-1.5">
                {Icon && <Icon className="size-3.5 shrink-0 text-muted-foreground" />}
                <span className="flex-1 text-sm">{action.title}</span>
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {formatKey(action.key!)}
                </kbd>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
