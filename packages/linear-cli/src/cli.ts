import { Command } from 'commander';
import { ApiClient } from './api-client.js';
import { ticketFetchCommand } from './commands/ticket-fetch.js';
import { ticketCommentCommand } from './commands/ticket-comment.js';
import { ticketStateCommand } from './commands/ticket-state.js';
import { ticketLabelCommand } from './commands/ticket-label.js';
import { subissueCreateCommand } from './commands/subissue-create.js';
import { subissueCompleteCommand } from './commands/subissue-complete.js';
import { attachmentUploadCommand } from './commands/attachment-upload.js';
import { attachmentDeleteCommand } from './commands/attachment-delete.js';

const api = new ApiClient();

const program = new Command()
  .name('pixler-linear')
  .description('Pixler Linear CLI — agent-facing thin wrapper over the Pixler local API')
  .version('0.0.1');

const ticket = new Command('ticket').description('Ticket operations');
ticket.addCommand(ticketFetchCommand(api));
ticket.addCommand(ticketCommentCommand(api));
ticket.addCommand(ticketStateCommand(api));
ticket.addCommand(ticketLabelCommand(api));

const subissue = new Command('subissue').description('Sub-issue operations');
subissue.addCommand(subissueCreateCommand(api));
subissue.addCommand(subissueCompleteCommand(api));

const attachment = new Command('attachment').description('Attachment operations');
attachment.addCommand(attachmentUploadCommand(api));
attachment.addCommand(attachmentDeleteCommand(api));

program.addCommand(ticket);
program.addCommand(subissue);
program.addCommand(attachment);

program.parseAsync(process.argv).catch((err: unknown) => {
  process.stderr.write(`[pixler-linear] Unexpected error: ${String(err)}\n`);
  process.exit(2);
});
