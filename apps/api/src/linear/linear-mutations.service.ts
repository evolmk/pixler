import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LinearService } from './linear.service';

@Injectable()
export class LinearMutationsService {
  constructor(private readonly linear: LinearService) {}

  private async getIssueByIdentifier(identifier: string) {
    const client = await this.linear.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');

    const result = await client.issues({
      filter: { identifier: { eq: identifier } },
    } as Parameters<typeof client.issues>[0]);

    const issue = result.nodes[0];
    if (!issue) throw new NotFoundException(`Issue ${identifier} not found`);
    return { client, issue };
  }

  async createComment(identifier: string, body: string): Promise<{ id: string }> {
    const { client, issue } = await this.getIssueByIdentifier(identifier);
    const payload = await client.createComment({ issueId: issue.id, body });
    return { id: payload.commentId ?? '' };
  }

  async initiateAttachmentUpload(
    contentType: string,
    filename: string,
    size: number,
  ): Promise<{ uploadUrl: string; assetUrl: string; headers: Array<{ key: string; value: string }> }> {
    const client = await this.linear.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');

    const payload = await client.fileUpload(contentType, filename, size);
    const file = payload.uploadFile;
    if (!file) throw new Error('Linear fileUpload returned no upload details');

    return {
      uploadUrl: file.uploadUrl,
      assetUrl: file.assetUrl,
      headers: file.headers.map((h) => ({ key: h.key, value: h.value })),
    };
  }

  async createAttachment(
    identifier: string,
    assetUrl: string,
    title: string,
  ): Promise<{ attachmentId: string }> {
    const { client, issue } = await this.getIssueByIdentifier(identifier);
    const payload = await client.createAttachment({ issueId: issue.id, url: assetUrl, title });
    return { attachmentId: payload.attachmentId ?? '' };
  }

  async deleteAttachment(attachmentId: string): Promise<void> {
    const client = await this.linear.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');
    await client.deleteAttachment(attachmentId);
  }

  async createSubissue(
    parentIdentifier: string,
    title: string,
  ): Promise<{ id: string; identifier: string }> {
    const { client, issue: parent } = await this.getIssueByIdentifier(parentIdentifier);
    const teamId = parent.teamId;
    if (!teamId) throw new NotFoundException(`Issue ${parentIdentifier} has no team`);

    const payload = await client.createIssue({ teamId, title, parentId: parent.id });
    if (!payload.issueId) throw new Error('Failed to create sub-issue');

    const created = await client.issue(payload.issueId);
    return { id: created.id, identifier: created.identifier };
  }

  async completeSubissue(id: string): Promise<void> {
    const client = await this.linear.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');

    const issue = await client.issue(id);
    const teamId = issue.teamId;
    if (!teamId) return;

    const team = await client.team(teamId);
    const states = await team.states();
    const doneState = states.nodes.find((s) => s.type === 'completed');
    if (!doneState) return;

    await issue.update({ stateId: doneState.id });
  }
}
