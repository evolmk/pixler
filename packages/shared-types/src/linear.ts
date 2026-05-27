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
  authMethod?: 'pat' | 'oauth' | null;
  storedMethods?: Array<'pat' | 'oauth'>;
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

export interface LinearIssueSummaryDto {
  id: string;
  identifier: string;
  title: string;
  state: string;
  stateType: string;
  assigneeName: string | null;
}

export interface CreateLinearIssueDto {
  teamId: string;
  projectId?: string;
  title: string;
  description?: string;
}

export interface LinearIssuePageDto {
  nodes: LinearIssueSummaryDto[];
  cursor: string | null;
}

export interface LinearTicketDto {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  state: string;
  stateType: string;
  priority: number;
  url: string;
  assignee: { id: string; name: string } | null;
  labels: Array<{ id: string; name: string; color: string }>;
  createdAt: string;
  updatedAt: string;
}
