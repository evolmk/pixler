import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

type WorkspaceEventListener = (workspaceId: string, event: Record<string, unknown>) => void;

@Injectable()
export class EventsService {
  private readonly workspaceListeners: WorkspaceEventListener[] = [];

  constructor(private readonly gateway: EventsGateway) {}

  onWorkspaceEvent(listener: WorkspaceEventListener): void {
    this.workspaceListeners.push(listener);
  }

  emitAppEvent(event: { type: string; [key: string]: unknown }) {
    this.gateway.server.to('app').emit('app:event', event);
  }

  emitWorkspaceEvent(
    workspaceId: string,
    event: { type: string; [key: string]: unknown },
  ) {
    this.gateway.server
      .to(`workspace:${workspaceId}`)
      .emit('workspace:event', event);
    for (const listener of this.workspaceListeners) {
      try { listener(workspaceId, event as Record<string, unknown>); } catch { /* non-fatal */ }
    }
  }
}
