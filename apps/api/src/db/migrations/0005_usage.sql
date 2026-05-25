CREATE TABLE IF NOT EXISTS usage_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cache_read_tokens INTEGER NOT NULL DEFAULT 0,
  cache_write_tokens INTEGER NOT NULL DEFAULT 0,
  model TEXT,
  workspace_id TEXT,
  session_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_usage_snapshots_ts ON usage_snapshots(ts);
CREATE INDEX IF NOT EXISTS idx_usage_snapshots_workspace ON usage_snapshots(workspace_id);

UPDATE meta SET value = '5' WHERE key = 'schema_version';
