-- Extend workspaces table (initially scaffolded in 0001_init.sql)
ALTER TABLE workspaces RENAME COLUMN status TO state;

ALTER TABLE workspaces ADD COLUMN mode TEXT NOT NULL DEFAULT 'chat';
ALTER TABLE workspaces ADD COLUMN branch TEXT;
ALTER TABLE workspaces ADD COLUMN worktree_path TEXT;
ALTER TABLE workspaces ADD COLUMN port INTEGER;
ALTER TABLE workspaces ADD COLUMN ticket_id TEXT;
ALTER TABLE workspaces ADD COLUMN ticket_source TEXT;
ALTER TABLE workspaces ADD COLUMN color_name TEXT;
ALTER TABLE workspaces ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0;
ALTER TABLE workspaces ADD COLUMN archived_at INTEGER;

UPDATE meta SET value = '3' WHERE key = 'schema_version';
