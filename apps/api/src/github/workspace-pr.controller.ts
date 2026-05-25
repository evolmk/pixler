import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrService } from './pr.service';
import { ChecksPollerService } from './checks-poller.service';
import type { CreatePrDto, MergePrDto } from '@pixler/shared-types';

@Controller('workspaces/:id/pr')
export class WorkspacePrController {
  constructor(
    private readonly pr: PrService,
    private readonly poller: ChecksPollerService,
  ) {}

  @Post()
  async create(@Param('id') id: string, @Body() dto: CreatePrDto) {
    const result = await this.pr.createPr(id, dto);
    this.poller.start(id);
    return result;
  }

  @Get()
  get(@Param('id') id: string) {
    return this.pr.getPr(id);
  }

  @Post('merge')
  merge(@Param('id') id: string, @Body() dto: MergePrDto) {
    return this.pr.mergePr(id, dto);
  }

  @Get('checks')
  checks(@Param('id') id: string) {
    return this.pr.getChecks(id);
  }

  @Get('comments')
  comments(@Param('id') id: string) {
    return this.pr.getComments(id);
  }
}
