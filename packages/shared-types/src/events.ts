export type AppEvent =
  | { type: 'pixler.boot'; version: string; timestamp: number }
  | { type: 'pixler.shutdown'; timestamp: number };

export type WorkspaceEvent =
  | { type: 'workspace.created'; workspaceId: string; timestamp: number }
  | { type: 'agent.output'; workspaceId: string; data: string; timestamp: number }
  | { type: 'agent.state-changed'; workspaceId: string; from: string; to: string; timestamp: number };

export type SettingsEvent = { type: 'settings.changed'; key: string; scope: string; timestamp: number };
