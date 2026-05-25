import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { SettingsService } from '../settings/settings.service';
import type { PlanStorageMode } from '@pixler/shared-types';

export interface Recommendation {
  mode: PlanStorageMode;
  reason: string;
}

type DbTicket = {
  description: string | null;
  label_name: string | null;
};

const INLINE_MAX_TASKS = 3;
const INLINE_MAX_APPROACH_CHARS = 500;

@Injectable()
export class AutoRecommenderService {
  constructor(
    private readonly db: DatabaseService,
    private readonly settings: SettingsService,
  ) {}

  recommend(ticketId: string | undefined, projectId?: string): Recommendation {
    const projectOverride = this.settings.get('plans.storageMode', { projectId }) as PlanStorageMode | undefined;
    if (projectOverride && projectOverride !== 'auto') {
      return { mode: projectOverride, reason: 'project setting' };
    }

    if (!ticketId) {
      return { mode: 'file', reason: 'no ticket — default to file' };
    }

    const ticket = this.db.connection
      .prepare('SELECT description, label_name FROM linear_tickets WHERE identifier = ?')
      .get(ticketId) as DbTicket | undefined;

    if (!ticket) {
      return { mode: 'file', reason: 'ticket not found locally — default to file' };
    }

    const label = ticket.label_name?.toLowerCase() ?? '';

    if (label.includes('pixler:plan-file')) {
      return { mode: 'file', reason: 'forced by pixler:plan-file label' };
    }
    if (label.includes('pixler:plan-inline')) {
      return { mode: 'inline', reason: 'forced by pixler:plan-inline label' };
    }

    const desc = ticket.description ?? '';
    const descLength = desc.length;
    const hasAcceptanceCriteria = /acceptance criteria/i.test(desc);
    const hasSubTasks = /^- \[/m.test(desc);

    if (descLength < 200 && !hasAcceptanceCriteria && !hasSubTasks) {
      return { mode: 'inline', reason: 'simple ticket (< 200 chars, no AC, no sub-tasks)' };
    }

    if (hasAcceptanceCriteria || hasSubTasks) {
      return { mode: 'file', reason: 'complex ticket (has acceptance criteria or sub-tasks)' };
    }

    if (label.includes('bug') || label.includes('chore')) {
      return { mode: 'attachment', reason: 'medium bug/chore — attachment keeps Linear clean' };
    }

    return { mode: 'file', reason: 'default to file for medium-complexity ticket' };
  }

  exceedsInlineThresholds(
    planContent: string,
    projectId?: string,
  ): { exceeded: boolean; taskCount: number; charCount: number } {
    const maxTasks = (this.settings.get('plans.inlineMaxTasks', { projectId }) as number) ?? INLINE_MAX_TASKS;
    const maxApproachChars = (this.settings.get('plans.inlineMaxApproachChars', { projectId }) as number) ?? INLINE_MAX_APPROACH_CHARS;

    const taskMatches = planContent.match(/^- \[/gm) ?? [];
    const taskCount = taskMatches.length;

    const approachMatch = planContent.match(/## Approach\s*([\s\S]*?)(?=\n##|$)/i);
    const approachText = approachMatch?.[1] ?? '';
    const charCount = approachText.trim().length;

    const exceeded = taskCount > maxTasks || charCount > maxApproachChars;
    return { exceeded, taskCount, charCount };
  }

  resetProjectPrompts(projectId: string): void {
    this.db.connection
      .prepare("DELETE FROM settings_project WHERE project_id = ? AND key = 'plans.storageMode'")
      .run(projectId);
  }

  resetAllPrompts(): void {
    this.db.connection
      .prepare("DELETE FROM settings_project WHERE key = 'plans.storageMode'")
      .run();
  }
}
