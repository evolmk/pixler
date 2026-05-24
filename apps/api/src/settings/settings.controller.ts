import { Controller, Get, Patch, Post, Body, Query } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  getSettings(
    @Query('scope') scope?: string,
    @Query('id') id?: string,
  ) {
    const opts: { projectId?: string; workspaceId?: string } = {};
    if (scope === 'project' && id) opts.projectId = id;
    if (scope === 'workspace' && id) opts.workspaceId = id;
    return this.settings.getResolved(opts);
  }

  @Patch()
  patchSettings(
    @Body() body: { scope: 'global' | 'project' | 'workspace'; id?: string; patch: Record<string, unknown> },
  ) {
    for (const [key, value] of Object.entries(body.patch)) {
      this.settings.set(key, value, { scope: body.scope, id: body.id });
    }
    return { ok: true };
  }

  @Post('reset')
  resetSettings(
    @Body() body: { scope: 'global' | 'project' | 'workspace'; id?: string; kind?: 'all' | 'prompts' },
  ) {
    this.settings.reset(body);
    return { ok: true };
  }
}
