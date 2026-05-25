export type CheckpointTrigger = 'manual' | 'before_execution' | 'pre_batch' | 'resolve_conflicts' | 'rebase';

export interface Checkpoint {
  id: string;
  workspaceId: string;
  label: string;
  trigger: CheckpointTrigger;
  stashRef?: string;
  planContent?: string;
  fileCount: number;
  lineCount: number;
  createdAt: number;
}

export interface TakeCheckpointDto {
  label?: string;
}
