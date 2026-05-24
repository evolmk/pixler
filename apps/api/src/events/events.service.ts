import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(private readonly gateway: EventsGateway) {}

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
  }
}
