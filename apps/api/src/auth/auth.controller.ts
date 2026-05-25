import { Controller, Get, Post, Delete, Body, Query, Res, HttpCode } from '@nestjs/common';
import type { Response } from 'express';
import { OAuthLinearService } from './oauth-linear.service';
import { OAuthGithubService } from './oauth-github.service';
import { LinearService } from '../linear/linear.service';
import { GithubAuthService } from '../github/github-auth.service';
import { EventsService } from '../events/events.service';
import type { ConnectGithubPATDto } from '@pixler/shared-types';

const SUCCESS_HTML = (service: string) => `<!DOCTYPE html><html><head><title>Connected</title></head>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<div style="text-align:center"><h2>✓ ${service} connected</h2><p>You can close this tab.</p>
<script>window.close();</script></div></body></html>`;

const ERROR_HTML = (msg: string) => `<!DOCTYPE html><html><head><title>Error</title></head>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<div style="text-align:center"><h2>Connection failed</h2><p>${msg}</p></div></body></html>`;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly oauthLinear: OAuthLinearService,
    private readonly oauthGithub: OAuthGithubService,
    private readonly linearService: LinearService,
    private readonly githubAuth: GithubAuthService,
    private readonly events: EventsService,
  ) {}

  // ── Linear ──────────────────────────────────────────────────────────────

  @Get('linear/url')
  getLinearAuthUrl() {
    return this.oauthLinear.buildAuthUrl();
  }

  @Get('linear/callback')
  async linearCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const accessToken = await this.oauthLinear.exchangeCode(code, state);
      const status = await this.linearService.connectOAuth(accessToken);
      this.events.emitAppEvent({ type: 'auth:linear:connected', status });
      res.setHeader('Content-Type', 'text/html');
      res.send(SUCCESS_HTML('Linear'));
    } catch (err) {
      res.setHeader('Content-Type', 'text/html');
      res.status(400).send(ERROR_HTML(err instanceof Error ? err.message : String(err)));
    }
  }

  @Post('linear/disconnect')
  @HttpCode(204)
  async linearDisconnect() {
    await this.linearService.disconnect();
    this.events.emitAppEvent({ type: 'auth:linear:disconnected' });
  }

  @Delete('linear/credential')
  @HttpCode(204)
  async linearRemove(@Body() body: { method: 'pat' | 'oauth' }) {
    await this.linearService.removeCredential(body.method);
    this.events.emitAppEvent({ type: 'auth:linear:credential_removed', method: body.method });
  }

  // ── GitHub ──────────────────────────────────────────────────────────────

  @Get('github/url')
  getGithubAuthUrl() {
    return this.oauthGithub.buildAuthUrl();
  }

  @Get('github/callback')
  async githubCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const accessToken = await this.oauthGithub.exchangeCode(code, state);
      const status = await this.githubAuth.connectOAuth(accessToken);
      this.events.emitAppEvent({ type: 'auth:github:connected', status });
      res.setHeader('Content-Type', 'text/html');
      res.send(SUCCESS_HTML('GitHub'));
    } catch (err) {
      res.setHeader('Content-Type', 'text/html');
      res.status(400).send(ERROR_HTML(err instanceof Error ? err.message : String(err)));
    }
  }

  @Post('github/pat')
  async githubConnectPat(@Body() dto: ConnectGithubPATDto) {
    const status = await this.githubAuth.connectPat(dto.pat);
    this.events.emitAppEvent({ type: 'auth:github:connected', status });
    return status;
  }

  @Post('github/disconnect')
  @HttpCode(204)
  async githubDisconnect() {
    await this.githubAuth.disconnect();
    this.events.emitAppEvent({ type: 'auth:github:disconnected' });
  }

  @Delete('github/credential')
  @HttpCode(204)
  async githubRemove(@Body() body: { method: 'pat' | 'oauth' }) {
    await this.githubAuth.removeCredential(body.method);
    this.events.emitAppEvent({ type: 'auth:github:credential_removed', method: body.method });
  }
}
