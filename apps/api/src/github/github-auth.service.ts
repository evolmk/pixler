import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SecretStoreService } from '../linear/secret-store.service';
import type { GithubAuthStatus, AuthMethod } from '@pixler/shared-types';

const GITHUB_PAT_KEY = 'github.pat';
const GITHUB_OAUTH_TOKEN_KEY = 'github.oauth.accessToken';

@Injectable()
export class GithubAuthService {
  constructor(private readonly secrets: SecretStoreService) {}

  async getActiveMethod(): Promise<AuthMethod | null> {
    return this.secrets.getAuthMethod('github');
  }

  async connectPat(pat: string): Promise<GithubAuthStatus> {
    const username = await this.validatePat(pat);
    await this.secrets.set(GITHUB_PAT_KEY, pat);
    await this.secrets.setAuthMethod('github', 'pat');
    return { authed: true, authMethod: 'pat', username };
  }

  async connectOAuth(accessToken: string): Promise<GithubAuthStatus> {
    const username = await this.validateToken(accessToken);
    await this.secrets.set(GITHUB_OAUTH_TOKEN_KEY, accessToken);
    await this.secrets.setAuthMethod('github', 'oauth');
    return { authed: true, authMethod: 'oauth', username };
  }

  /** Soft-disconnect: clears active method, keeps stored credentials. */
  async disconnect(): Promise<void> {
    await this.secrets.softDisconnect('github');
  }

  /** Hard-remove: deletes the stored credential for the given method. */
  async removeCredential(method: 'pat' | 'oauth'): Promise<void> {
    const key = method === 'oauth' ? GITHUB_OAUTH_TOKEN_KEY : GITHUB_PAT_KEY;
    const activeMethod = await this.secrets.getAuthMethod('github');
    if (activeMethod === method) await this.secrets.setAuthMethod('github', null);
    await this.secrets.delete(key);
  }

  async getToken(): Promise<string | null> {
    const method = await this.secrets.getAuthMethod('github');
    if (method === 'oauth') return this.secrets.get(GITHUB_OAUTH_TOKEN_KEY);
    if (method === 'pat') return this.secrets.get(GITHUB_PAT_KEY);
    return null;
  }

  async getStoredMethods(): Promise<Array<'pat' | 'oauth'>> {
    const methods: Array<'pat' | 'oauth'> = [];
    if (await this.secrets.get(GITHUB_PAT_KEY)) methods.push('pat');
    if (await this.secrets.get(GITHUB_OAUTH_TOKEN_KEY)) methods.push('oauth');
    return methods;
  }

  private async validatePat(pat: string): Promise<string | undefined> {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) throw new UnauthorizedException('Invalid GitHub PAT');
    const data = await res.json() as { login: string };
    return data.login;
  }

  private async validateToken(token: string): Promise<string | undefined> {
    return this.validatePat(token);
  }
}
