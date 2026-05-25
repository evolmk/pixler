import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import { EventsService } from '../events/events.service';
import type {
  Activity,
  ActivityScope,
  ActivitySeverity,
  ActivityKind,
  ActivitiesPage,
} from '@pixler/shared-types';

type DbActivity = Omit<Activity, 'seen'> & { seen: 0 | 1 };

const PAGE_LIMIT = 50;

@Injectable()
export class ActivityService {
  constructor(
    private readonly db: DatabaseService,
    private readonly events: EventsService,
  ) {}

  record(opts: {
    scope?: ActivityScope;
    scopeId?: string;
    kind: ActivityKind;
    title: string;
    body?: string;
    severity?: ActivitySeverity;
  }): Activity {
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const scope = opts.scope ?? 'global';
    const severity = opts.severity ?? 'info';
    const body = opts.body ?? '';

    this.db.connection
      .prepare(
        `INSERT INTO activities (id, scope, scope_id, kind, title, body, severity, seen, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      )
      .run(id, scope, opts.scopeId ?? null, opts.kind, opts.title, body, severity, now);

    const activity = this.findOne(id);

    this.events.emitAppEvent({
      type: 'activity.appended',
      activityId: id,
      scope,
      scopeId: opts.scopeId ?? null,
      kind: opts.kind,
      severity,
      timestamp: Date.now(),
    });

    if (opts.scopeId) {
      this.events.emitWorkspaceEvent(opts.scopeId, {
        type: 'activity.appended',
        activityId: id,
        workspaceId: opts.scopeId,
        kind: opts.kind,
        severity,
        timestamp: Date.now(),
      });
    }

    return activity;
  }

  list(opts: {
    scope?: ActivityScope;
    scopeId?: string;
    unseenOnly?: boolean;
    limit?: number;
  }): ActivitiesPage {
    const lim = Math.min(opts.limit ?? PAGE_LIMIT, 100);
    const parts: string[] = [];
    const params: unknown[] = [];

    if (opts.scope) { parts.push('scope = ?'); params.push(opts.scope); }
    if (opts.scopeId) { parts.push('scope_id = ?'); params.push(opts.scopeId); }
    if (opts.unseenOnly) { parts.push('seen = 0'); }

    const where = parts.length ? `WHERE ${parts.join(' AND ')}` : '';

    const rows = this.db.connection
      .prepare(`SELECT * FROM activities ${where} ORDER BY created_at DESC LIMIT ?`)
      .all(...params, lim) as DbActivity[];

    const unseenRow = this.db.connection
      .prepare(`SELECT COUNT(*) as n FROM activities ${where} AND seen = 0`.replace('WHERE ', where ? 'WHERE ' : 'WHERE seen = 0 AND ').replace('seen = 0 AND seen = 0', 'seen = 0'))
      .get(...params) as { n: number } | undefined;

    const unseenCount = this.countUnseen(opts.scope, opts.scopeId);

    return {
      activities: rows.map(this.toActivity),
      unseenCount,
    };
  }

  countUnseen(scope?: ActivityScope, scopeId?: string): number {
    const parts: string[] = ['seen = 0'];
    const params: unknown[] = [];
    if (scope) { parts.push('scope = ?'); params.push(scope); }
    if (scopeId) { parts.push('scope_id = ?'); params.push(scopeId); }
    const where = `WHERE ${parts.join(' AND ')}`;
    const row = this.db.connection
      .prepare(`SELECT COUNT(*) as n FROM activities ${where}`)
      .get(...params) as { n: number };
    return row.n;
  }

  markSeen(ids: string[]): void {
    if (ids.length === 0) return;
    const placeholders = ids.map(() => '?').join(',');
    this.db.connection
      .prepare(`UPDATE activities SET seen = 1 WHERE id IN (${placeholders})`)
      .run(...ids);
  }

  markAllSeen(scope?: ActivityScope, scopeId?: string): void {
    const parts: string[] = [];
    const params: unknown[] = [];
    if (scope) { parts.push('scope = ?'); params.push(scope); }
    if (scopeId) { parts.push('scope_id = ?'); params.push(scopeId); }
    const where = parts.length ? `WHERE ${parts.join(' AND ')}` : '';
    this.db.connection.prepare(`UPDATE activities SET seen = 1 ${where}`).run(...params);
  }

  private findOne(id: string): Activity {
    const row = this.db.connection
      .prepare('SELECT * FROM activities WHERE id = ?')
      .get(id) as DbActivity;
    return this.toActivity(row);
  }

  private toActivity(row: DbActivity): Activity {
    return { ...row, seen: row.seen === 1 };
  }
}
