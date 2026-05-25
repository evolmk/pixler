import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PtyBridgeService } from './pty-bridge.service';
import { TerminalsService } from '../terminals/terminals.service';
import type { SendMessageDto } from '@pixler/shared-types';

@Controller('api/workspaces/:workspaceId')
export class MessagesController {
  constructor(
    private readonly messages: MessagesService,
    private readonly bridge: PtyBridgeService,
    private readonly terminals: TerminalsService,
  ) {}

  @Get('messages')
  list(
    @Param('workspaceId') workspaceId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messages.list(workspaceId, cursor, limit ? parseInt(limit, 10) : undefined);
  }

  @Post('messages')
  async send(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: SendMessageDto,
  ) {
    const userMsg = this.messages.append(workspaceId, 'user', dto.content);

    const terminalIds = this.terminals.getForWorkspace(workspaceId);
    if (terminalIds.length > 0) {
      const terminalId = terminalIds[0]!;
      this.bridge.watch(workspaceId, terminalId);
      this.terminals.write(terminalId, dto.content + '\r');
    }

    return userMsg;
  }

  @Delete('messages')
  clear(@Param('workspaceId') workspaceId: string) {
    this.messages.deleteByWorkspace(workspaceId);
    return { ok: true };
  }
}
