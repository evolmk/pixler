export type MachineEvent =
  | { type: 'START'; ticketId?: string }
  | { type: 'PLAN_DONE' }
  | { type: 'REVIEW_APPROVED' }
  | { type: 'REVIEW_REJECTED'; critique: string }
  | { type: 'PLAN_APPROVED' }
  | { type: 'PLAN_REJECTED'; note?: string }
  | { type: 'EXEC_DONE' }
  | { type: 'VALIDATION_DONE' }
  | { type: 'VALIDATION_APPROVED' }
  | { type: 'VALIDATION_REJECTED' }
  | { type: 'PR_APPROVED' }
  | { type: 'PR_OPENED'; prUrl: string }
  | { type: 'INTERRUPT' }
  | { type: 'RESUME' }
  | { type: 'ERROR'; error: string };

export type SideEffect =
  | { type: 'RUN_PLANNER' }
  | { type: 'RUN_REVIEWER' }
  | { type: 'RUN_EXECUTOR' }
  | { type: 'RUN_VALIDATOR' }
  | { type: 'OPEN_PR' }
  | { type: 'NOTIFY_GATE'; gate: 'plan' | 'validation' | 'pr' }
  | { type: 'NOTIFY_PAUSED'; rejectionCount: number }
  | { type: 'NOTIFY_DONE'; prUrl: string }
  | { type: 'KILL_AGENT' };
