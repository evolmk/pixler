import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LinearClient } from '@linear/sdk';
import { SecretStoreService } from './secret-store.service';
import type { LinearStatusDto, LinearTeamDto, LinearProjectDto } from '@pixler/shared-types';

const PAT_KEY = 'linear.pat';

@Injectable()
export class LinearService {
  constructor(private readonly secrets: SecretStoreService) {}

  async getClient(): Promise<LinearClient | null> {
    const pat = await this.secrets.get(PAT_KEY);
    if (!pat) return null;
    return new LinearClient({ apiKey: pat });
  }

  async connect(pat: string): Promise<LinearStatusDto> {
    let client: LinearClient;
    try {
      client = new LinearClient({ apiKey: pat });
      await client.viewer; // force a network call to validate
    } catch {
      throw new UnauthorizedException('Invalid Linear PAT');
    }

    const viewer = await client.viewer;
    if (!viewer) throw new UnauthorizedException('Invalid Linear PAT');

    const org = await viewer.organization;

    await this.secrets.set(PAT_KEY, pat);

    return {
      connected: true,
      viewerName: viewer.name,
      viewerEmail: viewer.email,
      organization: org?.name,
    };
  }

  async disconnect(): Promise<void> {
    await this.secrets.delete(PAT_KEY);
  }

  async status(): Promise<LinearStatusDto> {
    const client = await this.getClient();
    if (!client) return { connected: false };

    try {
      const viewer = await client.viewer;
      const org = await viewer.organization;
      return {
        connected: true,
        viewerName: viewer.name,
        viewerEmail: viewer.email,
        organization: org?.name,
      };
    } catch {
      return { connected: false };
    }
  }

  async teams(): Promise<LinearTeamDto[]> {
    const client = await this.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');

    const result = await client.teams();
    return result.nodes.map((t) => ({ id: t.id, name: t.name, key: t.key }));
  }

  async projects(teamId: string): Promise<LinearProjectDto[]> {
    const client = await this.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');

    const team = await client.team(teamId);
    const result = await team.projects();
    return result.nodes.map((p) => ({ id: p.id, name: p.name, slug: p.slugId }));
  }
}
