import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PtyBridgeService } from './pty-bridge.service';
import { DatabaseModule } from '../db/database.module';
import { TerminalsModule } from '../terminals/terminals.module';

@Module({
  imports: [DatabaseModule, TerminalsModule],
  providers: [MessagesService, PtyBridgeService],
  controllers: [MessagesController],
  exports: [MessagesService, PtyBridgeService],
})
export class MessagesModule {}
