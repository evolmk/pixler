import { useState } from 'react';
import { RefreshCw, Ticket } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useLinearTickets, useForceLinearSync } from '../hooks/useLinearTickets';
import { NewWorkspaceDialog } from './NewWorkspaceDialog';
import type { LinearTicket } from '@pixler/shared-types';

const PRIORITY_LABEL: Record<number, string> = {
  0: 'No priority',
  1: 'Urgent',
  2: 'High',
  3: 'Medium',
  4: 'Low',
};

const PRIORITY_COLOR: Record<number, string> = {
  0: 'text-muted-foreground',
  1: 'text-destructive',
  2: 'text-orange-500',
  3: 'text-yellow-500',
  4: 'text-muted-foreground',
};

interface TicketRowProps {
  ticket: LinearTicket;
  projectId: string;
}

function TicketRow({ ticket, projectId }: TicketRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full flex-col gap-0.5 rounded px-2 py-1.5 text-left transition-colors hover:bg-accent"
      >
        <div className="flex items-center gap-1.5">
          <span className={`shrink-0 text-[10px] font-mono ${PRIORITY_COLOR[ticket.priority] ?? PRIORITY_COLOR[0]}`}>
            {ticket.identifier}
          </span>
          <span className="truncate text-xs">{ticket.title}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>{ticket.state_name}</span>
          {ticket.assignee_name && <span>· {ticket.assignee_name}</span>}
        </div>
      </button>

      <NewWorkspaceDialog
        open={open}
        onOpenChange={setOpen}
        projectId={projectId}
        prefillTicketId={ticket.identifier}
      />
    </>
  );
}

interface LinearTicketListProps {
  projectId: string;
}

export function LinearTicketList({ projectId }: LinearTicketListProps) {
  const { data: tickets = [], isFetching } = useLinearTickets(projectId);
  const sync = useForceLinearSync();

  if (tickets.length === 0 && !isFetching) return null;

  return (
    <div className="border-t border-border">
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          <Ticket className="size-3" />
          Tickets
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => sync.mutate(projectId)}
          disabled={sync.isPending || isFetching}
          aria-label="Sync Linear tickets"
        >
          <RefreshCw className={`size-3 ${isFetching || sync.isPending ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="px-1 pb-2">
        {tickets.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} projectId={projectId} />
        ))}
      </div>
    </div>
  );
}
