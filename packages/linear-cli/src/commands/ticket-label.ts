import { Command } from 'commander';
import type { ApiClient } from '../api-client.js';

export function ticketLabelCommand(api: ApiClient): Command {
  return new Command('label')
    .description('Add a label to a ticket (by name, case-insensitive)')
    .argument('<identifier>', 'Linear ticket identifier (e.g. ENG-101)')
    .argument('<label>', 'Label name to add')
    .option('--text', 'Human-readable confirmation instead of JSON')
    .action(async (identifier: string, label: string, opts: { text?: boolean }) => {
      const result = await api.post<{ labelId: string }>(
        `/linear/tickets/${encodeURIComponent(identifier)}/label`,
        { label },
      );
      if (opts.text) {
        console.log(`Label "${label}" added to ${identifier} (id: ${result.labelId})`);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    });
}
