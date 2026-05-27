import { useState } from 'react';
import { ChevronDown, Loader2, Plus } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@pixler/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pixler/ui/components/popover';
import { Button } from '@pixler/ui/components/button';
import { Badge } from '@pixler/ui/components/badge';
import type { LinearIssueSummaryDto } from '@pixler/shared-types';
import { useLinearIssues } from '../hooks/useLinear';
import { CreateLinearIssueDialog } from './CreateLinearIssueDialog';

interface Props {
  teamId: string;
  projectId: string;
  selectedIdentifier?: string;
  onSelect: (identifier: string) => void;
}

function stateVariant(stateType: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (stateType) {
    case 'completed': return 'default';
    case 'cancelled': return 'destructive';
    case 'started': return 'secondary';
    default: return 'outline';
  }
}

export function LinearIssuePicker({ teamId, projectId, selectedIdentifier, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useLinearIssues({ teamId, projectId, q });
  const issues: LinearIssueSummaryDto[] = data?.nodes ?? [];

  const handleSelect = (identifier: string) => {
    onSelect(identifier);
    setOpen(false);
    setQ('');
  };

  const handleCreated = (issue: LinearIssueSummaryDto) => {
    onSelect(issue.identifier);
    setCreateOpen(false);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between gap-2 font-normal"
          >
            <span className="truncate">
              {selectedIdentifier ? selectedIdentifier : 'Pick an issue…'}
            </span>
            <ChevronDown className="size-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search issues…"
              value={q}
              onValueChange={setQ}
            />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => { setCreateOpen(true); setOpen(false); }}
                  className="gap-2 text-muted-foreground"
                >
                  <Plus className="size-3.5" />
                  Create new issue…
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : issues.length === 0 ? (
                <CommandEmpty>No issues found.</CommandEmpty>
              ) : (
                <CommandGroup heading="Issues">
                  {issues.map((issue) => (
                    <CommandItem
                      key={issue.id}
                      value={issue.identifier}
                      onSelect={() => handleSelect(issue.identifier)}
                      className="flex items-center gap-2"
                    >
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {issue.identifier}
                      </span>
                      <span className="flex-1 truncate text-sm">{issue.title}</span>
                      <Badge variant={stateVariant(issue.stateType)} className="shrink-0 text-[10px]">
                        {issue.state}
                      </Badge>
                      {issue.assigneeName && (
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {issue.assigneeName}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateLinearIssueDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        teamId={teamId}
        projectId={projectId}
        onCreated={handleCreated}
      />
    </>
  );
}
