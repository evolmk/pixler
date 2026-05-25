import { Command } from 'commander';
import { createReadStream, statSync } from 'node:fs';
import { basename } from 'node:path';
import type { ApiClient } from '../api-client.js';

export function attachmentUploadCommand(api: ApiClient): Command {
  return new Command('upload')
    .description('Upload a file as a Linear attachment on a ticket')
    .argument('<identifier>', 'Ticket identifier (e.g. ENG-101)')
    .argument('<file>', 'Path to the file to upload')
    .option('--title <title>', 'Attachment title (defaults to filename)')
    .option('--text', 'Human-readable output instead of JSON')
    .action(async (identifier: string, filePath: string, opts: { title?: string; text?: boolean }) => {
      let stat: ReturnType<typeof statSync>;
      try {
        stat = statSync(filePath);
      } catch {
        process.stderr.write(`[pixler-linear] File not found: ${filePath}\n`);
        process.exit(1);
      }

      const filename = basename(filePath);
      const title = opts.title ?? filename;
      const contentType = guessMimeType(filename);

      const { uploadUrl, assetUrl, headers } = await api.post<{
        uploadUrl: string;
        assetUrl: string;
        headers: Array<{ key: string; value: string }>;
      }>('/linear/upload/init', { contentType, filename, size: stat.size });

      const uploadHeaders: Record<string, string> = { 'Content-Type': contentType };
      for (const h of headers) uploadHeaders[h.key] = h.value;

      const stream = createReadStream(filePath);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(chunk as Buffer);
      const body = Buffer.concat(chunks);

      const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: uploadHeaders, body });
      if (!uploadRes.ok) {
        process.stderr.write(`[pixler-linear] Upload failed: ${uploadRes.status}\n`);
        process.exit(2);
      }

      const result = await api.post<{ attachmentId: string }>(
        `/linear/tickets/${encodeURIComponent(identifier)}/attachment`,
        { assetUrl, title },
      );

      if (opts.text) {
        console.log(`Uploaded "${title}" — attachment id: ${result.attachmentId}`);
      } else {
        console.log(JSON.stringify({ ...result, assetUrl }, null, 2));
      }
    });
}

function guessMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
    pdf: 'application/pdf', md: 'text/markdown', txt: 'text/plain',
    json: 'application/json', zip: 'application/zip',
  };
  return map[ext] ?? 'application/octet-stream';
}
