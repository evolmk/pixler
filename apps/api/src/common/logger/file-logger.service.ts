import { Injectable, OnModuleInit } from '@nestjs/common';
import { existsSync, mkdirSync, appendFileSync, readdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { SettingsService } from '../../settings/settings.service';

const LOGS_DIR = join(homedir(), '.config', 'pixler', 'logs');

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class FileLoggerService implements OnModuleInit {
  constructor(private readonly settings: SettingsService) {}

  onModuleInit() {
    if (!existsSync(LOGS_DIR)) {
      mkdirSync(LOGS_DIR, { recursive: true });
    }
    const retentionDays = (this.settings.get('logs.retentionDays') as number | undefined) ?? 7;
    this.pruneOldLogs(retentionDays);
  }

  logApiError(status: number, method: string, path: string, message: string, stack?: string) {
    this.appendLine(`api-${today()}.log`, {
      ts: new Date().toISOString(),
      type: 'api',
      status,
      method,
      path,
      message,
      ...(stack ? { stack } : {}),
    });
  }

  logFrontendError(message: string, stack: string, context: Record<string, unknown>) {
    this.appendLine(`frontend-${today()}.log`, {
      ts: new Date().toISOString(),
      type: 'frontend',
      message,
      stack,
      context,
    });
  }

  pruneOldLogs(retentionDays: number) {
    if (retentionDays === 0) return;
    const cutoff = Date.now() - retentionDays * 86_400_000;
    try {
      for (const file of readdirSync(LOGS_DIR)) {
        const filePath = join(LOGS_DIR, file);
        const stat = statSync(filePath);
        if (stat.mtimeMs < cutoff) {
          unlinkSync(filePath);
        }
      }
    } catch {
      // non-fatal — log dir may not exist yet
    }
  }

  private appendLine(filename: string, data: object) {
    try {
      appendFileSync(join(LOGS_DIR, filename), JSON.stringify(data) + '\n');
    } catch {
      // non-fatal — never crash the API over a log write
    }
  }
}
