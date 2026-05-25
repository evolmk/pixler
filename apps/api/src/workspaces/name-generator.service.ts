import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { COLOR_NAMES } from '@pixler/shared-types';

@Injectable()
export class NameGeneratorService {
  constructor(private readonly db: DatabaseService) {}

  generate(opts: { ticketId?: string; ticketLabel?: string }): string {
    const { ticketId, ticketLabel } = opts;

    if (ticketId) {
      const slug = this.slugify(ticketId);
      const candidate = ticketLabel
        ? `${this.slugify(ticketLabel)}-${slug}`
        : slug;
      if (!this.isNameTaken(candidate)) return candidate;
    }

    return this.nextColorName();
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
  }

  private isNameTaken(name: string): boolean {
    const row = this.db.connection
      .prepare('SELECT id FROM workspaces WHERE name = ? AND archived_at IS NULL')
      .get(name);
    return !!row;
  }

  private nextColorName(): string {
    const usedColors = new Set(
      (
        this.db.connection
          .prepare(
            'SELECT color_name FROM workspaces WHERE color_name IS NOT NULL AND archived_at IS NULL',
          )
          .all() as { color_name: string }[]
      ).map((r) => r.color_name),
    );

    for (const color of COLOR_NAMES) {
      if (!usedColors.has(color)) return color;
    }

    // All colors in use — append a counter suffix to the first color
    let i = 2;
    while (this.isNameTaken(`${COLOR_NAMES[0]}-${i}`)) i++;
    return `${COLOR_NAMES[0]}-${i}`;
  }
}
