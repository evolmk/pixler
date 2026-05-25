export interface LinearTicket {
  id: string;
  project_id: string;
  identifier: string;
  title: string;
  description: string | null;
  state_name: string;
  state_type: 'unstarted' | 'started' | 'completed' | 'cancelled' | 'triage';
  priority: number;
  assignee_name: string | null;
  label_name: string | null;
  url: string;
  created_at_linear: number;
  updated_at_linear: number;
  synced_at: number;
}

export interface LinearStatusDto {
  connected: boolean;
  viewerName?: string;
  viewerEmail?: string;
  organization?: string;
}

export interface LinearTeamDto {
  id: string;
  name: string;
  key: string;
}

export interface LinearProjectDto {
  id: string;
  name: string;
  slug: string;
}

export interface ConnectLinearDto {
  pat: string;
}
