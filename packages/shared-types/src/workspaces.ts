export type WorkspaceState = 'pending' | 'setting_up' | 'ready' | 'error' | 'archived';
export type WorkspaceMode = 'chat' | 'terminal';
export type TicketSource = 'linear' | 'github';

export interface Workspace {
  id: string;
  project_id: string;
  name: string;
  state: WorkspaceState;
  mode: WorkspaceMode;
  branch: string | null;
  worktree_path: string | null;
  port: number | null;
  ticket_id: string | null;
  ticket_source: TicketSource | null;
  color_name: string | null;
  pinned: boolean;
  archived_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface CreateWorkspaceDto {
  projectId: string;
  name?: string;
  ticketId?: string;
  ticketSource?: TicketSource;
  mode?: WorkspaceMode;
}

export interface PatchWorkspaceDto {
  name?: string;
  pinned?: boolean;
}
