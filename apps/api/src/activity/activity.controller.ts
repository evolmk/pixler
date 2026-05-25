import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import type { MarkSeenDto, ActivityScope } from '@pixler/shared-types';

@Controller('api/activities')
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get()
  list(
    @Query('scope') scope?: ActivityScope,
    @Query('scopeId') scopeId?: string,
    @Query('unseenOnly') unseenOnly?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activity.list({
      scope,
      scopeId,
      unseenOnly: unseenOnly === 'true',
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Post('mark-seen')
  markSeen(@Body() dto: MarkSeenDto) {
    this.activity.markSeen(dto.ids ?? []);
    return { ok: true };
  }

  @Post('mark-all-seen')
  markAllSeen(
    @Query('scope') scope?: ActivityScope,
    @Query('scopeId') scopeId?: string,
  ) {
    this.activity.markAllSeen(scope, scopeId);
    return { ok: true };
  }
}
