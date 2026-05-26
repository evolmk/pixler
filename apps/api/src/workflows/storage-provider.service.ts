import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { isAbsolute, join, resolve } from 'path';
import { homedir } from 'os';

export const DEFAULT_PLAN_FOLDER = '_plans';

/**
 * Plans are stored in a local folder. By default that's `_plans` in the repo root,
 * but the folder is configurable per project via the `plans.fileDir` setting.
 * A relative folder resolves against the repo root; an absolute (or `~`) folder is used as-is.
 */
@Injectable()
export class StorageProviderService {
  private readonly logger = new Logger(StorageProviderService.name);

  resolveFolder(repoRoot: string, folder: string = DEFAULT_PLAN_FOLDER): string {
    if (folder.startsWith('~')) return resolve(homedir(), folder.slice(2));
    if (isAbsolute(folder)) return folder;
    return resolve(repoRoot, folder);
  }

  writePlan(repoRoot: string, filename: string, content: string, folder: string = DEFAULT_PLAN_FOLDER): string {
    const dir = this.resolveFolder(repoRoot, folder);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const filePath = join(dir, filename);
    writeFileSync(filePath, content, 'utf-8');
    this.logger.log(`Plan written to ${filePath}`);
    return filePath;
  }

  getStorageInfo(
    repoRoot?: string,
    folder: string = DEFAULT_PLAN_FOLDER,
  ): { type: 'local'; folder: string; path: string } {
    return {
      type: 'local',
      folder,
      path: repoRoot ? this.resolveFolder(repoRoot, folder) : folder,
    };
  }
}
