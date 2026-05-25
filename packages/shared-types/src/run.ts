export type RunState = 'stopped' | 'starting' | 'running' | 'ready' | 'stopping' | 'error';

export interface RunStatus {
  workspaceId: string;
  state: RunState;
  pid: number | null;
  port: number | null;
  startedAt: number | null;
  readyAt: number | null;
  exitCode: number | null;
  logs: string[];
}

export interface StartRunDto {
  readyPattern?: string;
}
