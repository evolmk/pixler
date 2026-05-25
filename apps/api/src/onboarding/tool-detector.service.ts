import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { SettingsService } from '../settings/settings.service';

const execFileAsync = promisify(execFile);

export interface ToolStatus {
  available: boolean;
  version: string | null;
  authenticated: boolean | null;
}

export interface DetectedTools {
  git: ToolStatus;
  claude: ToolStatus;
  codex: ToolStatus;
  gemini: ToolStatus;
  gh: ToolStatus;
}

async function probe(
  bin: string,
  versionArgs: string[],
  parseVersion?: (out: string) => string,
): Promise<{ available: boolean; version: string | null }> {
  try {
    const { stdout } = await execFileAsync(bin, versionArgs, { timeout: 5_000 });
    const raw = stdout.trim().split('\n')[0];
    return { available: true, version: parseVersion ? parseVersion(raw) : raw };
  } catch {
    return { available: false, version: null };
  }
}

@Injectable()
export class ToolDetectorService {
  constructor(private readonly settings: SettingsService) {}

  async detect(): Promise<DetectedTools> {
    const claudePath = (this.settings.get('providers.claude') as string) || 'claude';
    const codexPath = (this.settings.get('providers.codex') as string) || 'codex';
    const geminiPath = (this.settings.get('providers.gemini') as string) || 'gemini';
    const ghPath = (this.settings.get('providers.gh') as string) || 'gh';

    const [git, claude, codex, gemini, gh, ghAuth] = await Promise.all([
      probe('git', ['--version'], (s) => s.replace('git version ', '')),
      probe(claudePath, ['--version']),
      probe(codexPath, ['--version']),
      probe(geminiPath, ['--version']),
      probe(ghPath, ['--version'], (s) => s.split(' ')[2] ?? s),
      this.probeGhAuth(ghPath),
    ]);

    return {
      git: { ...git, authenticated: null },
      claude: { ...claude, authenticated: null },
      codex: { ...codex, authenticated: null },
      gemini: { ...gemini, authenticated: null },
      gh: { ...gh, authenticated: ghAuth },
    };
  }

  private async probeGhAuth(ghPath: string): Promise<boolean | null> {
    try {
      await execFileAsync(ghPath, ['auth', 'status'], { timeout: 5_000 });
      return true;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err) return false;
      return null;
    }
  }
}
