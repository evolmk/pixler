export type PlanStorageMode = 'file' | 'inline' | 'attachment' | 'auto';
export type PlanStatus = 'in_progress' | 'done';

export interface PlanFrontmatter {
  ticket?: string;
  storage: PlanStorageMode;
  revision: number;
  status: PlanStatus;
  linear_url?: string;
  branch?: string;
  workspace?: string;
  created_by?: string;
  created_at?: string;
  planner?: string;
  reviewer?: string;
  linear_attachment_current?: string;
  linear_attachment_previous?: string;
}

export interface Plan {
  id: string;
  workspaceId: string;
  ticketId?: string;
  storage: PlanStorageMode;
  revision: number;
  status: PlanStatus;
  content: string;
  linearUrl?: string;
  linearAttachmentCurrent?: string;
  linearAttachmentPrevious?: string;
  subIssueMap: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

export interface SavePlanDto {
  content: string;
  mode?: PlanStorageMode;
}

export interface RevisePlanDto {
  content: string;
}

export interface PlanHistoryEntry {
  revision: number;
  updatedAt: number;
  storage: PlanStorageMode;
}
