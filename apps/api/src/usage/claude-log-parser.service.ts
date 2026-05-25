import { Injectable, Logger } from '@nestjs/common';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { SettingsService } from '../settings/settings.service';

export interface ParsedUsageEntry {
  ts: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  model: string | null;
  sessionId: string | null;
  workspaceId: string | null;
}

interface TranscriptMessage {
  type?: string;
  timestamp?: string;
  session_id?: string;
  message?: {
    model?: string;
    usage?: {
      input_tokens?: number;
      output_tokens?: number;
      cache_read_input_tokens?: number;
      cache_creation_input_tokens?: number;
    };
  };
}

@Injectable()
export class ClaudeLogParserService {
  private readonly logger = new Logger(ClaudeLogParserService.name);

  constructor(private readonly settings: SettingsService) {}

  getProjectsPath(): string {
    const override = this.settings.get('providers.claudeProjectsPath') as string;
    if (override) return override;
    return join(homedir(), '.claude', 'projects');
  }

  /** Parse all transcripts newer than `since` (unix seconds). */
  parse(since: number): ParsedUsageEntry[] {
    const projectsPath = this.getProjectsPath();
    if (!existsSync(projectsPath)) return [];

    const entries: ParsedUsageEntry[] = [];

    try {
      const projectDirs = readdirSync(projectsPath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => join(projectsPath, d.name));

      for (const dir of projectDirs) {
        try {
          const files = readdirSync(dir)
            .filter((f) => f.endsWith('.jsonl'))
            .map((f) => join(dir, f));

          for (const file of files) {
            try {
              const stat = statSync(file);
              if (stat.mtimeMs / 1000 < since) continue;

              const lines = readFileSync(file, 'utf-8').split('\n');
              for (const line of lines) {
                if (!line.trim()) continue;
                try {
                  const msg = JSON.parse(line) as TranscriptMessage;
                  const entry = this.extractEntry(msg, since);
                  if (entry) entries.push(entry);
                } catch {
                  // skip malformed line
                }
              }
            } catch {
              // skip unreadable file
            }
          }
        } catch {
          // skip unreadable dir
        }
      }
    } catch (err) {
      this.logger.warn(`Failed to read claude projects dir: ${err}`);
    }

    return entries;
  }

  private extractEntry(msg: TranscriptMessage, since: number): ParsedUsageEntry | null {
    if (msg.type !== 'assistant') return null;
    const usage = msg.message?.usage;
    if (!usage) return null;

    const ts = msg.timestamp ? Math.floor(new Date(msg.timestamp).getTime() / 1000) : 0;
    if (ts < since) return null;

    return {
      ts,
      inputTokens: usage.input_tokens ?? 0,
      outputTokens: usage.output_tokens ?? 0,
      cacheReadTokens: usage.cache_read_input_tokens ?? 0,
      cacheWriteTokens: usage.cache_creation_input_tokens ?? 0,
      model: msg.message?.model ?? null,
      sessionId: msg.session_id ?? null,
      workspaceId: null,
    };
  }
}
