import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly github: GithubService) {}

  @Get('status')
  getStatus() {
    return this.github.getAuthStatus();
  }

  @Get('repo')
  getRepo(@Query('projectId') projectId: string) {
    return this.github.getRepoInfo(projectId);
  }
}
