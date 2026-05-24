import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { EventsService } from '../events/events.service';
import { settingsRegistry } from './registry';
import { existsSync, readFileSync, watchFile } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

@Injectable()
export class SettingsService implements OnModuleInit {
  private cache = new Map<string, string>();
  private configFilePath: string;

  constructor(
    private readonly db: DatabaseService,
    private readonly events: EventsService,
  ) {
    const xdgConfig = process.env.XDG_CONFIG_HOME;
    const configDir = xdgConfig
      ? join(xdgConfig, 'pixler')
      : join(homedir(), '.config', 'pixler');
    this.configFilePath = join(configDir, 'config.json');
  }

  onModuleInit() {
    this.loadCache();
    this.syncConfigFile();
    this.watchConfigFile();
  }

  get(
    key: string,
    opts?: { projectId?: string; workspaceId?: string },
  ): unknown {
    if (opts?.workspaceId) {
      const ws = this.getFromScope('workspace', key, opts.workspaceId);
      if (ws !== undefined) return JSON.parse(ws);
    }
    if (opts?.projectId) {
      const proj = this.getFromScope('project', key, opts.projectId);
      if (proj !== undefined) return JSON.parse(proj);
    }
    const global = this.cache.get(`global:${key}`);
    if (global !== undefined) return JSON.parse(global);

    const def = settingsRegistry.find((s) => s.key === key);
    return def?.default;
  }

  set(
    key: string,
    value: unknown,
    opts: { scope: 'global' | 'project' | 'workspace'; id?: string },
  ) {
    const serialized = JSON.stringify(value);
    const now = Math.floor(Date.now() / 1000);

    if (opts.scope === 'global') {
      this.db.connection
        .prepare(
          'INSERT OR REPLACE INTO settings_global (key, value, updated_at) VALUES (?, ?, ?)',
        )
        .run(key, serialized, now);
      this.cache.set(`global:${key}`, serialized);
    } else if (opts.scope === 'project' && opts.id) {
      this.db.connection
        .prepare(
          'INSERT OR REPLACE INTO settings_project (project_id, key, value, updated_at) VALUES (?, ?, ?, ?)',
        )
        .run(opts.id, key, serialized, now);
    } else if (opts.scope === 'workspace' && opts.id) {
      this.db.connection
        .prepare(
          'INSERT OR REPLACE INTO settings_workspace (workspace_id, key, value, updated_at) VALUES (?, ?, ?, ?)',
        )
        .run(opts.id, key, serialized, now);
    }

    this.events.emitAppEvent({
      type: 'settings.changed',
      key,
      scope: opts.scope,
      timestamp: Date.now(),
    });
  }

  getResolved(opts?: {
    projectId?: string;
    workspaceId?: string;
  }): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const def of settingsRegistry) {
      result[def.key] = this.get(def.key, opts);
    }
    return result;
  }

  reset(opts: {
    scope: 'global' | 'project' | 'workspace';
    id?: string;
    kind?: 'all' | 'prompts';
  }) {
    if (opts.scope === 'global') {
      this.db.connection.prepare('DELETE FROM settings_global').run();
      this.cache.clear();
    } else if (opts.scope === 'project' && opts.id) {
      this.db.connection
        .prepare('DELETE FROM settings_project WHERE project_id = ?')
        .run(opts.id);
    } else if (opts.scope === 'workspace' && opts.id) {
      this.db.connection
        .prepare('DELETE FROM settings_workspace WHERE workspace_id = ?')
        .run(opts.id);
    }
    this.loadCache();
  }

  private getFromScope(
    scope: 'global' | 'project' | 'workspace',
    key: string,
    id?: string,
  ): string | undefined {
    if (scope === 'global') {
      return this.cache.get(`global:${key}`);
    }
    const table =
      scope === 'project' ? 'settings_project' : 'settings_workspace';
    const idCol = scope === 'project' ? 'project_id' : 'workspace_id';
    const row = this.db.connection
      .prepare(`SELECT value FROM ${table} WHERE ${idCol} = ? AND key = ?`)
      .get(id, key) as { value: string } | undefined;
    return row?.value;
  }

  private loadCache() {
    this.cache.clear();
    const rows = this.db.connection
      .prepare('SELECT key, value FROM settings_global')
      .all() as { key: string; value: string }[];
    for (const row of rows) {
      this.cache.set(`global:${row.key}`, row.value);
    }
  }

  private syncConfigFile() {
    if (!existsSync(this.configFilePath)) return;
    try {
      const content = JSON.parse(readFileSync(this.configFilePath, 'utf-8'));
      for (const [key, value] of Object.entries(content)) {
        this.set(key, value, { scope: 'global' });
      }
    } catch {}
  }

  private watchConfigFile() {
    if (!existsSync(this.configFilePath)) return;
    watchFile(this.configFilePath, { interval: 1000 }, () => {
      this.syncConfigFile();
    });
  }
}
