import { Injectable, BadRequestException } from '@nestjs/common';
import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import { EventsService } from '../events/events.service';

export interface CloneDto {
  repo: string;
  name?: string;
  destDir?: string;
}

@Injectable()
export class CloneService {
  constructor(
    private readonly db: DatabaseService,
    private readonly events: EventsService,
  ) {}

  clone(dto: CloneDto): { projectId: string } {
    const { repo, name, destDir } = dto;
    const repoName = name ?? this.repoNameFromSpec(repo);
    const baseDir = destDir ?? join(homedir(), 'pixler', 'repos');
    const destPath = join(baseDir, repoName);
    const projectId = randomUUID();

    if (!existsSync(baseDir)) {
      mkdirSync(baseDir, { recursive: true });
    }

    this.runClone({ repo, destPath, repoName, projectId });

    return { projectId };
  }

  private runClone(opts: {
    repo: string;
    destPath: string;
    repoName: string;
    projectId: string;
  }) {
    const { repo, destPath, repoName, projectId } = opts;

    const child = spawn('gh', ['repo', 'clone', repo, destPath, '--', '--progress'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const lines: string[] = [];
    let pct = 0;

    const handleLine = (raw: string) => {
      const line = raw.trim();
      if (!line) return;
      lines.push(line);

      const m = line.match(/(\d+)%/);
      if (m) pct = Math.min(parseInt(m[1], 10), 99);

      this.events.emitAppEvent({
        type: 'project.clone-progress',
        projectId,
        pct,
        line,
        timestamp: Date.now(),
      });
    };

    let buffer = '';
    const processBuffer = (chunk: string) => {
      buffer += chunk;
      const parts = buffer.split(/\r?\n|\r/);
      buffer = parts.pop() ?? '';
      for (const part of parts) handleLine(part);
    };

    child.stdout.on('data', (d: Buffer) => processBuffer(d.toString()));
    child.stderr.on('data', (d: Buffer) => processBuffer(d.toString()));

    child.on('close', (code) => {
      if (buffer) handleLine(buffer);

      if (code !== 0) {
        const lastLines = lines.slice(-5).join(' ');
        const error = this.classifyError(lastLines);
        this.events.emitAppEvent({
          type: 'project.clone-error',
          projectId,
          error,
          timestamp: Date.now(),
        });
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      this.db.connection
        .prepare(
          `INSERT INTO projects (id, name, path, default_branch, package_manager, icon_path, cloned_by_pixler, created_at, updated_at)
           VALUES (?, ?, ?, 'main', 'unknown', NULL, 1, ?, ?)`,
        )
        .run(projectId, repoName, destPath, now, now);

      this.events.emitAppEvent({
        type: 'project.clone-complete',
        projectId,
        timestamp: Date.now(),
      });
    });

    child.on('error', (err) => {
      const isNotFound = (err as NodeJS.ErrnoException).code === 'ENOENT';
      this.events.emitAppEvent({
        type: 'project.clone-error',
        projectId,
        error: isNotFound ? 'gh CLI not installed' : err.message,
        timestamp: Date.now(),
      });
    });
  }

  private repoNameFromSpec(repo: string): string {
    return repo.split('/').pop()?.replace(/\.git$/, '') ?? repo;
  }

  private classifyError(output: string): string {
    if (/not logged|auth|unauthorized/i.test(output)) return 'gh not authenticated — run: gh auth login';
    if (/not found|repository.*not/i.test(output)) return 'Repository not found';
    if (/already exists/i.test(output)) return 'Destination directory already exists';
    return output || 'Clone failed';
  }

  validateGhAvailable(): void {
    try {
      const { execSync } = require('child_process') as typeof import('child_process');
      execSync('gh --version', { stdio: 'ignore', timeout: 3000 });
    } catch {
      throw new BadRequestException('gh CLI is not installed or not on PATH');
    }
  }
}
