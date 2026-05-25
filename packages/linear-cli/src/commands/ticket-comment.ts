import { Command } from 'commander';
import type { ApiClient } from '../api-client.js';

export function ticketCommentCommand(api: ApiClient): Command {
  return new Command('comment')
    .description('Add a comment to a ticket')
    .argument('<identifier>', 'Linear ticket identifier (e.g. ENG-101)')
    .argument('<body>', 'Comment body (Markdown supported)')
    .option('--text', 'Human-readable confirmation instead of JSON')
    .action(async (identifier: string, body: string, opts: { text?: boolean }) => {
      const result = await api.post<{ id: string }>(
        `/linear/tickets/${encodeURIComponent(identifier)}/comment`,
        { body },
      );
      if (opts.text) {
        console.log(`Comment added (id: ${result.id})`);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    });
}
