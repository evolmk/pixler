import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import type { AuthMethod } from '@pixler/shared-types';

const SERVICE = 'pixler';

type Keytar = {
  getPassword(service: string, account: string): Promise<string | null>;
  setPassword(service: string, account: string, password: string): Promise<void>;
  deletePassword(service: string, account: string): Promise<boolean>;
};

@Injectable()
export class SecretStoreService implements OnModuleInit {
  private readonly logger = new Logger(SecretStoreService.name);
  private keytar: Keytar | null = null;

  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      this.keytar = (await import('keytar')) as Keytar;
    } catch {
      this.logger.warn(
        'keytar unavailable — secrets will be stored in SQLite (plaintext). ' +
          'Install keytar native bindings to enable OS keychain storage.',
      );
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.keytar) {
      try {
        return await this.keytar.getPassword(SERVICE, key);
      } catch {
        // fall through to SQLite
      }
    }
    const row = this.db.connection
      .prepare('SELECT value FROM settings_global WHERE key = ?')
      .get(`secret:${key}`) as { value: string } | undefined;
    return row ? JSON.parse(row.value) : null;
  }

  async set(key: string, value: string): Promise<void> {
    if (this.keytar) {
      try {
        await this.keytar.setPassword(SERVICE, key, value);
        return;
      } catch {
        // fall through to SQLite
      }
    }
    const now = Math.floor(Date.now() / 1000);
    this.db.connection
      .prepare(
        'INSERT OR REPLACE INTO settings_global (key, value, updated_at) VALUES (?, ?, ?)',
      )
      .run(`secret:${key}`, JSON.stringify(value), now);
  }

  async delete(key: string): Promise<void> {
    if (this.keytar) {
      try {
        await this.keytar.deletePassword(SERVICE, key);
      } catch {
        // fall through
      }
    }
    this.db.connection
      .prepare('DELETE FROM settings_global WHERE key = ?')
      .run(`secret:${key}`);
  }

  async getAuthMethod(service: 'linear' | 'github'): Promise<AuthMethod | null> {
    const val = await this.get(`${service}.authMethod`);
    return (val as AuthMethod) ?? null;
  }

  async setAuthMethod(service: 'linear' | 'github', method: AuthMethod | null): Promise<void> {
    if (method === null) {
      await this.delete(`${service}.authMethod`);
    } else {
      await this.set(`${service}.authMethod`, method);
    }
  }

  /** Deactivates the current auth method without deleting stored credentials. */
  async softDisconnect(service: 'linear' | 'github'): Promise<void> {
    await this.setAuthMethod(service, null);
  }
}
