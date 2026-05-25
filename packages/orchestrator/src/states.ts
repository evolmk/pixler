export type AgentPhase =
  | 'idle'
  | 'planning'
  | 'reviewing'
  | 'awaiting_plan_approval'
  | 'executing'
  | 'validating'
  | 'awaiting_validation_approval'
  | 'awaiting_pr_approval'
  | 'pr_open'
  | 'done'
  | 'paused'
  | 'error';

export const TERMINAL_PHASES = new Set<AgentPhase>(['done', 'error']);

export const INTERRUPTIBLE_PHASES = new Set<AgentPhase>([
  'planning',
  'reviewing',
  'executing',
  'validating',
]);

export const GATE_PHASES = new Set<AgentPhase>([
  'awaiting_plan_approval',
  'awaiting_validation_approval',
  'awaiting_pr_approval',
]);
