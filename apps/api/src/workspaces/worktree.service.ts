import { Injectable, InternalServerErrorException } from '@nestjs/common';
import simpleGit from 'simple-git';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';

@Injectable()
export class WorktreeService {
  async create(opts: {
    repoPath: string;
    worktreePath: string;
    branch: string;
  }): Promise<void> {
    const { repoPath, worktreePath, branch } = opts;
    const dir = dirname(worktreePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    try {
      const git = simpleGit(repoPath);
      await git.raw(['worktree', 'add', worktreePath, '-b', branch]);
    } catch (err) {
      throw new InternalServerErrorException(
        `Failed to create worktree: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async remove(worktreePath: string): Promise<void> {
    if (!existsSync(worktreePath)) return;
    rmSync(worktreePath, { recursive: true, force: true });
  }

  worktreeDir(opts: { repoPath: string; workspaceName: string }): string {
    const { repoPath, workspaceName } = opts;
    return join(repoPath, '..', 'pixler-worktrees', workspaceName);
  }

  branchName(opts: { workspaceName: string; template?: string }): string {
    const { workspaceName, template } = opts;
    if (template) {
      return template.replace('{name}', workspaceName);
    }
    return `pixler/${workspaceName}`;
  }
}
