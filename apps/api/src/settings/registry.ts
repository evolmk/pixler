export type SettingScope = 'global' | 'project' | 'workspace';

export interface SettingDefinition {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  default: unknown;
  scopes: SettingScope[];
  label: string;
  description: string;
}

export const settingsRegistry: SettingDefinition[] = [
  { key: 'appearance.theme', type: 'string', default: 'forest', scopes: ['global'], label: 'Theme', description: 'Color theme name' },
  { key: 'appearance.mode', type: 'string', default: 'system', scopes: ['global'], label: 'Mode', description: 'Light, dark, or system' },
  { key: 'appearance.density', type: 'string', default: 'default', scopes: ['global'], label: 'Density', description: 'UI density' },
  { key: 'appearance.animationLevel', type: 'string', default: 'full', scopes: ['global'], label: 'Animation', description: 'Animation level' },
  { key: 'linear.pat', type: 'string', default: '', scopes: ['global'], label: 'Linear PAT', description: 'Personal access token for Linear' },
  { key: 'linear.workspace', type: 'string', default: '', scopes: ['global'], label: 'Linear Workspace', description: 'Linear workspace slug' },
  { key: 'linear.team', type: 'string', default: '', scopes: ['global', 'project'], label: 'Linear Team', description: 'Default Linear team key' },
  { key: 'linear.syncIntervalMs', type: 'number', default: 30000, scopes: ['global'], label: 'Sync Interval', description: 'Linear sync interval in ms' },
  { key: 'plans.defaultStorage', type: 'string', default: 'auto', scopes: ['global', 'project'], label: 'Plan Storage', description: 'Plan storage mode' },
  { key: 'plans.fileDir', type: 'string', default: 'docs/plans', scopes: ['global', 'project'], label: 'Plans Directory', description: 'Relative path for plan files' },
  { key: 'models.planner', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Planner', description: 'CLI for planning' },
  { key: 'models.reviewer', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Reviewer', description: 'CLI for review' },
  { key: 'models.executor', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Executor', description: 'CLI for execution' },
  { key: 'git.branchTemplate', type: 'string', default: '{ticket}-{slug}', scopes: ['global', 'project'], label: 'Branch Template', description: 'Template for branch names' },
  { key: 'git.baseBranch', type: 'string', default: 'main', scopes: ['global', 'project'], label: 'Base Branch', description: 'Default base branch' },
  { key: 'git.autoMerge', type: 'boolean', default: false, scopes: ['global', 'project'], label: 'Auto-Merge', description: 'Auto-merge passing PRs' },
  { key: 'workspaces.maxParallel', type: 'number', default: 3, scopes: ['global'], label: 'Max Parallel', description: 'Max simultaneous workspaces' },
  { key: 'providers.claude', type: 'string', default: 'claude', scopes: ['global'], label: 'Claude Path', description: 'Path to claude CLI' },
  { key: 'providers.codex', type: 'string', default: 'codex', scopes: ['global'], label: 'Codex Path', description: 'Path to codex CLI' },
  { key: 'providers.gemini', type: 'string', default: 'gemini', scopes: ['global'], label: 'Gemini Path', description: 'Path to gemini CLI' },
  { key: 'providers.gh', type: 'string', default: 'gh', scopes: ['global'], label: 'GitHub CLI', description: 'Path to gh CLI' },
  { key: 'telemetry.enabled', type: 'boolean', default: true, scopes: ['global'], label: 'Telemetry', description: 'Enable anonymous telemetry' },
  { key: 'layout.paneSizes', type: 'json', default: { outer: [22, 78], inner: [62, 38] }, scopes: ['global'], label: 'Pane Sizes', description: '3-pane split sizes: outer [sidebar, rest], inner [center, right]' },
  { key: 'layout.bigTerminal', type: 'boolean', default: false, scopes: ['global'], label: 'Big Terminal', description: 'Right pane expanded full-bleed' },
];
