import { Injectable } from '@nestjs/common';
import fg from 'fast-glob';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';

@Injectable()
export class FilesToCopyService {
  async copy(opts: {
    repoPath: string;
    worktreePath: string;
    globs: string[];
  }): Promise<void> {
    const { repoPath, worktreePath, globs } = opts;
    if (!globs.length) return;

    const files = await fg(globs, { cwd: repoPath, dot: true, absolute: false });
    for (const file of files) {
      const src = join(repoPath, file);
      const dest = join(worktreePath, file);
      const destDir = dirname(dest);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(src, dest);
    }
  }
}
