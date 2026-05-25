import { Command } from 'commander';
import type { ApiClient } from '../api-client.js';

const VALID_STATES = ['todo', 'in_progress', 'in_review', 'done'] as const;
type TicketState = (typeof VALID_STATES)[number];

export function ticketStateCommand(api: ApiClient): Command {
  return new Command('state')
    .description('Transition a ticket to a new state')
    .argument('<identifier>', 'Linear ticket identifier (e.g. ENG-101)')
    .argument('<state>', `Target state: ${VALID_STATES.join(' | ')}`)
    .requiredOption('--team <teamId>', 'Linear team ID (required for state mapping)')
    .option('--project <projectId>', 'Pixler project ID for state-map lookup')
    .option('--text', 'Human-readable confirmation instead of JSON')
    .action(async (identifier: string, state: string, opts: { team: string; project?: string; text?: boolean }) => {
      if (!VALID_STATES.includes(state as TicketState)) {
        process.stderr.write(`[pixler-linear] Invalid state "${state}". Must be one of: ${VALID_STATES.join(', ')}\n`);
        process.exit(1);
      }
      const result = await api.post<{ success: boolean }>(
        `/linear/tickets/${encodeURIComponent(identifier)}/state`,
        { state, teamId: opts.team, projectId: opts.project },
      );
      if (opts.text) {
        console.log(`Transitioned ${identifier} → ${state}`);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    });
}
