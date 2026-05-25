import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { execSync } from 'child_process';
import { existsSync, rmSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import type { Project, AddLocalProjectDto, PatchProjectDto, DeleteProjectMode } from '@pixler/shared-types';

type DbProject = Omit<Project, 'cloned_by_pixler'> & { cloned_by_pixler: 0 | 1 };

@Injectable()
export class ProjectsService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Project[] {
    const rows = this.db.connection
      .prepare('SELECT * FROM projects ORDER BY created_at DESC')
      .all() as DbProject[];
    return rows.map(this.toProject);
  }

  findOne(id: string): Project {
    const row = this.db.connection
      .prepare('SELECT * FROM projects WHERE id = ?')
      .get(id) as DbProject | undefined;
    if (!row) throw new NotFoundException(`Project ${id} not found`);
    return this.toProject(row);
  }

  addLocal(dto: AddLocalProjectDto): Project {
    const { path: repoPath, name } = dto;

    if (!existsSync(repoPath)) {
      throw new BadRequestException(`Path does not exist: ${repoPath}`);
    }

    const gitDir = join(repoPath, '.git');
    if (!existsSync(gitDir)) {
      throw new BadRequestException(`Not a git repository: ${repoPath}`);
    }

    const existing = this.db.connection
      .prepare('SELECT id FROM projects WHERE path = ?')
      .get(repoPath);
    if (existing) {
      throw new BadRequestException(`Project at this path already exists`);
    }

    const defaultBranch = this.detectDefaultBranch(repoPath);
    const packageManager = this.detectPackageManager(repoPath);
    const iconPath = this.detectIcon(repoPath);
    const projectName = name ?? basename(repoPath);
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);

    this.db.connection
      .prepare(
        `INSERT INTO projects (id, name, path, default_branch, package_manager, icon_path, cloned_by_pixler, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      )
      .run(id, projectName, repoPath, defaultBranch, packageManager, iconPath, now, now);

    return this.findOne(id);
  }

  patch(id: string, dto: PatchProjectDto): Project {
    this.findOne(id);
    const now = Math.floor(Date.now() / 1000);

    if (dto.name !== undefined) {
      this.db.connection
        .prepare('UPDATE projects SET name = ?, updated_at = ? WHERE id = ?')
        .run(dto.name, now, id);
    }
    if ('icon_path' in dto) {
      this.db.connection
        .prepare('UPDATE projects SET icon_path = ?, updated_at = ? WHERE id = ?')
        .run(dto.icon_path ?? null, now, id);
    }

    return this.findOne(id);
  }

  remove(id: string, mode: DeleteProjectMode): { ok: boolean } {
    const project = this.findOne(id);

    if (mode === 'delete') {
      if (!existsSync(project.path)) {
        throw new BadRequestException(`Project path does not exist on disk`);
      }
      rmSync(project.path, { recursive: true, force: true });
    }

    this.db.connection.prepare('DELETE FROM projects WHERE id = ?').run(id);
    this.db.connection
      .prepare('DELETE FROM settings_project WHERE project_id = ?')
      .run(id);

    return { ok: true };
  }

  private detectDefaultBranch(repoPath: string): string {
    try {
      const result = execSync('git symbolic-ref --short HEAD', {
        cwd: repoPath,
        encoding: 'utf-8',
        timeout: 3000,
      }).trim();
      return result || 'main';
    } catch {
      return 'main';
    }
  }

  private detectPackageManager(repoPath: string): Project['package_manager'] {
    const files = readdirSync(repoPath).map((f) => f.toLowerCase());
    if (files.includes('pnpm-lock.yaml')) return 'pnpm';
    if (files.includes('yarn.lock')) return 'yarn';
    if (files.includes('bun.lockb') || files.includes('bun.lock')) return 'bun';
    if (files.includes('package-lock.json')) return 'npm';
    if (files.includes('package.json')) return 'npm';
    return 'unknown';
  }

  private detectIcon(repoPath: string): string | null {
    const pixlerDir = join(repoPath, '.pixler');
    const candidates = [
      join(pixlerDir, 'icon.png'),
      join(repoPath, 'icon.png'),
      join(repoPath, 'logo.svg'),
      join(repoPath, 'public', 'favicon.ico'),
      join(repoPath, 'favicon.ico'),
    ];
    for (const p of candidates) {
      if (existsSync(p)) return p;
    }
    return null;
  }

  private toProject(row: DbProject): Project {
    return {
      ...row,
      cloned_by_pixler: row.cloned_by_pixler === 1,
    };
  }
}
