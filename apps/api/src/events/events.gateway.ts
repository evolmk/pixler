import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/events',
  cors: { origin: '*' },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  afterInit() {
    console.log('EventsGateway initialized');
  }

  handleConnection(client: Socket) {
    client.join('app');
  }

  handleDisconnect() {}

  @SubscribeMessage('join:workspace')
  handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() workspaceId: string,
  ) {
    client.join(`workspace:${workspaceId}`);
  }

  @SubscribeMessage('leave:workspace')
  handleLeaveWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() workspaceId: string,
  ) {
    client.leave(`workspace:${workspaceId}`);
  }
}
