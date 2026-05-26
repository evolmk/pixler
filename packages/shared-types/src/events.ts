export type AppEvent =
  | { type: 'pixler.boot'; version: string; timestamp: number }
  | { type: 'pixler.shutdown'; timestamp: number }
  | { type: 'project.clone-progress'; projectId: string; pct: number; line: string; timestamp: number }
  | { type: 'project.clone-complete'; projectId: string; timestamp: number }
  | { type: 'project.clone-error'; projectId: string; error: string; timestamp: number }
  | { type: 'project.team-config-diff'; projectId: string; diff: { key: string; teamValue: unknown; localValue: unknown }[]; timestamp: number }
  | { type: 'activity.appended'; activityId: string; scope: string; scopeId: string | null; kind: string; severity: string; timestamp: number }
  | { type: 'deeplink.received'; url: string; resource: string; id: string; timestamp: number };

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
  | { type: 'plan.big-plan-prompt'; workspaceId: string; taskCount: number; charCount: number; timestamp: number }
  | { type: 'checkpoint.taken'; workspaceId: string; checkpointId: string; label: string; timestamp: number }
  | { type: 'checkpoint.rolled-back'; workspaceId: string; checkpointId: string; timestamp: number }
  | { type: 'activity.appended'; workspaceId: string; activityId: string; kind: string; severity: string; timestamp: number };

export type SettingsEvent = { type: 'settings.changed'; key: string; scope: string; timestamp: number };

export type WorkflowEvent =
  | { type: 'workflow.step'; workspaceId: string; stepEventType: string; stepId: string; label?: string; payload?: unknown; error?: string; timestamp: number }
  | { type: 'workflow.step-prompt'; workspaceId: string; stepId: string; stepLabel: string; prompt: string; timestamp: number }
  | { type: 'workflow.step-advanced'; workspaceId: string; stepId: string; status: string; timestamp: number }
  | { type: 'workflow.run-updated'; workspaceId: string; runId: string; status: string; currentStepIndex: number; timestamp: number };
