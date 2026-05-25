CREATE TABLE IF NOT EXISTS linear_tickets (
  id           TEXT PRIMARY KEY,
  project_id   TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  identifier   TEXT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  state_name   TEXT NOT NULL,
  state_type   TEXT NOT NULL,
  priority     INTEGER NOT NULL DEFAULT 0,
  assignee_name TEXT,
  label_name   TEXT,
  url          TEXT NOT NULL,
  created_at_linear INTEGER NOT NULL,
  updated_at_linear INTEGER NOT NULL,
  synced_at    INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_linear_tickets_project    ON linear_tickets(project_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_linear_tickets_ident ON linear_tickets(project_id, identifier);

UPDATE meta SET value = '4' WHERE key = 'schema_version';
