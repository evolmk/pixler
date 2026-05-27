import { Controller, Post } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('db')
export class DatabaseController {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Wipes all user data tables and resets global settings, returning the app to
   * a clean first-run state. The `meta` table (schema_version) is intentionally
   * preserved so migrations do not re-run on next boot.
   *
   * Table order respects FK constraints: children before parents.
   */
  @Post('wipe')
  wipe() {
    const conn = this.db.connection;
    conn.transaction(() => {
      conn.prepare('DELETE FROM workflow_step_attempts').run();
      conn.prepare('DELETE FROM workflow_runs').run();
      conn.prepare('DELETE FROM plans').run();
      conn.prepare('DELETE FROM checkpoints').run();
      conn.prepare('DELETE FROM messages').run();
      conn.prepare('DELETE FROM activities').run();
      conn.prepare('DELETE FROM crashes').run();
      conn.prepare('DELETE FROM usage_snapshots').run();
      conn.prepare('DELETE FROM model_registry').run();
      conn.prepare('DELETE FROM linear_tickets').run();
      conn.prepare('DELETE FROM workspaces').run();
      conn.prepare('DELETE FROM settings_workspace').run();
      conn.prepare('DELETE FROM settings_project').run();
      conn.prepare('DELETE FROM projects').run();
      conn.prepare('DELETE FROM settings_global').run();
    })();
    return { ok: true };
  }
}
