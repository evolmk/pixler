import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

@Injectable()
export class FileStorageService {
  read(repoPath: string, ticketId: string): string | null {
    const filePath = this.resolvePath(repoPath, ticketId);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf-8');
  }

  write(repoPath: string, ticketId: string, content: string, branch?: string): void {
    const filePath = this.resolvePath(repoPath, ticketId);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');

    if (branch) {
      try {
        execSync(`git add "${filePath}" && git commit -m "chore: update plan for ${ticketId}"`, {
          cwd: repoPath,
          stdio: 'ignore',
        });
      } catch {
        // non-fatal — file is written, commit failed (dirty tree, no git, etc.)
      }
    }
  }

  resolvePath(repoPath: string, ticketId: string): string {
    return path.join(repoPath, 'docs', 'plans', `${ticketId}.md`);
  }
}
