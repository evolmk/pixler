CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY NOT NULL,
  workspace_id TEXT NOT NULL,
  ticket_id TEXT,
  storage TEXT NOT NULL DEFAULT 'file',
  revision INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'in_progress',
  content TEXT NOT NULL DEFAULT '',
  linear_url TEXT,
  linear_attachment_current TEXT,
  linear_attachment_previous TEXT,
  sub_issue_map TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_plans_workspace ON plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_plans_ticket ON plans(ticket_id);

UPDATE meta SET value = '6' WHERE key = 'schema_version';
