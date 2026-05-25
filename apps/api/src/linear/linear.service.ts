import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LinearClient } from '@linear/sdk';
import { SecretStoreService } from './secret-store.service';
import type { LinearStatusDto, LinearTeamDto, LinearProjectDto, LinearTicketDto } from '@pixler/shared-types';

const PAT_KEY = 'linear.pat';
const OAUTH_TOKEN_KEY = 'linear.oauth.accessToken';

@Injectable()
export class LinearService {
  constructor(private readonly secrets: SecretStoreService) {}

  async getClient(): Promise<LinearClient | null> {
    const method = await this.secrets.getAuthMethod('linear');

    if (method === 'oauth') {
      const token = await this.secrets.get(OAUTH_TOKEN_KEY);
      if (!token) return null;
      return new LinearClient({ accessToken: token });
    }

    // 'pat' or legacy (no authMethod stored yet — auto-migrate if PAT exists)
    const pat = await this.secrets.get(PAT_KEY);
    if (!pat) return null;
    if (!method) await this.secrets.setAuthMethod('linear', 'pat');
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
    await this.secrets.setAuthMethod('linear', 'pat');

    return {
      connected: true,
      authMethod: 'pat',
      viewerName: viewer.name,
      viewerEmail: viewer.email,
      organization: org?.name,
    };
  }

  async connectOAuth(accessToken: string): Promise<LinearStatusDto> {
    let client: LinearClient;
    try {
      client = new LinearClient({ accessToken });
      await client.viewer;
    } catch {
      throw new UnauthorizedException('Invalid Linear OAuth token');
    }

    const viewer = await client.viewer;
    if (!viewer) throw new UnauthorizedException('Invalid Linear OAuth token');

    const org = await viewer.organization;

    await this.secrets.set(OAUTH_TOKEN_KEY, accessToken);
    await this.secrets.setAuthMethod('linear', 'oauth');

    return {
      connected: true,
      authMethod: 'oauth',
      viewerName: viewer.name,
      viewerEmail: viewer.email,
      organization: org?.name,
    };
  }

  /** Soft-disconnect: deactivates current method but keeps stored credentials. */
  async disconnect(): Promise<void> {
    await this.secrets.softDisconnect('linear');
  }

  /** Hard-remove: deletes the stored credential for the given method. */
  async removeCredential(method: 'pat' | 'oauth'): Promise<void> {
    const key = method === 'oauth' ? OAUTH_TOKEN_KEY : PAT_KEY;
    const activeMethod = await this.secrets.getAuthMethod('linear');
    if (activeMethod === method) await this.secrets.setAuthMethod('linear', null);
    await this.secrets.delete(key);
  }

  async status(): Promise<LinearStatusDto> {
    const rawMethod = await this.secrets.getAuthMethod('linear');
    const method = (rawMethod === 'cli' ? null : rawMethod) as 'pat' | 'oauth' | null;
    const storedMethods = await this.getStoredMethods();
    const client = await this.getClient();
    if (!client) return { connected: false, authMethod: method, storedMethods };

    try {
      const viewer = await client.viewer;
      const org = await viewer.organization;
      return {
        connected: true,
        authMethod: method,
        storedMethods,
        viewerName: viewer.name,
        viewerEmail: viewer.email,
        organization: org?.name,
      };
    } catch {
      return { connected: false, authMethod: method, storedMethods };
    }
  }

  private async getStoredMethods(): Promise<Array<'pat' | 'oauth'>> {
    const methods: Array<'pat' | 'oauth'> = [];
    if (await this.secrets.get(PAT_KEY)) methods.push('pat');
    if (await this.secrets.get(OAUTH_TOKEN_KEY)) methods.push('oauth');
    return methods;
  }

  async teams(): Promise<LinearTeamDto[]> {
    const client = await this.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');

    const result = await client.teams();
    return result.nodes.map((t) => ({ id: t.id, name: t.name, key: t.key }));
  }

  async fetchTicket(identifier: string): Promise<LinearTicketDto> {
    const client = await this.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');

    const result = await client.issues({
      filter: { identifier: { eq: identifier } },
    } as Parameters<typeof client.issues>[0]);

    const issue = result.nodes[0];
    if (!issue) throw new NotFoundException(`Issue ${identifier} not found`);

    const state = await issue.state;
    const assignee = await issue.assignee;
    const labels = await issue.labels();

    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description ?? null,
      state: state?.name ?? 'Unknown',
      stateType: state?.type ?? 'unstarted',
      priority: issue.priority,
      url: issue.url,
      assignee: assignee ? { id: assignee.id, name: assignee.name } : null,
      labels: labels.nodes.map((l) => ({ id: l.id, name: l.name, color: l.color })),
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
    };
  }

  async projects(teamId: string): Promise<LinearProjectDto[]> {
    const client = await this.getClient();
    if (!client) throw new UnauthorizedException('Linear not connected');

    const team = await client.team(teamId);
    const result = await team.projects();
    return result.nodes.map((p) => ({ id: p.id, name: p.name, slug: p.slugId }));
  }
}
