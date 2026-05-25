import { Command } from 'commander';
import type { ApiClient } from '../api-client.js';

export function subissueCreateCommand(api: ApiClient): Command {
  return new Command('create')
    .description('Create a sub-issue under a parent ticket')
    .argument('<identifier>', 'Parent ticket identifier (e.g. ENG-101)')
    .argument('<title>', 'Sub-issue title')
    .option('--text', 'Human-readable output instead of JSON')
    .action(async (identifier: string, title: string, opts: { text?: boolean }) => {
      const result = await api.post<{ id: string; identifier: string }>(
        `/linear/tickets/${encodeURIComponent(identifier)}/subissues`,
        { title },
      );
      if (opts.text) {
        console.log(`Created sub-issue ${result.identifier} (id: ${result.id})`);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    });
}
