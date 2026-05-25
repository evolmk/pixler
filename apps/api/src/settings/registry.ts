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
  { key: 'appearance.density', type: 'string', default: 'comfortable', scopes: ['global'], label: 'Density', description: 'UI density: compact | comfortable | spacious' },
  { key: 'appearance.animationLevel', type: 'string', default: 'full', scopes: ['global'], label: 'Animation', description: 'Animation level' },
  { key: 'linear.pat', type: 'string', default: '', scopes: ['global'], label: 'Linear PAT', description: 'Personal access token for Linear' },
  { key: 'linear.workspace', type: 'string', default: '', scopes: ['global'], label: 'Linear Workspace', description: 'Linear workspace slug' },
  { key: 'linear.team', type: 'string', default: '', scopes: ['global', 'project'], label: 'Linear Team', description: 'Default Linear team key' },
  { key: 'linear.syncIntervalMs', type: 'number', default: 30000, scopes: ['global'], label: 'Sync Interval', description: 'Linear sync interval in ms' },
  { key: 'linear.stateMap', type: 'json', default: {}, scopes: ['global', 'project'], label: 'Linear State Map', description: 'Maps Pixler states (todo/in_progress/in_review/done) to Linear state names' },
  { key: 'linear.agentMode', type: 'string', default: 'cli', scopes: ['global', 'project'], label: 'Linear Agent Mode', description: 'How agents access Linear: cli | mcp | both' },
  { key: 'plans.defaultStorage', type: 'string', default: 'auto', scopes: ['global', 'project'], label: 'Plan Storage', description: 'Plan storage mode' },
  { key: 'plans.fileDir', type: 'string', default: 'docs/plans', scopes: ['global', 'project'], label: 'Plans Directory', description: 'Relative path for plan files' },
  { key: 'models.planner', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Planner', description: 'CLI for planning' },
  { key: 'models.reviewer', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Reviewer', description: 'CLI for review' },
  { key: 'models.executor', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Executor', description: 'CLI for execution' },
  { key: 'git.branchTemplate', type: 'string', default: '{ticket}-{slug}', scopes: ['global', 'project'], label: 'Branch Template', description: 'Template for branch names' },
  { key: 'git.baseBranch', type: 'string', default: 'main', scopes: ['global', 'project'], label: 'Base Branch', description: 'Default base branch' },
  { key: 'git.autoMerge', type: 'boolean', default: false, scopes: ['global', 'project'], label: 'Auto-Merge', description: 'Auto-merge passing PRs' },
  { key: 'git.mergeStrategy', type: 'string', default: 'squash', scopes: ['global', 'project'], label: 'Merge Strategy', description: 'PR merge strategy: merge | squash | rebase' },
  { key: 'workspaces.maxParallel', type: 'number', default: 3, scopes: ['global'], label: 'Max Parallel', description: 'Max simultaneous workspaces' },
  { key: 'providers.claude', type: 'string', default: 'claude', scopes: ['global'], label: 'Claude Path', description: 'Path to claude CLI' },
  { key: 'providers.codex', type: 'string', default: 'codex', scopes: ['global'], label: 'Codex Path', description: 'Path to codex CLI' },
  { key: 'providers.gemini', type: 'string', default: 'gemini', scopes: ['global'], label: 'Gemini Path', description: 'Path to gemini CLI' },
  { key: 'providers.gh', type: 'string', default: 'gh', scopes: ['global'], label: 'GitHub CLI', description: 'Path to gh CLI' },
  { key: 'telemetry.enabled', type: 'boolean', default: true, scopes: ['global'], label: 'Telemetry', description: 'Enable anonymous telemetry' },
  { key: 'terminal.shell', type: 'string', default: '', scopes: ['global'], label: 'Shell', description: 'Override shell path (defaults to $SHELL)' },
  { key: 'terminal.fontFamily', type: 'string', default: '', scopes: ['global'], label: 'Font Family', description: 'Terminal font family' },
  { key: 'terminal.fontSize', type: 'number', default: 13, scopes: ['global'], label: 'Font Size', description: 'Terminal font size in px' },
  { key: 'terminal.cursorStyle', type: 'string', default: 'block', scopes: ['global'], label: 'Cursor Style', description: 'block | underline | bar' },
  { key: 'terminal.scrollback', type: 'number', default: 5000, scopes: ['global'], label: 'Scrollback', description: 'Lines of scrollback history' },
  { key: 'terminal.copyOnSelect', type: 'boolean', default: false, scopes: ['global'], label: 'Copy on Select', description: 'Copy selection to clipboard automatically' },
  { key: 'terminal.pasteWarning', type: 'boolean', default: true, scopes: ['global'], label: 'Paste Warning', description: 'Warn when pasting multi-line content' },
  { key: 'layout.paneSizes', type: 'json', default: { outer: [22, 78], inner: [62, 38] }, scopes: ['global'], label: 'Pane Sizes', description: '3-pane split sizes: outer [sidebar, rest], inner [center, right]' },
  { key: 'layout.bigTerminal', type: 'boolean', default: false, scopes: ['global'], label: 'Big Terminal', description: 'Right pane expanded full-bleed' },
  { key: 'diff.wordWrap', type: 'string', default: 'off', scopes: ['global'], label: 'Diff Word Wrap', description: 'Word wrap in diff viewer: off | on' },
  { key: 'diff.renderWhitespace', type: 'string', default: 'none', scopes: ['global'], label: 'Diff Whitespace', description: 'Render whitespace in diff viewer: none | boundary | all' },
  { key: 'ide.default', type: 'string', default: '', scopes: ['global'], label: 'Default IDE', description: 'IDE id to use by default (vscode, cursor, zed, etc.)' },
  { key: 'onboarding.completedAt', type: 'number', default: 0, scopes: ['global'], label: 'Onboarding Completed At', description: 'Unix timestamp when onboarding was completed (0 = not complete)' },
  { key: 'onboarding.currentStep', type: 'number', default: 1, scopes: ['global'], label: 'Onboarding Current Step', description: 'Last active onboarding step (1–5)' },
];
