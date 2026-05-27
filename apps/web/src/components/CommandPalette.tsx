import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { File, FolderOpen, Tag } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@pixler/ui/components/command';
import { usePalette } from '../hooks/usePalette';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useLinearTickets } from '../hooks/useLinearTickets';
import { useWorkspaceFiles } from '../hooks/useWorkspaceFiles';
import { getAction, type PaletteAction, type PaletteGroup } from '../lib/palette/registry';
import { useLayoutStore } from '../stores/layout';
import { useCurrentProject } from '../hooks/useCurrentProject';

const GROUP_LABELS: Record<PaletteGroup, string> = {
  recent: 'Recent',
  actions: 'Actions',
  settings: 'Settings',
  workspaces: 'Workspaces',
  tickets: 'Tickets',
  files: 'Files',
};

const GROUP_ORDER: PaletteGroup[] = [
  'recent',
  'actions',
  'settings',
  'workspaces',
  'tickets',
  'files',
];

export function CommandPalette() {
  const { open, setOpen, recent, runAction, getActions } = usePalette();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { projectId } = useCurrentProject();
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string };
  const setNewWorkspaceOpen = useLayoutStore((s) => s.setNewWorkspaceOpen);

  const { data: workspaces = [] } = useWorkspaces(projectId);
  const { data: tickets = [] } = useLinearTickets(projectId);
  const { data: files = [] } = useWorkspaceFiles(workspaceId);

  useHotkeys('meta+k, ctrl+k', () => setOpen(!open), { preventDefault: true });

  // Reset query on close
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const showArchived = query.includes(':archived');
  const cleanQuery = query.replace(':archived', '').trim();

  const allActions = getActions();

  const recentActions = recent
    .map((id) => getAction(id))
    .filter((a): a is PaletteAction => !!a);

  const grouped = GROUP_ORDER.reduce<Record<PaletteGroup, PaletteAction[]>>(
    (acc, group) => {
      if (group === 'recent') {
        acc.recent = recentActions;
      } else {
        acc[group] = allActions.filter((a) => a.group === group);
      }
      return acc;
    },
    { recent: [], actions: [], settings: [], workspaces: [], tickets: [], files: [] },
  );

  const visibleWorkspaces = showArchived
    ? workspaces
    : workspaces.filter((w) => w.state !== 'archived');

  const handleSelectWorkspace = (id: string) => {
    setOpen(false);
    void navigate({ to: '/w/$workspaceId', params: { workspaceId: id } });
  };

  const handleSelectFile = (filePath: string) => {
    setOpen(false);
    console.log('[palette] open file:', filePath);
  };

  const handleSelectTicket = (_identifier: string) => {
    setOpen(false);
    if (projectId) void navigate({ to: '/' });
  };

  // Build static action sections
  const visibleStaticGroups = (['recent', 'actions', 'settings'] as PaletteGroup[]).filter(
    (g) => grouped[g].length > 0,
  );

  const hasDynamic =
    visibleWorkspaces.length > 0 || tickets.length > 0 || files.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command Palette">
      <CommandInput
        placeholder="Type a command or search… (:archived for archived workspaces)"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Static action groups */}
        {visibleStaticGroups.map((group, idx) => (
          <>
            <CommandGroup key={group} heading={GROUP_LABELS[group]}>
              {grouped[group].map((action) => {
                const Icon = action.icon;
                return (
                  <CommandItem
                    key={action.id}
                    value={`${action.title} ${action.keywords?.join(' ') ?? ''}`}
                    onSelect={() => runAction(action.id)}
                  >
                    {Icon && <Icon className="size-4" />}
                    {action.title}
                    {action.shortcut && (
                      <CommandShortcut>{action.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {(idx < visibleStaticGroups.length - 1 || hasDynamic) && (
              <CommandSeparator key={`sep-${group}`} />
            )}
          </>
        ))}

        {/* Workspaces section */}
        {visibleWorkspaces.length > 0 && (
          <>
            <CommandGroup heading="Workspaces">
              {visibleWorkspaces.map((ws) => (
                <CommandItem
                  key={ws.id}
                  value={`${ws.name} ${ws.branch ?? ''} workspace`}
                  onSelect={() => handleSelectWorkspace(ws.id)}
                >
                  <FolderOpen className="size-4" />
                  {ws.name}
                  {ws.state === 'archived' && (
                    <span className="ml-auto text-xs text-muted-foreground">archived</span>
                  )}
                </CommandItem>
              ))}
              {projectId && (
                <CommandItem
                  value="new workspace create"
                  onSelect={() => { setOpen(false); setNewWorkspaceOpen(true); }}
                >
                  <span className="size-4 flex items-center justify-center text-muted-foreground">+</span>
                  New Workspace…
                </CommandItem>
              )}
            </CommandGroup>
            {(tickets.length > 0 || files.length > 0) && <CommandSeparator />}
          </>
        )}

        {/* Tickets section */}
        {tickets.length > 0 && (
          <>
            <CommandGroup heading="Tickets">
              {tickets.map((ticket) => (
                <CommandItem
                  key={ticket.id}
                  value={`${ticket.identifier} ${ticket.title} ticket`}
                  onSelect={() => handleSelectTicket(ticket.identifier)}
                >
                  <Tag className="size-4" />
                  <span className="text-xs text-muted-foreground">{ticket.identifier}</span>
                  {ticket.title}
                </CommandItem>
              ))}
            </CommandGroup>
            {files.length > 0 && <CommandSeparator />}
          </>
        )}

        {/* Files section */}
        {files.length > 0 && (
          <CommandGroup heading="Files">
            {files.map((filePath) => (
              <CommandItem
                key={filePath}
                value={`${filePath} file`}
                onSelect={() => handleSelectFile(filePath)}
              >
                <File className="size-4" />
                {filePath}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
