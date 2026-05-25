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
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed' | 'awaiting_approval';
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface WorkflowStatusDto {
  workflowName: string;
  currentStepId: string | null;
  steps: WorkflowStepStatusDto[];
  status: 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
}

export interface SaveWorkflowDto {
  yaml: string;
}
