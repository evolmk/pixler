import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { SettingsService } from '../settings/settings.service';
import { EventsService } from '../events/events.service';
import { LinearService } from './linear.service';
import type { LinearTicket } from '@pixler/shared-types';

@Injectable()
export class SyncScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SyncScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly db: DatabaseService,
    private readonly settings: SettingsService,
    private readonly linear: LinearService,
    private readonly events: EventsService,
  ) {}

  onModuleInit() {
    const interval = (this.settings.get('linear.syncIntervalMs') as number) ?? 60_000;
    this.timer = setInterval(() => void this.syncAll(), interval);
    // initial sync after a short delay to let the app finish booting
    setTimeout(() => void this.syncAll(), 5_000);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async syncAll(projectId?: string): Promise<void> {
    const client = await this.linear.getClient();
    if (!client) return;

    const projects = this.projectsToSync(projectId);
    if (projects.length === 0) return;

    for (const project of projects) {
      try {
        await this.syncProject(client, project);
      } catch (err) {
        this.logger.error(`Linear sync failed for project ${project.id}: ${err}`);
      }
    }
  }

  private projectsToSync(projectId?: string): { id: string; teamKey: string }[] {
    const rows = (
      projectId
        ? this.db.connection.prepare('SELECT id FROM projects WHERE id = ?').all(projectId)
        : this.db.connection.prepare('SELECT id FROM projects').all()
    ) as { id: string }[];

    const result: { id: string; teamKey: string }[] = [];
    for (const row of rows) {
      const teamKey = this.settings.get('linear.team', { projectId: row.id }) as string | undefined;
      if (teamKey) result.push({ id: row.id, teamKey });
    }
    return result;
  }

  private async syncProject(
    client: Awaited<ReturnType<typeof this.linear.getClient>>,
    project: { id: string; teamKey: string },
  ): Promise<void> {
    if (!client) return;

    const issues = await client.issues({
      filter: {
        assignee: { isMe: { eq: true } },
        state: { type: { in: ['unstarted', 'started'] } },
        team: { key: { eq: project.teamKey } },
      },
    } as Parameters<typeof client.issues>[0]);

    const now = Math.floor(Date.now() / 1000);
    const upsert = this.db.connection.prepare(`
      INSERT INTO linear_tickets
        (id, project_id, identifier, title, description, state_name, state_type,
         priority, assignee_name, label_name, url, created_at_linear, updated_at_linear, synced_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        state_name = excluded.state_name,
        state_type = excluded.state_type,
        priority = excluded.priority,
        assignee_name = excluded.assignee_name,
        label_name = excluded.label_name,
        url = excluded.url,
        updated_at_linear = excluded.updated_at_linear,
        synced_at = excluded.synced_at
    `);

    for (const issue of issues.nodes) {
      const state = await issue.state;
      const assignee = await issue.assignee;

      upsert.run(
        issue.id,
        project.id,
        issue.identifier,
        issue.title,
        issue.description ?? null,
        state?.name ?? '',
        state?.type ?? 'unstarted',
        issue.priority,
        assignee?.name ?? null,
        null, // label_name — skipping to avoid N+1 label fetches
        issue.url,
        Math.floor(issue.createdAt.getTime() / 1000),
        Math.floor(issue.updatedAt.getTime() / 1000),
        now,
      );
    }

    this.events.emitAppEvent({
      type: 'linear.synced',
      projectId: project.id,
      count: issues.nodes.length,
      timestamp: Date.now(),
    });

    this.logger.log(`Synced ${issues.nodes.length} Linear tickets for project ${project.id}`);
  }

  tickets(projectId: string): LinearTicket[] {
    return this.db.connection
      .prepare('SELECT * FROM linear_tickets WHERE project_id = ? ORDER BY priority ASC, updated_at_linear DESC')
      .all(projectId) as LinearTicket[];
  }
}
