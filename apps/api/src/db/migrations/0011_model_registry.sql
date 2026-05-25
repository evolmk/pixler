CREATE TABLE IF NOT EXISTS model_registry (
  provider TEXT PRIMARY KEY,
  registry_json TEXT NOT NULL,
  probed_at INTEGER NOT NULL
);
UPDATE meta SET value = '11' WHERE key = 'schema_version';
