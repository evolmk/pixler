import { Injectable } from '@nestjs/common';
import { LinearMutationsService } from '../../linear/linear-mutations.service';

export interface AttachmentPair {
  currentId: string;
  previousId?: string;
}

@Injectable()
export class AttachmentStorageService {
  constructor(private readonly linearMutations: LinearMutationsService) {}

  async upload(
    ticketId: string,
    content: string,
    revision: number,
    existingPair?: AttachmentPair,
  ): Promise<AttachmentPair> {
    const filename = `plan-v${revision}.md`;
    const buf = Buffer.from(content, 'utf-8');

    const { uploadUrl, assetUrl, headers } = await this.linearMutations.initiateAttachmentUpload(
      'text/markdown',
      filename,
      buf.byteLength,
    );

    await this.uploadToS3(uploadUrl, buf, headers);

    const { attachmentId: newId } = await this.linearMutations.createAttachment(
      ticketId,
      assetUrl,
      filename,
    );

    const pair: AttachmentPair = { currentId: newId };

    if (existingPair) {
      pair.previousId = existingPair.currentId;
      if (existingPair.previousId) {
        await this.linearMutations.deleteAttachment(existingPair.previousId).catch(() => {});
      }
    }

    return pair;
  }

  private async uploadToS3(
    url: string,
    buf: Buffer,
    headers: Array<{ key: string; value: string }>,
  ): Promise<void> {
    const hdrs: Record<string, string> = {};
    for (const { key, value } of headers) hdrs[key] = value;

    const res = await fetch(url, {
      method: 'PUT',
      headers: hdrs,
      body: buf,
    });
    if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`);
  }
}
