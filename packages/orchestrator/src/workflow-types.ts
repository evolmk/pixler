export type StepType =
  | 'builtin:review_issue'
  | 'builtin:create_plan'
  | 'builtin:review_plan'
  | 'builtin:run_plan'
  | 'builtin:qa_review'
  | 'builtin:open_pr'
  | 'approval'
  | 'prompt'
  | 'bash';

export type OnError = 'fail' | 'skip' | 'retry';
export type OnFindings = 'prompt_user' | 'auto_fix' | 'skip';
export type StepStatus = 'pending' | 'running' | 'completed' | 'skipped' | 'failed' | 'awaiting_approval';

export interface RetryConfig {
  max_attempts: number;
  delay_ms?: number;
}

export interface WorkflowStep {
  id: string;
  type: StepType;
  label?: string;
  model?: string;
  provider?: string;
  message?: string;
  prompt?: string;
  skip_if?: string;
  on_error?: OnError;
  on_findings?: OnFindings;
  retry?: RetryConfig;
}

export interface WorkflowDef {
  name: string;
  description?: string;
  version?: number;
  model?: string;
  provider?: string;
  archived?: boolean;
  steps: WorkflowStep[];
}

export interface WorkflowContext {
  issue: {
    id: string;
    title: string;
    label?: string;
    project?: string;
    description?: string | null;
    planLinked?: boolean;
  };
  workflow: {
    skipPlanReview?: boolean;
  };
  steps: Record<string, { output?: unknown; status: 'pending' | 'skipped' | 'completed' | 'failed' }>;
}

export interface StepState {
  id: string;
  label: string;
  type: StepType;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface WorkflowRunState {
  workflowName: string;
  currentStepId: string | null;
  steps: StepState[];
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
}

export type StepEventType = 'step:start' | 'step:complete' | 'step:error' | 'step:skipped' | 'step:approval';

export interface StepEvent {
  type: StepEventType;
  stepId: string;
  label?: string;
  payload?: unknown;
  error?: string;
}

export type StepExecutor = (
  step: WorkflowStep,
  context: WorkflowContext,
) => Promise<unknown>;
