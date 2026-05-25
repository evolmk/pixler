export type ActivityScope = 'global' | 'workspace' | 'project';
export type ActivitySeverity = 'info' | 'success' | 'warning' | 'error' | 'hint';

export type ActivityKind =
  | 'plan.ready'
  | 'approval.needed'
  | 'agent.stuck'
  | 'agent.error'
  | 'agent.done'
  | 'pr.opened'
  | 'pr.checks.failed'
  | 'pr.checks.passed'
  | 'pr.merged'
  | 'workspace.archived'
  | 'context.spike'
  | 'custom';

export interface Activity {
  id: string;
  scope: ActivityScope;
  scope_id: string | null;
  kind: ActivityKind;
  title: string;
  body: string;
  severity: ActivitySeverity;
  seen: boolean;
  created_at: number;
}

export interface RecordActivityDto {
  scope?: ActivityScope;
  scope_id?: string;
  kind: ActivityKind;
  title: string;
  body?: string;
  severity?: ActivitySeverity;
}

export interface MarkSeenDto {
  ids: string[];
}

export interface ActivitiesPage {
  activities: Activity[];
  unseenCount: number;
}
