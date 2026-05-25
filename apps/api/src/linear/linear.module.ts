import { Module } from '@nestjs/common';
import { LinearController } from './linear.controller';
import { LinearService } from './linear.service';
import { SecretStoreService } from './secret-store.service';

@Module({
  controllers: [LinearController],
  providers: [LinearService, SecretStoreService],
  exports: [LinearService],
})
export class LinearModule {}
