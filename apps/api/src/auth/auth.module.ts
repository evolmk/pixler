import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthLinearService } from './oauth-linear.service';
import { OAuthGithubService } from './oauth-github.service';
import { LinearModule } from '../linear/linear.module';
import { GithubModule } from '../github/github.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [LinearModule, GithubModule, EventsModule],
  controllers: [AuthController],
  providers: [OAuthLinearService, OAuthGithubService],
})
export class AuthModule {}
