CREATE TABLE IF NOT EXISTS workflow_runs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  workflow_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',  -- running | paused | completed | failed | cancelled
  current_step_index INTEGER NOT NULL DEFAULT 0,
  context_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS workflow_step_attempts (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,
  attempt_no INTEGER NOT NULL DEFAULT 1,
  added_context TEXT,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | running | completed | failed | skipped
  checkpoint_id TEXT REFERENCES checkpoints(id) ON DELETE SET NULL,
  started_at INTEGER,
  completed_at INTEGER,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_workspace ON workflow_runs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_step_attempts_run ON workflow_step_attempts(run_id, step_id);

UPDATE meta SET value = '12' WHERE key = 'schema_version';
