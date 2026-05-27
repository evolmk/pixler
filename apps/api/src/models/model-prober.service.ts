import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DatabaseService } from '../db/database.service';
import type { ModelFamily, ProviderModels, ModelRegistryDto } from '@pixler/shared-types';

const execAsync = promisify(exec);

interface CachedRegistry {
  provider: string;
  registry_json: string;
  probed_at: number;
}

// Each family carries exactly one entry — the latest version for that family.
// versions[0] is the canonical "latest" used by resolution.
const STATIC_FAMILIES: Record<string, ModelFamily[]> = {
  claude: [
    { id: 'opus', label: 'Opus', versions: [{ id: 'claude-opus-4-7', label: '4.7' }] },
    { id: 'sonnet', label: 'Sonnet', versions: [{ id: 'claude-sonnet-4-6', label: '4.6' }] },
    { id: 'haiku', label: 'Haiku', versions: [{ id: 'claude-haiku-4-5-20251001', label: '4.5' }] },
  ],
  gemini: [
    { id: 'pro', label: 'Pro', versions: [{ id: 'gemini-2.0-pro', label: '2.0' }] },
    { id: 'flash', label: 'Flash', versions: [{ id: 'gemini-2.0-flash', label: '2.0' }] },
    { id: 'nano', label: 'Nano', versions: [{ id: 'gemini-2.0-nano', label: '2.0' }] },
  ],
  codex: [
    { id: 'gpt-4o', label: 'GPT-4o', versions: [{ id: 'gpt-4o', label: '4o' }] },
    { id: 'o1', label: 'o1', versions: [{ id: 'o1', label: 'o1' }] },
    { id: 'gpt-4', label: 'GPT-4', versions: [{ id: 'gpt-4-turbo', label: '4-turbo' }] },
  ],
};

const PROVIDER_LABELS: Record<string, string> = {
  claude: 'Claude (Anthropic)',
  gemini: 'Gemini (Google)',
  codex: 'Codex (OpenAI)',
};

@Injectable()
export class ModelProberService {
  private readonly logger = new Logger(ModelProberService.name);

  constructor(private readonly db: DatabaseService) {}

  async getRegistry(): Promise<ModelRegistryDto> {
    const rows = this.db.connection
      .prepare('SELECT provider, registry_json, probed_at FROM model_registry')
      .all() as CachedRegistry[];

    if (rows.length === 0) {
      return this.probeAll();
    }

    return rows.map((r) => JSON.parse(r.registry_json) as ProviderModels);
  }

  async refresh(): Promise<ModelRegistryDto> {
    return this.probeAll();
  }

  private async probeAll(): Promise<ModelRegistryDto> {
    const providers = ['claude', 'gemini', 'codex'];
    const results = await Promise.all(providers.map((p) => this.probeProvider(p)));

    const now = Math.floor(Date.now() / 1000);
    const upsert = this.db.connection.prepare(
      'INSERT OR REPLACE INTO model_registry (provider, registry_json, probed_at) VALUES (?, ?, ?)',
    );

    const tx = this.db.connection.transaction(() => {
      for (const result of results) {
        upsert.run(result.provider, JSON.stringify(result), now);
      }
    });
    tx();

    return results;
  }

  private async probeProvider(provider: string): Promise<ProviderModels> {
    const available = await this.isCLIAvailable(provider);
    const probedAt = new Date().toISOString();
    return {
      provider,
      label: PROVIDER_LABELS[provider] ?? provider,
      available,
      families: available ? (STATIC_FAMILIES[provider] ?? []) : [],
      probedAt,
    };
  }

  private async isCLIAvailable(cli: string): Promise<boolean> {
    try {
      await execAsync(`${cli} --version`, { timeout: 5000 });
      return true;
    } catch {
      try {
        await execAsync(`which ${cli}`, { timeout: 3000 });
        return true;
      } catch {
        return false;
      }
    }
  }
}
