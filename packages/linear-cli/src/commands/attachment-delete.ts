import { Command } from 'commander';
import type { ApiClient } from '../api-client.js';

export function attachmentDeleteCommand(api: ApiClient): Command {
  return new Command('delete')
    .description('Delete an attachment by its Linear UUID')
    .argument('<id>', 'Attachment Linear UUID')
    .option('--text', 'Human-readable confirmation instead of JSON')
    .action(async (id: string, opts: { text?: boolean }) => {
      await api.delete(`/linear/attachments/${encodeURIComponent(id)}`);
      if (opts.text) {
        console.log(`Attachment ${id} deleted.`);
      } else {
        console.log(JSON.stringify({ ok: true, id }, null, 2));
      }
    });
}
