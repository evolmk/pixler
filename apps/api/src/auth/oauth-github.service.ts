import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SecretStoreService } from '../linear/secret-store.service';
import { randomBytes } from 'crypto';

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';
const REDIRECT_URI = 'http://localhost:7777/auth/github/callback';
const STATE_TTL_MS = 10 * 60 * 1000;

interface PendingState {
  createdAt: number;
}

@Injectable()
export class OAuthGithubService {
  private readonly logger = new Logger(OAuthGithubService.name);
  private readonly pendingStates = new Map<string, PendingState>();

  constructor(private readonly secrets: SecretStoreService) {}

  async buildAuthUrl(): Promise<{ url: string; state: string }> {
    const clientId = await this.getClientId();
    if (!clientId) throw new UnauthorizedException('GitHub OAuth not configured (PIXLER_GITHUB_CLIENT_ID missing)');

    const state = randomBytes(16).toString('hex');
    this.pendingStates.set(state, { createdAt: Date.now() });
    this.pruneExpiredStates();

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      scope: 'repo,read:user,user:email',
      state,
    });

    return { url: `${AUTHORIZE_URL}?${params.toString()}`, state };
  }

  async exchangeCode(code: string, state: string): Promise<string> {
    const pending = this.pendingStates.get(state);
    if (!pending) throw new UnauthorizedException('Invalid or expired OAuth state');
    if (Date.now() - pending.createdAt > STATE_TTL_MS) {
      this.pendingStates.delete(state);
      throw new UnauthorizedException('OAuth state expired');
    }
    this.pendingStates.delete(state);

    const clientId = await this.getClientId();
    const clientSecret = await this.getClientSecret();
    if (!clientId || !clientSecret) throw new UnauthorizedException('GitHub OAuth not configured');

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: REDIRECT_URI,
        state,
      }).toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`GitHub token exchange failed: ${text}`);
      throw new UnauthorizedException('GitHub OAuth token exchange failed');
    }

    const data = await res.json() as { access_token?: string; error?: string; error_description?: string };
    if (data.error) throw new UnauthorizedException(data.error_description ?? data.error);
    if (!data.access_token) throw new UnauthorizedException('No access_token in GitHub OAuth response');

    return data.access_token;
  }

  private async getClientId(): Promise<string | null> {
    return process.env['PIXLER_GITHUB_CLIENT_ID'] ?? await this.secrets.get('github.oauth.clientId');
  }

  private async getClientSecret(): Promise<string | null> {
    return process.env['PIXLER_GITHUB_CLIENT_SECRET'] ?? await this.secrets.get('github.oauth.clientSecret');
  }

  private pruneExpiredStates() {
    const now = Date.now();
    for (const [key, val] of this.pendingStates) {
      if (now - val.createdAt > STATE_TTL_MS) this.pendingStates.delete(key);
    }
  }
}
