import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { TerminalsService } from './terminals.service';

@Controller()
export class TerminalsController {
  constructor(private readonly terminals: TerminalsService) {}

  @Get('workspaces/:id/terminals')
  list(@Param('id') workspaceId: string) {
    return { terminals: this.terminals.getForWorkspace(workspaceId) };
  }

  @Post('workspaces/:id/terminal')
  create(
    @Param('id') workspaceId: string,
    @Body() body: { cols?: number; rows?: number; forceNew?: boolean },
  ) {
    const terminalId = body.forceNew
      ? this.terminals.create(workspaceId, body.cols, body.rows)
      : this.terminals.findOrCreate(workspaceId, body.cols, body.rows);
    return { terminalId };
  }

  @Delete('terminals/:id')
  remove(@Param('id') id: string) {
    this.terminals.kill(id);
    return { ok: true };
  }

  @Post('terminals/:id/resize')
  resize(
    @Param('id') id: string,
    @Body() body: { cols: number; rows: number },
  ) {
    this.terminals.resize(id, body.cols, body.rows);
    return { ok: true };
  }

  @Post('terminals/:id/interrupt')
  interrupt(@Param('id') id: string) {
    this.terminals.interrupt(id);
    return { ok: true };
  }
}
