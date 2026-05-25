import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';
import { load } from 'js-yaml';

interface StorageProviderConfig {
  id: string;
  type: 'local' | 'google_drive' | 's3';
  active: boolean;
  path?: string;
  folder_id?: string;
  bucket?: string;
  prefix?: string;
  region?: string;
}

interface StorageConfig {
  providers: StorageProviderConfig[];
}

@Injectable()
export class StorageProviderService {
  private readonly logger = new Logger(StorageProviderService.name);

  private get config(): StorageConfig | null {
    const configPath = join(homedir(), '.config', 'pixler', 'storage.yaml');
    if (!existsSync(configPath)) return null;
    try {
      return load(readFileSync(configPath, 'utf-8')) as StorageConfig;
    } catch {
      return null;
    }
  }

  private get activeProvider(): StorageProviderConfig | null {
    return this.config?.providers.find((p) => p.active) ?? null;
  }

  getActivePath(): string {
    const provider = this.activeProvider;
    if (provider?.type === 'local' && provider.path) {
      return provider.path.startsWith('~')
        ? resolve(homedir(), provider.path.slice(2))
        : provider.path;
    }
    // Default to ~/.config/pixler/plans
    return join(homedir(), '.config', 'pixler', 'plans');
  }

  getActiveType(): string {
    return this.activeProvider?.type ?? 'local';
  }

  writePlan(filename: string, content: string): string {
    const basePath = this.getActivePath();
    const type = this.getActiveType();

    if (type === 'local') {
      if (!existsSync(basePath)) mkdirSync(basePath, { recursive: true });
      const filePath = join(basePath, filename);
      writeFileSync(filePath, content, 'utf-8');
      this.logger.log(`Plan written to ${filePath}`);
      return filePath;
    }

    // Stub for future providers
    this.logger.warn(`Storage provider '${type}' not yet implemented — falling back to local`);
    if (!existsSync(basePath)) mkdirSync(basePath, { recursive: true });
    const filePath = join(basePath, filename);
    writeFileSync(filePath, content, 'utf-8');
    return filePath;
  }

  getStorageInfo(): { type: string; path: string; configured: boolean } {
    return {
      type: this.getActiveType(),
      path: this.getActivePath(),
      configured: !!this.activeProvider,
    };
  }
}
