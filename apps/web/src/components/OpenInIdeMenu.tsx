import { Code2, ChevronDown } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pixler/ui/components/dropdown-menu';
import { useIDEs, useOpenInIde } from '../hooks/useIDEs';

interface Props {
  workspaceId: string;
}

export function OpenInIdeMenu({ workspaceId }: Props) {
  const { data: ides = [] } = useIDEs();
  const openInIde = useOpenInIde(workspaceId);
  const available = ides.filter((ide) => ide.available);

  if (available.length === 0) {
    return (
      <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs" disabled aria-label="Open in IDE">
        <Code2 className="size-3" />
        IDE
      </Button>
    );
  }

  if (available.length === 1) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 gap-1 text-xs"
        onClick={() => void openInIde.mutateAsync({ ide: available[0].id })}
        aria-label={`Open in ${available[0].name}`}
      >
        <Code2 className="size-3" />
        {available[0].name}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs" aria-label="Open in IDE">
          <Code2 className="size-3" />
          Open in IDE
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {available.map((ide) => (
          <DropdownMenuItem
            key={ide.id}
            onClick={() => void openInIde.mutateAsync({ ide: ide.id })}
          >
            {ide.name}
            {ide.version && (
              <span className="ml-auto text-xs text-muted-foreground">{ide.version.split('\n')[0]?.substring(0, 12)}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
