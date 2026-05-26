import { Body, Controller, Post } from '@nestjs/common';
import { SystemService } from './system.service';

interface PickFolderDto {
  title?: string;
  defaultPath?: string;
}

interface OpenTerminalDto {
  command: string;
}

@Controller('system')
export class SystemController {
  constructor(private readonly system: SystemService) {}

  @Post('pick-folder')
  async pickFolder(@Body() dto: PickFolderDto = {}) {
    const path = await this.system.pickFolder(dto);
    return { path };
  }

  @Post('open-terminal')
  async openTerminal(@Body() dto: OpenTerminalDto) {
    await this.system.openTerminal(dto.command);
    return { ok: true };
  }
}
