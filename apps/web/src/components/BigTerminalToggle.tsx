import { TerminalSquare } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { cn } from '@pixler/ui/lib/utils';
import { useLayoutStore } from '../stores/layout';

export function BigTerminalToggle() {
  const bigTerminal = useLayoutStore((s) => s.bigTerminal);
  const toggleBigTerminal = useLayoutStore((s) => s.toggleBigTerminal);

  return (
    <div className="shrink-0 border-t border-border p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleBigTerminal}
        className={cn(
          'w-full justify-start gap-2 text-xs',
          bigTerminal && 'bg-accent text-accent-foreground',
        )}
        aria-label={bigTerminal ? 'Restore 3-pane layout' : 'Expand terminal full-bleed'}
      >
        <TerminalSquare className="size-3.5" />
        {bigTerminal ? 'Restore Layout' : 'Big Terminal'}
      </Button>
    </div>
  );
}
