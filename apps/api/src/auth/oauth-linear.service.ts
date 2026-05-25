import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SecretStoreService } from '../linear/secret-store.service';
import { randomBytes, createHash } from 'crypto';

const AUTHORIZE_URL = 'https://linear.app/oauth/authorize';
const TOKEN_URL = 'https://api.linear.app/oauth/token';
const REDIRECT_URI = 'http://localhost:7777/auth/linear/callback';
const STATE_TTL_MS = 10 * 60 * 1000;

interface PendingState {
  createdAt: number;
  codeVerifier: string;
}

@Injectable()
export class OAuthLinearService {
  private readonly logger = new Logger(OAuthLinearService.name);
  private readonly pendingStates = new Map<string, PendingState>();

  constructor(private readonly secrets: SecretStoreService) {}

  async buildAuthUrl(): Promise<{ url: string; state: string }> {
    const clientId = await this.getClientId();
    if (!clientId) throw new UnauthorizedException('Linear OAuth not configured (PIXLER_LINEAR_CLIENT_ID missing)');

    const state = randomBytes(16).toString('hex');
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');

    this.pendingStates.set(state, { createdAt: Date.now(), codeVerifier });
    this.pruneExpiredStates();

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      scope: 'read,write',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      prompt: 'consent',
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
    if (!clientId) throw new UnauthorizedException('Linear OAuth not configured');

    const body: Record<string, string> = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: clientId,
      code_verifier: pending.codeVerifier,
    };
    if (clientSecret) body['client_secret'] = clientSecret;

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body).toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Linear token exchange failed: ${text}`);
      throw new UnauthorizedException('Linear OAuth token exchange failed');
    }

    const data = await res.json() as { access_token: string };
    if (!data.access_token) throw new UnauthorizedException('No access_token in Linear OAuth response');

    return data.access_token;
  }

  private async getClientId(): Promise<string | null> {
    return process.env['PIXLER_LINEAR_CLIENT_ID'] ?? await this.secrets.get('linear.oauth.clientId');
  }

  private async getClientSecret(): Promise<string | null> {
    return process.env['PIXLER_LINEAR_CLIENT_SECRET'] ?? await this.secrets.get('linear.oauth.clientSecret');
  }

  private pruneExpiredStates() {
    const now = Date.now();
    for (const [key, val] of this.pendingStates) {
      if (now - val.createdAt > STATE_TTL_MS) this.pendingStates.delete(key);
    }
  }
}
