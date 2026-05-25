import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import { sanitizeString } from '../telemetry/sanitize';
import { TelemetryService } from '../telemetry/telemetry.service';

interface CrashRow {
  id: string;
  source: string;
  message: string;
  stack: string;
  context: string;
  reported: number;
  created_at: number;
}

@Injectable()
export class CrashesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly telemetry: TelemetryService,
  ) {}

  record(source: string, message: string, stack: string, context: Record<string, unknown> = {}): string {
    const id = randomUUID();
    const now = Date.now();
    this.db.connection
      .prepare('INSERT INTO crashes (id, source, message, stack, context, reported, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)')
      .run(id, source, sanitizeString(message), sanitizeString(stack), JSON.stringify(context), now);

    this.telemetry.track('crash', { source, errorType: message.split(':')[0] ?? 'unknown' });
    return id;
  }

  list(limit = 20): CrashRow[] {
    return this.db.connection
      .prepare('SELECT * FROM crashes ORDER BY created_at DESC LIMIT ?')
      .all(limit) as CrashRow[];
  }
}
