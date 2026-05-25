import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { LinearService } from './linear.service';

type PixlerState = 'todo' | 'in_progress' | 'in_review' | 'done';

const DEFAULT_MAP: Record<PixlerState, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

@Injectable()
export class StateMapService {
  constructor(
    private readonly settings: SettingsService,
    private readonly linear: LinearService,
  ) {}

  private resolveMap(projectId?: string): Record<PixlerState, string> {
    const raw = this.settings.get('linear.stateMap', { projectId }) as
      | Partial<Record<PixlerState, string>>
      | undefined;
    return { ...DEFAULT_MAP, ...raw };
  }

  async resolveStateId(
    teamId: string,
    pixlerState: PixlerState,
    projectId?: string,
  ): Promise<string | null> {
    const client = await this.linear.getClient();
    if (!client) return null;

    const stateMap = this.resolveMap(projectId);
    const targetName = stateMap[pixlerState];

    const team = await client.team(teamId);
    const states = await team.states();

    const match = states.nodes.find(
      (s) => s.name.toLowerCase() === targetName.toLowerCase(),
    );
    return match?.id ?? null;
  }

  async transitionIssue(
    identifier: string,
    pixlerState: PixlerState,
    teamId: string,
    projectId?: string,
  ): Promise<void> {
    const client = await this.linear.getClient();
    if (!client) return;

    const stateId = await this.resolveStateId(teamId, pixlerState, projectId);
    if (!stateId) return;

    const issues = await client.issues({
      filter: { identifier: { eq: identifier } },
    } as Parameters<typeof client.issues>[0]);

    const issue = issues.nodes[0];
    if (!issue) return;

    await issue.update({ stateId });
  }
}
