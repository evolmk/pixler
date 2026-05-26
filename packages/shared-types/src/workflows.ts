export interface WorkflowStepDto {
  id: string;
  label: string;
  type: string;
  model?: string;
}

export interface WorkflowDefDto {
  name: string;
  description?: string;
  version?: number;
  source: 'builtin' | 'user' | 'repo';
  steps: WorkflowStepDto[];
  archived?: boolean;
}

export interface WorkflowStepStatusDto {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed' | 'awaiting_approval' | 'awaiting_run';
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface WorkflowStatusDto {
  workflowName: string;
  currentStepId: string | null;
  steps: WorkflowStepStatusDto[];
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  runId?: string;
  persisted?: boolean;
}

export interface WorkflowRunDto {
  id: string;
  workspaceId: string;
  workflowName: string;
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  currentStepIndex: number;
  context: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
  attempts?: WorkflowStepAttemptDto[];
}

export interface WorkflowStepAttemptDto {
  id: string;
  runId: string;
  stepId: string;
  attemptNo: number;
  addedContext?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  checkpointId?: string;
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface RetryStepDto {
  stepId: string;
  addedContext?: string;
  restoreCheckpoint?: boolean;
}

export interface AddContextDto {
  stepId: string;
  context: string;
}

export interface SaveWorkflowDto {
  yaml: string;
}
