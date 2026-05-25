import { Command } from 'commander';
import type { ApiClient } from '../api-client.js';

interface TicketDto {
  identifier: string;
  title: string;
  state: string;
  stateType: string;
  priority: number;
  description?: string | null;
  assignee?: { name: string } | null;
  labels?: Array<{ name: string }>;
  url: string;
}

export function ticketFetchCommand(api: ApiClient): Command {
  return new Command('fetch')
    .description('Fetch a ticket by identifier')
    .argument('<identifier>', 'Linear ticket identifier (e.g. ENG-101)')
    .option('--text', 'Short human-readable summary instead of JSON')
    .action(async (identifier: string, opts: { text?: boolean }) => {
      const ticket = await api.get<TicketDto>(`/linear/tickets/${encodeURIComponent(identifier)}`);
      if (opts.text) {
        const labels = ticket.labels?.map((l) => l.name).join(', ') ?? '';
        console.log(`${ticket.identifier} [${ticket.state}] ${ticket.title}`);
        if (labels) console.log(`Labels: ${labels}`);
        if (ticket.assignee) console.log(`Assignee: ${ticket.assignee.name}`);
        if (ticket.description) console.log(`\n${ticket.description}`);
      } else {
        console.log(JSON.stringify(ticket, null, 2));
      }
    });
}
