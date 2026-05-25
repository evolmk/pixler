export type AppEvent =
  | { type: 'pixler.boot'; version: string; timestamp: number }
  | { type: 'pixler.shutdown'; timestamp: number }
  | { type: 'project.clone-progress'; projectId: string; pct: number; line: string; timestamp: number }
  | { type: 'project.clone-complete'; projectId: string; timestamp: number }
  | { type: 'project.clone-error'; projectId: string; error: string; timestamp: number }
  | { type: 'project.team-config-diff'; projectId: string; diff: { key: string; teamValue: unknown; localValue: unknown }[]; timestamp: number };

export type WorkspaceEvent =
  | { type: 'workspace.created'; workspaceId: string; timestamp: number }
  | { type: 'agent.output'; workspaceId: string; data: string; timestamp: number }
  | { type: 'agent.state-changed'; workspaceId: string; from: string; to: string; timestamp: number };

export type SettingsEvent = { type: 'settings.changed'; key: string; scope: string; timestamp: number };
