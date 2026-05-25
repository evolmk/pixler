import { Injectable } from '@nestjs/common';
import { LinearMutationsService } from '../../linear/linear-mutations.service';
import { LinearService } from '../../linear/linear.service';

const START_MARKER = (rev: number) => `<!-- pixler-plan:start revision=${rev} -->`;
const END_MARKER = '<!-- pixler-plan:end -->';
const MARKER_REGEX = /<!-- pixler-plan:start revision=\d+ -->[\s\S]*?<!-- pixler-plan:end -->/;

@Injectable()
export class InlineStorageService {
  constructor(
    private readonly linearMutations: LinearMutationsService,
    private readonly linear: LinearService,
  ) {}

  async read(ticketId: string): Promise<string | null> {
    const client = await this.linear.getClient();
    if (!client) return null;

    const result = await client.issues({ filter: { identifier: { eq: ticketId } } } as Parameters<typeof client.issues>[0]);
    const issue = result.nodes[0];
    if (!issue) return null;

    const desc = issue.description ?? '';
    const match = desc.match(MARKER_REGEX);
    if (!match) return null;

    const block = match[0];
    const inner = block
      .replace(/<!-- pixler-plan:start revision=\d+ -->/, '')
      .replace(END_MARKER, '')
      .trim();
    return inner;
  }

  async write(ticketId: string, content: string, revision: number): Promise<void> {
    const client = await this.linear.getClient();
    if (!client) throw new Error('Linear not connected');

    const result = await client.issues({ filter: { identifier: { eq: ticketId } } } as Parameters<typeof client.issues>[0]);
    const issue = result.nodes[0];
    if (!issue) throw new Error(`Issue ${ticketId} not found`);

    const block = `\n\n---\n${START_MARKER(revision)}\n\n${content}\n\n${END_MARKER}`;
    const existing = issue.description ?? '';
    const newDesc = MARKER_REGEX.test(existing)
      ? existing.replace(MARKER_REGEX, block.trim())
      : existing + block;

    await issue.update({ description: newDesc });
  }
}
