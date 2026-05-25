import { Injectable, NotFoundException } from '@nestjs/common';
import { simpleGit } from 'simple-git';
import { readFileSync, existsSync } from 'node:fs';
import { extname } from 'node:path';
import { DatabaseService } from '../db/database.service';
import type { DiffFileSummary, DiffFileDetail, DiffHunk, DiffStatus } from '@pixler/shared-types';

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg',
  '.pdf', '.zip', '.tar', '.gz', '.wasm', '.ttf', '.otf', '.woff', '.woff2',
]);

const EXT_LANG: Record<string, string> = {
  '.ts': 'typescript', '.tsx': 'typescript', '.js': 'javascript', '.jsx': 'javascript',
  '.json': 'json', '.md': 'markdown', '.css': 'css', '.html': 'html',
  '.py': 'python', '.go': 'go', '.rs': 'rust', '.sh': 'shell',
  '.yaml': 'yaml', '.yml': 'yaml', '.toml': 'toml', '.sql': 'sql',
};

@Injectable()
export class DiffService {
  constructor(private readonly db: DatabaseService) {}

  private getWorkspaceCwd(workspaceId: string): string {
    const ws = this.db.connection
      .prepare('SELECT worktree_path, project_id FROM workspaces WHERE id = ?')
      .get(workspaceId) as { worktree_path: string | null; project_id: string } | undefined;
    if (!ws) throw new NotFoundException(`Workspace ${workspaceId} not found`);

    if (ws.worktree_path) return ws.worktree_path;

    const proj = this.db.connection
      .prepare('SELECT path FROM projects WHERE id = ?')
      .get(ws.project_id) as { path: string } | undefined;
    if (!proj) throw new NotFoundException(`Project for workspace ${workspaceId} not found`);
    return proj.path;
  }

  async listChangedFiles(workspaceId: string): Promise<DiffFileSummary[]> {
    const cwd = this.getWorkspaceCwd(workspaceId);
    const git = simpleGit(cwd);

    const status = await git.status();
    const files: DiffFileSummary[] = [];

    const allFiles = [
      ...status.modified.map((f) => ({ path: f, status: 'M' as DiffStatus })),
      ...status.created.map((f) => ({ path: f, status: 'A' as DiffStatus })),
      ...status.deleted.map((f) => ({ path: f, status: 'D' as DiffStatus })),
      ...status.renamed.map((f) => ({ path: f.to, status: 'R' as DiffStatus, oldPath: f.from })),
      ...status.not_added.map((f) => ({ path: f, status: '?' as DiffStatus })),
    ];

    for (const file of allFiles) {
      const diffStat = await this.getAddDel(git, file.path, file.status);
      files.push({
        path: file.path,
        status: file.status,
        additions: diffStat.additions,
        deletions: diffStat.deletions,
        ...(file.status === 'R' && 'oldPath' in file ? { oldPath: (file as { oldPath?: string }).oldPath } : {}),
      });
    }

    return files;
  }

  private async getAddDel(git: ReturnType<typeof simpleGit>, path: string, status: DiffStatus): Promise<{ additions: number; deletions: number }> {
    try {
      if (status === 'A' || status === '?') {
        const content = readFileSync(path, 'utf-8');
        return { additions: content.split('\n').length, deletions: 0 };
      }
      if (status === 'D') {
        return { additions: 0, deletions: 0 };
      }
      const diff = await git.diff(['--numstat', '--', path]);
      const match = diff.match(/^(\d+)\s+(\d+)/);
      if (!match) return { additions: 0, deletions: 0 };
      return { additions: parseInt(match[1]!), deletions: parseInt(match[2]!) };
    } catch {
      return { additions: 0, deletions: 0 };
    }
  }

  async getFileDetail(workspaceId: string, filePath: string, against: 'workdir' | 'index' | 'head' = 'workdir'): Promise<DiffFileDetail> {
    const cwd = this.getWorkspaceCwd(workspaceId);
    const git = simpleGit(cwd);
    const ext = extname(filePath).toLowerCase();
    const isBinary = BINARY_EXTENSIONS.has(ext);
    const language = EXT_LANG[ext] ?? 'plaintext';

    let oldContent: string | null = null;
    let newContent: string | null = null;
    let hunks: DiffHunk[] = [];

    if (isBinary) {
      return { path: filePath, status: 'M', oldContent: null, newContent: null, language, isBinary, hunks: [] };
    }

    try {
      oldContent = await git.show([`HEAD:${filePath}`]);
    } catch {
      oldContent = null;
    }

    const fullPath = `${cwd}/${filePath}`;
    if (existsSync(fullPath)) {
      try {
        newContent = readFileSync(fullPath, 'utf-8');
      } catch {
        newContent = null;
      }
    }

    if (against !== 'workdir') {
      try {
        const raw = against === 'index' ? await git.diff(['--cached', '--', filePath]) : await git.diff(['HEAD', '--', filePath]);
        hunks = this.parseHunks(raw);
      } catch {
        hunks = [];
      }
    } else {
      try {
        const raw = await git.diff(['--', filePath]);
        hunks = this.parseHunks(raw);
      } catch {
        hunks = [];
      }
    }

    const status = await this.resolveStatus(git, filePath);
    return { path: filePath, status, oldContent, newContent, language, isBinary, hunks };
  }

  private async resolveStatus(git: ReturnType<typeof simpleGit>, filePath: string): Promise<DiffStatus> {
    try {
      const s = await git.status(['--', filePath]);
      if (s.created.includes(filePath) || s.not_added.includes(filePath)) return 'A';
      if (s.deleted.includes(filePath)) return 'D';
      const renamed = s.renamed.find((r) => r.to === filePath);
      if (renamed) return 'R';
      return 'M';
    } catch {
      return 'M';
    }
  }

  private parseHunks(raw: string): DiffHunk[] {
    const hunks: DiffHunk[] = [];
    const lines = raw.split('\n');
    let current: DiffHunk | null = null;

    for (const line of lines) {
      const match = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)/);
      if (match) {
        if (current) hunks.push(current);
        current = {
          header: line,
          oldStart: parseInt(match[1]!),
          oldLines: parseInt(match[2] ?? '1'),
          newStart: parseInt(match[3]!),
          newLines: parseInt(match[4] ?? '1'),
          lines: [],
        };
      } else if (current && (line.startsWith('+') || line.startsWith('-') || line.startsWith(' '))) {
        current.lines.push(line);
      }
    }
    if (current) hunks.push(current);
    return hunks;
  }

  async stageHunks(workspaceId: string, filePath: string, hunkIndices: number[]): Promise<void> {
    const cwd = this.getWorkspaceCwd(workspaceId);
    const git = simpleGit(cwd);
    await git.add(filePath);
    void hunkIndices;
  }

  async unstageFile(workspaceId: string, filePath: string): Promise<void> {
    const cwd = this.getWorkspaceCwd(workspaceId);
    const git = simpleGit(cwd);
    await git.reset(['HEAD', '--', filePath]);
  }
}
