CREATE TABLE IF NOT EXISTS checkpoints (
  id TEXT PRIMARY KEY NOT NULL,
  workspace_id TEXT NOT NULL,
  label TEXT NOT NULL,
  trigger TEXT NOT NULL DEFAULT 'manual',
  stash_ref TEXT,
  plan_content TEXT,
  chat_snapshot TEXT NOT NULL DEFAULT '[]',
  file_count INTEGER NOT NULL DEFAULT 0,
  line_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_checkpoints_workspace ON checkpoints(workspace_id);
CREATE INDEX IF NOT EXISTS idx_checkpoints_created ON checkpoints(workspace_id, created_at DESC);

UPDATE meta SET value = '7' WHERE key = 'schema_version';
