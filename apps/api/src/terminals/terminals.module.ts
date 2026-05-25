import { Module } from '@nestjs/common';
import { TerminalsController } from './terminals.controller';
import { TerminalsService } from './terminals.service';
import { TerminalsGateway } from './terminals.gateway';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [WorkspacesModule, SettingsModule],
  controllers: [TerminalsController],
  providers: [TerminalsService, TerminalsGateway],
  exports: [TerminalsService],
})
export class TerminalsModule {}
