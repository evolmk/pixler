import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrService } from './pr.service';
import { EventsService } from '../events/events.service';
import type { PrCheck } from '@pixler/shared-types';

interface PollerEntry {
  timer: ReturnType<typeof setInterval>;
  lastChecks: PrCheck[];
}

@Injectable()
export class ChecksPollerService implements OnModuleDestroy {
  private readonly logger = new Logger(ChecksPollerService.name);
  private readonly pollers = new Map<string, PollerEntry>();
  private readonly INTERVAL_MS = 30_000;

  constructor(
    private readonly pr: PrService,
    private readonly events: EventsService,
  ) {}

  start(workspaceId: string): void {
    if (this.pollers.has(workspaceId)) return;

    const timer = setInterval(() => void this.poll(workspaceId), this.INTERVAL_MS);
    this.pollers.set(workspaceId, { timer, lastChecks: [] });
    void this.poll(workspaceId);
  }

  stop(workspaceId: string): void {
    const entry = this.pollers.get(workspaceId);
    if (entry) {
      clearInterval(entry.timer);
      this.pollers.delete(workspaceId);
    }
  }

  private async poll(workspaceId: string): Promise<void> {
    try {
      const checks = await this.pr.getChecks(workspaceId);
      const entry = this.pollers.get(workspaceId);
      if (!entry) return;

      const prev = JSON.stringify(entry.lastChecks);
      const next = JSON.stringify(checks);
      if (prev !== next) {
        entry.lastChecks = checks;
        this.events.emitWorkspaceEvent(workspaceId, {
          type: 'pr.checks-updated',
          checks,
        });
      }

      const allDone = checks.every((c) => c.status === 'completed');
      if (allDone) this.stop(workspaceId);
    } catch (err: unknown) {
      this.logger.debug(`checks poll error for ${workspaceId}: ${String(err)}`);
    }
  }

  onModuleDestroy() {
    for (const [id] of this.pollers) this.stop(id);
  }
}
