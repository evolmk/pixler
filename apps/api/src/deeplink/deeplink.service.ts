import { Injectable, Logger } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { SettingsService } from '../settings/settings.service';
import { LinearMutationsService } from '../linear/linear-mutations.service';
import { getSchemeStatus, registerScheme, type SchemeStatus } from './url-scheme.installer';

interface ParsedDeepLink {
  resource: 'workspace' | 'project' | 'ticket';
  id: string;
}

@Injectable()
export class DeeplinkService {
  private readonly logger = new Logger(DeeplinkService.name);

  constructor(
    private readonly events: EventsService,
    private readonly settings: SettingsService,
    private readonly mutations: LinearMutationsService,
  ) {}

  parse(url: string): ParsedDeepLink | null {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'pixler:') return null;
      const host = parsed.hostname; // workspace | project | ticket
      const id = parsed.pathname.replace(/^\//, '');
      if (!id || !['workspace', 'project', 'ticket'].includes(host)) return null;
      return { resource: host as ParsedDeepLink['resource'], id };
    } catch {
      return null;
    }
  }

  handle(url: string): void {
    const link = this.parse(url);
    if (!link) {
      this.logger.warn(`Unrecognised deep link: ${url}`);
      return;
    }
    this.events.emitAppEvent({
      type: 'deeplink.received',
      url,
      resource: link.resource,
      id: link.id,
      timestamp: Math.floor(Date.now() / 1000),
    });
  }

  schemeStatus(): SchemeStatus {
    return getSchemeStatus();
  }

  registerScheme(): SchemeStatus {
    const port = 7777;
    try {
      registerScheme(port);
    } catch (err) {
      this.logger.error('URL scheme registration failed', err);
    }
    return getSchemeStatus();
  }

  async postWorkspaceCreatedComment(
    workspaceId: string,
    ticketId: string | null | undefined,
    projectId: string,
  ): Promise<void> {
    if (!ticketId) return;

    const enabled = this.settings.get('integrations.linear.deeplinkOnCreate', { projectId }) as boolean;
    if (!enabled) return;

    const url = `pixler://workspace/${workspaceId}`;
    const body = `🔗 [Open in Pixler](${url})\n\nWorkspace created. Click the link to open this workspace directly in Pixler.`;
    try {
      await this.mutations.createComment(ticketId, body);
    } catch (err) {
      this.logger.warn(`Failed to post deep-link comment for ticket ${ticketId}: ${String(err)}`);
    }
  }
}
