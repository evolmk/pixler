import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { TerminalsService } from './terminals.service';

@Controller()
export class TerminalsController {
  constructor(private readonly terminals: TerminalsService) {}

  @Post('workspaces/:id/terminal')
  create(
    @Param('id') workspaceId: string,
    @Body() body: { cols?: number; rows?: number },
  ) {
    const terminalId = this.terminals.findOrCreate(
      workspaceId,
      body.cols,
      body.rows,
    );
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
}
