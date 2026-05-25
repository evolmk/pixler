import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import type { Message, MessageRole, MessageContentType, MessagesPage } from '@pixler/shared-types';

type DbMessage = Omit<Message, 'is_streaming'> & { is_streaming: 0 | 1 };

const PAGE_LIMIT = 50;

@Injectable()
export class MessagesService {
  constructor(private readonly db: DatabaseService) {}

  list(workspaceId: string, cursor?: string, limit = PAGE_LIMIT): MessagesPage {
    const lim = Math.min(limit, 100);
    let rows: DbMessage[];

    if (cursor) {
      const anchor = this.db.connection
        .prepare('SELECT created_at FROM messages WHERE id = ?')
        .get(cursor) as { created_at: number } | undefined;
      if (anchor) {
        rows = this.db.connection
          .prepare(
            `SELECT * FROM messages
             WHERE workspace_id = ? AND created_at < ?
             ORDER BY created_at DESC LIMIT ?`,
          )
          .all(workspaceId, anchor.created_at, lim) as DbMessage[];
      } else {
        rows = [];
      }
    } else {
      rows = this.db.connection
        .prepare(
          `SELECT * FROM messages
           WHERE workspace_id = ?
           ORDER BY created_at DESC LIMIT ?`,
        )
        .all(workspaceId, lim) as DbMessage[];
    }

    const messages = rows.reverse().map(this.toMessage);
    const nextCursor = rows.length === lim ? rows[0]!.id : null;
    return { messages, cursor: nextCursor };
  }

  append(workspaceId: string, role: MessageRole, content: string, contentType: MessageContentType = 'text', streaming = false): Message {
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    this.db.connection
      .prepare(
        `INSERT INTO messages (id, workspace_id, role, content, content_type, is_streaming, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(id, workspaceId, role, content, contentType, streaming ? 1 : 0, now, now);
    return this.findOne(id);
  }

  patch(id: string, content: string, streaming = false): Message {
    const now = Math.floor(Date.now() / 1000);
    this.db.connection
      .prepare('UPDATE messages SET content = ?, is_streaming = ?, updated_at = ? WHERE id = ?')
      .run(content, streaming ? 1 : 0, now, id);
    return this.findOne(id);
  }

  deleteByWorkspace(workspaceId: string): void {
    this.db.connection.prepare('DELETE FROM messages WHERE workspace_id = ?').run(workspaceId);
  }

  private findOne(id: string): Message {
    const row = this.db.connection
      .prepare('SELECT * FROM messages WHERE id = ?')
      .get(id) as DbMessage;
    return this.toMessage(row);
  }

  private toMessage(row: DbMessage): Message {
    return { ...row, is_streaming: row.is_streaming === 1 };
  }
}
