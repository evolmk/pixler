import { Plus, Terminal } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@pixler/ui/components/dropdown-menu';

interface TerminalSwitcherProps {
  terminals: string[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function TerminalSwitcher({
  terminals,
  activeId,
  onSelect,
  onNew,
}: TerminalSwitcherProps) {
  const activeIndex = terminals.indexOf(activeId ?? '');
  const label = activeIndex >= 0 ? `Terminal ${activeIndex + 1}` : 'Terminal';

  if (terminals.length <= 1) {
    return (
      <Button variant="ghost" size="icon-xs" onClick={onNew} aria-label="New terminal">
        <Plus className="size-3.5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs">
          <Terminal className="size-3" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px]">
        {terminals.map((id, i) => (
          <DropdownMenuItem
            key={id}
            onSelect={() => onSelect(id)}
            className={id === activeId ? 'font-medium' : ''}
          >
            Terminal {i + 1}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onNew}>
          <Plus className="mr-2 size-3.5" />
          New terminal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
