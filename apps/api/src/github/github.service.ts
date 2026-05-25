import { Injectable, Logger } from '@nestjs/common';
import { GhExecService } from './gh-exec.service';
import { DatabaseService } from '../db/database.service';
import type { GithubAuthStatus, GithubRepoInfo } from '@pixler/shared-types';

interface RepoCacheEntry {
  data: GithubRepoInfo;
  at: number;
}

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly repoCache = new Map<string, RepoCacheEntry>();
  private readonly CACHE_TTL_MS = 60_000;

  constructor(
    private readonly gh: GhExecService,
    private readonly db: DatabaseService,
  ) {}

  async getAuthStatus(): Promise<GithubAuthStatus> {
    try {
      const { stdout } = await this.gh.exec(['auth', 'status', '--hostname', 'github.com']);
      const username = stdout.match(/Logged in to github\.com account (\S+)/)?.[1];
      const scopesLine = stdout.match(/Token scopes: (.+)/)?.[1];
      const scopes = scopesLine ? scopesLine.split(',').map((s) => s.trim().replace(/'/g, '')) : [];
      return { authed: true, username: username ?? undefined, hostname: 'github.com', scopes };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('not logged in') || msg.includes('not yet authenticated')) {
        return { authed: false };
      }
      this.logger.warn(`gh auth status error: ${msg}`);
      return { authed: false, error: msg };
    }
  }

  async getRepoInfo(projectId: string): Promise<GithubRepoInfo> {
    const cached = this.repoCache.get(projectId);
    if (cached && Date.now() - cached.at < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const project = this.db.connection
      .prepare('SELECT path FROM projects WHERE id = ?')
      .get(projectId) as { path: string } | undefined;

    if (!project) throw new Error(`Project ${projectId} not found`);

    const raw = await this.gh.execJson<{
      nameWithOwner: string;
      defaultBranchRef: { name: string };
      url: string;
      isPrivate: boolean;
    }>(['repo', 'view', '--json', 'nameWithOwner,defaultBranchRef,url,isPrivate'], { cwd: project.path });

    const data: GithubRepoInfo = {
      nameWithOwner: raw.nameWithOwner,
      defaultBranchRef: raw.defaultBranchRef?.name ?? 'main',
      url: raw.url,
      isPrivate: raw.isPrivate,
    };

    this.repoCache.set(projectId, { data, at: Date.now() });
    return data;
  }
}
