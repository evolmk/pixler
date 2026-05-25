ALTER TABLE projects ADD COLUMN default_branch TEXT NOT NULL DEFAULT 'main';
ALTER TABLE projects ADD COLUMN package_manager TEXT NOT NULL DEFAULT 'npm';
ALTER TABLE projects ADD COLUMN icon_path TEXT;
ALTER TABLE projects ADD COLUMN cloned_by_pixler INTEGER NOT NULL DEFAULT 0;

UPDATE meta SET value = '2' WHERE key = 'schema_version';
