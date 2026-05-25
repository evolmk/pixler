import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { SettingsService } from '../settings/settings.service';
import { ClaudeLogParserService } from './claude-log-parser.service';
import type {
  UsageWindow,
  UsagePerModel,
  UsagePerWorkspace,
  UsageHistoricalPoint,
} from '@pixler/shared-types';

const FLUSH_INTERVAL_MS = 30_000;
const FOUR_WEEKS_S = 4 * 7 * 24 * 3600;

interface SnapshotRow {
  ts: number;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_write_tokens: number;
  model: string | null;
  workspace_id: string | null;
}

@Injectable()
export class UsageService implements OnModuleInit {
  private readonly logger = new Logger(UsageService.name);
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private lastParsedTs = 0;

  constructor(
    private readonly db: DatabaseService,
    private readonly settings: SettingsService,
    private readonly parser: ClaudeLogParserService,
  ) {}

  onModuleInit() {
    const now = Math.floor(Date.now() / 1000);
    this.lastParsedTs = now - FOUR_WEEKS_S;
    this.flush();
    this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
  }

  flush(): void {
    try {
      const entries = this.parser.parse(this.lastParsedTs);
      if (entries.length === 0) return;

      const insert = this.db.connection.prepare(
        `INSERT OR IGNORE INTO usage_snapshots
           (ts, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, model, workspace_id, session_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      );

      const insertMany = this.db.connection.transaction(() => {
        for (const e of entries) {
          insert.run(
            e.ts, e.inputTokens, e.outputTokens,
            e.cacheReadTokens, e.cacheWriteTokens,
            e.model, e.workspaceId, e.sessionId,
          );
        }
      });
      insertMany();

      this.lastParsedTs = Math.max(...entries.map((e) => e.ts));
    } catch (err) {
      this.logger.warn(`Usage flush error: ${err}`);
    }
  }

  getWindow(hours = 5): UsageWindow {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - hours * 3600;

    const rows = this.db.connection
      .prepare(
        `SELECT ts, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens
         FROM usage_snapshots WHERE ts >= ? ORDER BY ts ASC`,
      )
      .all(windowStart) as SnapshotRow[];

    const inputTokens = rows.reduce((s, r) => s + r.input_tokens, 0);
    const outputTokens = rows.reduce((s, r) => s + r.output_tokens, 0);
    const cacheReadTokens = rows.reduce((s, r) => s + r.cache_read_tokens, 0);
    const cacheWriteTokens = rows.reduce((s, r) => s + r.cache_write_tokens, 0);
    const totalTokens = inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens;

    const capEstimate = this.estimateCap(hours);
    const percent = capEstimate > 0 ? Math.min(100, Math.round((totalTokens / capEstimate) * 100)) : 0;

    return {
      inputTokens,
      outputTokens,
      cacheReadTokens,
      cacheWriteTokens,
      totalTokens,
      capEstimate,
      percent,
      windowHours: hours,
      windowStart,
      windowEnd: now,
    };
  }

  getPerModel(since?: number, until?: number): UsagePerModel[] {
    const now = Math.floor(Date.now() / 1000);
    const s = since ?? now - 5 * 3600;
    const u = until ?? now;

    const rows = this.db.connection
      .prepare(
        `SELECT model,
                SUM(input_tokens) as input_tokens,
                SUM(output_tokens) as output_tokens,
                SUM(cache_read_tokens) as cache_read_tokens,
                SUM(cache_write_tokens) as cache_write_tokens
         FROM usage_snapshots
         WHERE ts >= ? AND ts <= ?
         GROUP BY model
         ORDER BY SUM(output_tokens) DESC`,
      )
      .all(s, u) as Array<{
        model: string | null;
        input_tokens: number;
        output_tokens: number;
        cache_read_tokens: number;
        cache_write_tokens: number;
      }>;

    return rows.map((r) => ({
      model: r.model ?? 'unknown',
      inputTokens: r.input_tokens,
      outputTokens: r.output_tokens,
      cacheReadTokens: r.cache_read_tokens,
      cacheWriteTokens: r.cache_write_tokens,
      totalTokens: r.input_tokens + r.output_tokens + r.cache_read_tokens + r.cache_write_tokens,
    }));
  }

  getPerWorkspace(workspaceId?: string): UsagePerWorkspace[] {
    const now = Math.floor(Date.now() / 1000);
    const since = now - 5 * 3600;

    const query = workspaceId
      ? `SELECT workspace_id,
                SUM(input_tokens) as input_tokens,
                SUM(output_tokens) as output_tokens,
                SUM(cache_read_tokens) as cache_read_tokens,
                SUM(cache_write_tokens) as cache_write_tokens
         FROM usage_snapshots
         WHERE ts >= ? AND workspace_id = ?
         GROUP BY workspace_id`
      : `SELECT workspace_id,
                SUM(input_tokens) as input_tokens,
                SUM(output_tokens) as output_tokens,
                SUM(cache_read_tokens) as cache_read_tokens,
                SUM(cache_write_tokens) as cache_write_tokens
         FROM usage_snapshots
         WHERE ts >= ?
         GROUP BY workspace_id
         ORDER BY SUM(output_tokens) DESC`;

    const rows = workspaceId
      ? (this.db.connection.prepare(query).all(since, workspaceId) as Array<{
          workspace_id: string | null;
          input_tokens: number;
          output_tokens: number;
          cache_read_tokens: number;
          cache_write_tokens: number;
        }>)
      : (this.db.connection.prepare(query).all(since) as Array<{
          workspace_id: string | null;
          input_tokens: number;
          output_tokens: number;
          cache_read_tokens: number;
          cache_write_tokens: number;
        }>);

    return rows.map((r) => ({
      workspaceId: r.workspace_id ?? 'unknown',
      inputTokens: r.input_tokens,
      outputTokens: r.output_tokens,
      cacheReadTokens: r.cache_read_tokens,
      cacheWriteTokens: r.cache_write_tokens,
      totalTokens: r.input_tokens + r.output_tokens + r.cache_read_tokens + r.cache_write_tokens,
    }));
  }

  getHistorical(range: 'daily' | 'weekly' | 'monthly' = 'daily'): UsageHistoricalPoint[] {
    const now = Math.floor(Date.now() / 1000);
    const rangeSeconds = range === 'monthly' ? 30 * 24 * 3600 : range === 'weekly' ? 7 * 24 * 3600 : 24 * 3600;
    const lookback = range === 'monthly' ? 365 * 24 * 3600 : range === 'weekly' ? 12 * 7 * 24 * 3600 : 30 * 24 * 3600;
    const since = now - lookback;

    const rows = this.db.connection
      .prepare(
        `SELECT ts, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens
         FROM usage_snapshots WHERE ts >= ? ORDER BY ts ASC`,
      )
      .all(since) as SnapshotRow[];

    const buckets = new Map<string, UsageHistoricalPoint>();
    for (const row of rows) {
      const bucketTs = Math.floor(row.ts / rangeSeconds) * rangeSeconds;
      const date = new Date(bucketTs * 1000).toISOString().split('T')[0]!;
      const existing = buckets.get(date) ?? {
        date,
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        totalTokens: 0,
      };
      existing.inputTokens += row.input_tokens;
      existing.outputTokens += row.output_tokens;
      existing.cacheReadTokens += row.cache_read_tokens;
      existing.cacheWriteTokens += row.cache_write_tokens;
      existing.totalTokens += row.input_tokens + row.output_tokens + row.cache_read_tokens + row.cache_write_tokens;
      buckets.set(date, existing);
    }

    return Array.from(buckets.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  /** Estimate the 5h cap from last 4 weeks of history, falling back to the manual setting. */
  private estimateCap(hours: number): number {
    const manual = this.settings.get('usage.5hCap') as number;
    if (manual > 0) return manual;

    const now = Math.floor(Date.now() / 1000);
    const fourWeeksAgo = now - FOUR_WEEKS_S;
    const windowS = hours * 3600;

    const rows = this.db.connection
      .prepare(
        `SELECT ts, input_tokens + output_tokens + cache_read_tokens + cache_write_tokens as total
         FROM usage_snapshots WHERE ts >= ? ORDER BY ts ASC`,
      )
      .all(fourWeeksAgo) as Array<{ ts: number; total: number }>;

    if (rows.length < 2) return 100_000;

    let maxWindow = 0;
    let left = 0;
    let windowSum = 0;

    for (let right = 0; right < rows.length; right++) {
      windowSum += rows[right]!.total;
      while (rows[right]!.ts - rows[left]!.ts > windowS) {
        windowSum -= rows[left]!.total;
        left++;
      }
      if (windowSum > maxWindow) maxWindow = windowSum;
    }

    return maxWindow > 0 ? maxWindow : 100_000;
  }
}
