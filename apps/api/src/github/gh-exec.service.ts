import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { SettingsService } from '../settings/settings.service';

const execFileAsync = promisify(execFile);

export interface GhExecResult {
  stdout: string;
  stderr: string;
}

@Injectable()
export class GhExecService {
  constructor(private readonly settings: SettingsService) {}

  private get ghPath(): string {
    return (this.settings.get('providers.gh') as string) ?? 'gh';
  }

  async exec(args: string[], opts: { cwd?: string; timeout?: number } = {}): Promise<GhExecResult> {
    const { cwd, timeout = 15_000 } = opts;
    const { stdout, stderr } = await execFileAsync(this.ghPath, args, {
      cwd,
      timeout,
      env: { ...process.env },
    });
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  }

  async execJson<T>(args: string[], opts: { cwd?: string; timeout?: number } = {}): Promise<T> {
    const { stdout } = await this.exec(args, opts);
    return JSON.parse(stdout) as T;
  }
}
