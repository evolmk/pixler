import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { PixlerJson, PixlerJsonDiff } from '@pixler/shared-types';

const WORKFLOW_KEYS: (keyof PixlerJson)[] = [
  'scripts',
  'filesToCopy',
  'plansDir',
  'git',
  'linear',
  'models',
  'autoApprove',
];

const DEFAULTS: Partial<PixlerJson> = {
  version: 1,
  plansDir: 'docs/plans',
  git: { branchTemplate: '{ticket}/{description}' },
  autoApprove: { plan: false, validation: false, pr: false },
};

@Injectable()
export class PixlerJsonService {
  load(projectPath: string): PixlerJson | null {
    const filePath = join(projectPath, 'pixler.json');
    if (!existsSync(filePath)) return null;
    try {
      const raw = readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as PixlerJson;
    } catch {
      return null;
    }
  }

  save(projectPath: string, patch: Partial<PixlerJson>): void {
    const filePath = join(projectPath, 'pixler.json');
    const current = this.load(projectPath) ?? { version: 1 as const };
    const updated: PixlerJson = { ...current, ...patch, version: 1 };
    writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n', 'utf-8');
  }

  diff(teamConfig: PixlerJson, localConfig: Partial<PixlerJson>): PixlerJsonDiff {
    const result: PixlerJsonDiff = [];
    for (const key of WORKFLOW_KEYS) {
      const teamVal = teamConfig[key];
      const localVal = localConfig[key] ?? DEFAULTS[key];
      if (JSON.stringify(teamVal) !== JSON.stringify(localVal)) {
        result.push({ key, teamValue: teamVal, localValue: localVal });
      }
    }
    return result;
  }

  getDefaults(): Partial<PixlerJson> {
    return { ...DEFAULTS };
  }

  ensurePixlerDir(projectPath: string): void {
    const pixlerDir = join(projectPath, '.pixler');
    if (!existsSync(pixlerDir)) {
      mkdirSync(pixlerDir, { recursive: true });
    }
  }
}
