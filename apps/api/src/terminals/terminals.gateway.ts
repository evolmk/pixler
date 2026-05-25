import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TerminalsService } from './terminals.service';

@WebSocketGateway({ namespace: '/terminals', cors: { origin: '*' } })
export class TerminalsGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private cleanups = new Map<string, (() => void)[]>();

  constructor(private readonly terminals: TerminalsService) {}

  handleDisconnect(client: Socket) {
    const fns = this.cleanups.get(client.id) ?? [];
    for (const fn of fns) fn();
    this.cleanups.delete(client.id);
  }

  @SubscribeMessage('terminal.subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() terminalId: string,
  ) {
    const offData = this.terminals.onData(terminalId, (data) => {
      client.emit('terminal.data', { terminalId, data });
    });
    const offExit = this.terminals.onExit(terminalId, (exitCode) => {
      client.emit('terminal.exit', { terminalId, exitCode });
    });

    const current = this.cleanups.get(client.id) ?? [];
    this.cleanups.set(client.id, [...current, offData, offExit]);
  }

  @SubscribeMessage('terminal.input')
  handleInput(
    @MessageBody() payload: { terminalId: string; data: string },
  ) {
    this.terminals.write(payload.terminalId, payload.data);
  }
}
