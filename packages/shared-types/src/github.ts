export interface GithubAuthStatus {
  authed: boolean;
  authMethod?: 'pat' | 'oauth' | 'cli' | null;
  storedMethods?: Array<'pat' | 'oauth'>;
  username?: string;
  hostname?: string;
  scopes?: string[];
  error?: string;
}

export interface GithubRepoInfo {
  nameWithOwner: string;
  defaultBranchRef: string;
  url: string;
  isPrivate: boolean;
}

export interface PullRequest {
  number: number;
  title: string;
  url: string;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  isDraft: boolean;
  headRefName: string;
  baseRefName: string;
  body: string;
  createdAt: string;
  mergedAt: string | null;
  mergeable?: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';
}

export interface PrCheck {
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | 'timed_out' | null;
  startedAt: string | null;
  completedAt: string | null;
  detailsUrl: string | null;
}

export interface PrComment {
  id: number;
  author: string;
  body: string;
  createdAt: string;
  url: string;
}

export interface CreatePrDto {
  title?: string;
  body?: string;
  draft?: boolean;
  base?: string;
}

export interface MergePrDto {
  strategy: 'merge' | 'squash' | 'rebase';
}
