import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { ActivityService } from './activity.service';

@Injectable()
export class ActivityListeners implements OnModuleInit {
  private readonly logger = new Logger(ActivityListeners.name);

  constructor(
    private readonly events: EventsService,
    private readonly activity: ActivityService,
  ) {}

  onModuleInit(): void {
    this.events.onWorkspaceEvent((workspaceId, event) => {
      this.handleWorkspaceEvent(workspaceId, event);
    });
  }

  private handleWorkspaceEvent(workspaceId: string, event: Record<string, unknown>): void {
    const type = event.type as string;

    try {
      switch (type) {
        case 'agent.gate':
          this.activity.record({
            scope: 'workspace',
            scopeId: workspaceId,
            kind: 'approval.needed',
            title: `Approval needed — ${String(event.gate ?? 'unknown')} gate`,
            severity: 'info',
          });
          break;

        case 'agent.error':
          this.activity.record({
            scope: 'workspace',
            scopeId: workspaceId,
            kind: 'agent.error',
            title: 'Agent error',
            body: String(event.error ?? ''),
            severity: 'error',
          });
          break;

        case 'agent.done':
          this.activity.record({
            scope: 'workspace',
            scopeId: workspaceId,
            kind: 'agent.done',
            title: 'Agent task complete',
            body: event.prUrl ? `PR opened: ${String(event.prUrl)}` : '',
            severity: 'success',
          });
          break;

        case 'agent.paused':
          this.activity.record({
            scope: 'workspace',
            scopeId: workspaceId,
            kind: 'agent.stuck',
            title: 'Agent paused — rejection limit reached',
            severity: 'warning',
          });
          break;

        case 'agent.activity':
          if (event.level === 'hint') {
            this.activity.record({
              scope: 'workspace',
              scopeId: workspaceId,
              kind: 'context.spike',
              title: 'Context spike detected',
              body: String(event.message ?? ''),
              severity: 'hint',
            });
          }
          break;
      }
    } catch (err) {
      this.logger.warn(`ActivityListeners error processing ${type}: ${err}`);
    }
  }
}
