import { Injectable, Logger } from '@nestjs/common';
import { StateMapService } from '../linear/state-map.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class LinearBridgeService {
  private readonly logger = new Logger(LinearBridgeService.name);

  constructor(
    private readonly stateMap: StateMapService,
    private readonly settings: SettingsService,
  ) {}

  private teamKey(projectId?: string): string {
    return (this.settings.get('linear.team', { projectId }) as string) || '';
  }

  async onWorkspaceStart(ticketId: string, projectId?: string): Promise<void> {
    const team = this.teamKey(projectId);
    if (!team || !ticketId) return;
    try {
      await this.stateMap.transitionIssue(ticketId, 'in_progress', team, projectId);
      this.logger.log(`[Linear] ${ticketId} → In Progress`);
    } catch (e) {
      this.logger.warn(`[Linear] onWorkspaceStart failed: ${e}`);
    }
  }

  async onPrOpened(ticketId: string, projectId?: string): Promise<void> {
    const team = this.teamKey(projectId);
    if (!team || !ticketId) return;
    try {
      await this.stateMap.transitionIssue(ticketId, 'in_review', team, projectId);
      this.logger.log(`[Linear] ${ticketId} → In Review`);
    } catch (e) {
      this.logger.warn(`[Linear] onPrOpened failed: ${e}`);
    }
  }

  async onPrMerged(ticketId: string, projectId?: string): Promise<void> {
    const team = this.teamKey(projectId);
    if (!team || !ticketId) return;
    try {
      await this.stateMap.transitionIssue(ticketId, 'done', team, projectId);
      this.logger.log(`[Linear] ${ticketId} → Done`);
    } catch (e) {
      this.logger.warn(`[Linear] onPrMerged failed: ${e}`);
    }
  }
}
