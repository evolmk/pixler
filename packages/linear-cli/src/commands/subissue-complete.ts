import { Command } from 'commander';
import type { ApiClient } from '../api-client.js';

export function subissueCompleteCommand(api: ApiClient): Command {
  return new Command('complete')
    .description('Mark a sub-issue as done (by its Linear UUID)')
    .argument('<id>', 'Sub-issue Linear UUID')
    .option('--text', 'Human-readable confirmation instead of JSON')
    .action(async (id: string, opts: { text?: boolean }) => {
      await api.post(`/linear/subissues/${encodeURIComponent(id)}/complete`);
      if (opts.text) {
        console.log(`Sub-issue ${id} marked complete.`);
      } else {
        console.log(JSON.stringify({ ok: true, id }, null, 2));
      }
    });
}
