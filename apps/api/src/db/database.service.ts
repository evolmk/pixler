import { Injectable, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db!: Database.Database;

  get connection(): Database.Database {
    return this.db;
  }

  onModuleInit() {
    const configDir = this.getConfigDir();
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    const dbPath = join(configDir, 'pixler.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.runMigrations();
  }

  private getConfigDir(): string {
    const xdgConfig = process.env.XDG_CONFIG_HOME;
    if (xdgConfig) return join(xdgConfig, 'pixler');
    return join(homedir(), '.config', 'pixler');
  }

  private runMigrations() {
    const currentVersion = this.getSchemaVersion();
    const migrationsDir = join(__dirname, 'migrations');

    if (currentVersion < 1) {
      const sql = readFileSync(join(migrationsDir, '0001_init.sql'), 'utf-8');
      this.db.exec(sql);
    }
    if (currentVersion < 2) {
      const sql = readFileSync(join(migrationsDir, '0002_projects.sql'), 'utf-8');
      this.db.exec(sql);
    }
    if (currentVersion < 3) {
      const sql = readFileSync(join(migrationsDir, '0003_workspaces.sql'), 'utf-8');
      this.db.exec(sql);
    }
    if (currentVersion < 4) {
      const sql = readFileSync(join(migrationsDir, '0004_linear.sql'), 'utf-8');
      this.db.exec(sql);
    }
    if (currentVersion < 5) {
      const sql = readFileSync(join(migrationsDir, '0005_usage.sql'), 'utf-8');
      this.db.exec(sql);
    }
  }

  private getSchemaVersion(): number {
    try {
      const row = this.db
        .prepare("SELECT value FROM meta WHERE key = 'schema_version'")
        .get() as { value: string } | undefined;
      return row ? parseInt(row.value, 10) : 0;
    } catch {
      return 0;
    }
  }
}
