import { Module } from '@nestjs/common';
import { IdeService } from './ide.service';
import { IdeController } from './ide.controller';

@Module({
  providers: [IdeService],
  controllers: [IdeController],
  exports: [IdeService],
})
export class IdeModule {}
