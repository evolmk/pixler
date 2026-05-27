import { useState } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@pixler/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@pixler/ui/components/popover';
import { Button } from '@pixler/ui/components/button';
import { cn } from '@pixler/ui/lib/utils';
import { useLinearTeams, useLinearProjects } from '../hooks/useLinear';

interface Props {
  selectedTeamKey?: string;
  selectedProjectId?: string;
  onSelect: (teamKey: string, projectId: string) => void;
}

export function LinearProjectPicker({ selectedTeamKey, selectedProjectId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [pendingTeamKey, setPendingTeamKey] = useState(selectedTeamKey ?? '');

  const { data: teams = [], isLoading: teamsLoading } = useLinearTeams();
  const activeTeamId = teams.find((t) => t.key === (pendingTeamKey || selectedTeamKey))?.id;
  const { data: projects = [], isLoading: projectsLoading } = useLinearProjects(activeTeamId);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleTeamSelect = (key: string) => {
    setPendingTeamKey(key);
  };

  const handleProjectSelect = (projectId: string) => {
    const teamKey = pendingTeamKey || selectedTeamKey || '';
    onSelect(teamKey, projectId);
    setOpen(false);
  };

  const triggerLabel = selectedProject
    ? selectedProject.name
    : selectedTeamKey
      ? 'Pick a project…'
      : 'Pick a team & project…';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between gap-2 font-normal">
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown className="size-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search…" />
          <CommandList>
            {teamsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : (pendingTeamKey || selectedTeamKey) ? (
              <>
                {/* Back to team selection */}
                <CommandGroup heading="Team">
                  <CommandItem onSelect={() => setPendingTeamKey('')} className="text-xs text-muted-foreground">
                    ← Change team ({pendingTeamKey || selectedTeamKey})
                  </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Projects">
                  {projectsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : projects.length === 0 ? (
                    <CommandEmpty>No projects in this team.</CommandEmpty>
                  ) : (
                    projects.map((p) => (
                      <CommandItem
                        key={p.id}
                        value={p.name}
                        onSelect={() => handleProjectSelect(p.id)}
                        className="gap-2"
                      >
                        <Check className={cn('size-3.5', p.id === selectedProjectId ? 'opacity-100' : 'opacity-0')} />
                        {p.name}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </>
            ) : (
              <CommandGroup heading="Select team">
                {teams.length === 0 ? (
                  <CommandEmpty>No teams available.</CommandEmpty>
                ) : (
                  teams.map((t) => (
                    <CommandItem
                      key={t.id}
                      value={t.name}
                      onSelect={() => handleTeamSelect(t.key)}
                      className="gap-2"
                    >
                      <Check className={cn('size-3.5', t.key === selectedTeamKey ? 'opacity-100' : 'opacity-0')} />
                      {t.name}
                      <span className="ml-auto text-[10px] text-muted-foreground">{t.key}</span>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
