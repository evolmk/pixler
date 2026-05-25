import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { LinearMutationsService } from '../linear/linear-mutations.service';

@Injectable()
export class SubIssuesBridgeService {
  private readonly logger = new Logger(SubIssuesBridgeService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly mutations: LinearMutationsService,
  ) {}

  extractTasks(content: string): string[] {
    const matches = content.match(/^- \[[ x]\] (.+)$/gm) ?? [];
    return matches.map((line) => line.replace(/^- \[[ x]\] /, '').trim());
  }

  async syncSubIssues(
    planId: string,
    ticketId: string,
    content: string,
    existingMap: Record<string, string>,
  ): Promise<Record<string, string>> {
    const tasks = this.extractTasks(content);
    const updatedMap: Record<string, string> = { ...existingMap };

    for (let i = 0; i < tasks.length; i++) {
      const key = String(i);
      if (!updatedMap[key]) {
        try {
          const { identifier } = await this.mutations.createSubissue(ticketId, tasks[i]);
          updatedMap[key] = identifier;
          this.logger.log(`Created sub-issue ${identifier} for task ${i}`);
        } catch (e) {
          this.logger.warn(`Failed to create sub-issue for task ${i}: ${e}`);
        }
      }
    }

    this.db.connection
      .prepare('UPDATE plans SET sub_issue_map = ? WHERE id = ?')
      .run(JSON.stringify(updatedMap), planId);

    return updatedMap;
  }

  async toggleTask(
    planId: string,
    taskIndex: number,
    completed: boolean,
  ): Promise<{ content: string; subIssueMap: Record<string, string> }> {
    const row = this.db.connection
      .prepare('SELECT content, sub_issue_map FROM plans WHERE id = ?')
      .get(planId) as { content: string; sub_issue_map: string } | undefined;
    if (!row) throw new Error(`Plan ${planId} not found`);

    const lines = row.content.split('\n');
    let taskCount = 0;
    for (let i = 0; i < lines.length; i++) {
      if (/^- \[[ x]\] /.test(lines[i])) {
        if (taskCount === taskIndex) {
          lines[i] = completed
            ? lines[i].replace(/^- \[ \] /, '- [x] ')
            : lines[i].replace(/^- \[x\] /, '- [ ] ');
          break;
        }
        taskCount++;
      }
    }
    const newContent = lines.join('\n');

    this.db.connection
      .prepare('UPDATE plans SET content = ?, updated_at = ? WHERE id = ?')
      .run(newContent, Date.now(), planId);

    const subIssueMap = JSON.parse(row.sub_issue_map) as Record<string, string>;
    const subIssueId = subIssueMap[String(taskIndex)];

    if (subIssueId) {
      try {
        if (completed) {
          await this.mutations.completeSubissue(subIssueId);
        }
      } catch (e) {
        this.logger.warn(`Failed to toggle sub-issue ${subIssueId}: ${e}`);
      }
    }

    return { content: newContent, subIssueMap };
  }
}
