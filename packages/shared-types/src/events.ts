export type AppEvent =
  | { type: 'pixler.boot'; version: string; timestamp: number }
  | { type: 'pixler.shutdown'; timestamp: number }
  | { type: 'project.clone-progress'; projectId: string; pct: number; line: string; timestamp: number }
  | { type: 'project.clone-complete'; projectId: string; timestamp: number }
  | { type: 'project.clone-error'; projectId: string; error: string; timestamp: number }
  | { type: 'project.team-config-diff'; projectId: string; diff: { key: string; teamValue: unknown; localValue: unknown }[]; timestamp: number };

export type WorkspaceEvent =
  | { type: 'workspace.created'; workspaceId: string; timestamp: number }
  | { type: 'workspace.setup-log'; workspaceId: string; line: string; timestamp: number }
  | { type: 'workspace.state-changed'; workspaceId: string; from: string; to: string; timestamp: number }
  | { type: 'agent.output'; workspaceId: string; data: string; timestamp: number }
  | { type: 'agent.state-changed'; workspaceId: string; from: string; to: string; timestamp: number }
  | { type: 'agent.error'; workspaceId: string; error: string; timestamp: number }
  | { type: 'agent.gate'; workspaceId: string; gate: 'plan' | 'validation' | 'pr'; timestamp: number }
  | { type: 'agent.paused'; workspaceId: string; rejectionCount: number; timestamp: number }
  | { type: 'agent.done'; workspaceId: string; prUrl: string; timestamp: number }
  | { type: 'plan.big-plan-prompt'; workspaceId: string; taskCount: number; charCount: number; timestamp: number };

export type SettingsEvent = { type: 'settings.changed'; key: string; scope: string; timestamp: number };
