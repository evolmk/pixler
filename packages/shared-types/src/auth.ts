export type AuthMethod = 'pat' | 'oauth' | 'cli';
export type AuthService = 'linear' | 'github';

export interface OAuthInitDto {
  url: string;
  state: string;
}

export interface ConnectGithubPATDto {
  pat: string;
}

export interface DisconnectAuthDto {
  method: AuthMethod;
}
