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
  { key: 'appearance.density', type: 'string', default: 'default', scopes: ['global'], label: 'Density', description: 'UI density (compact, default, comfortable)' },
  { key: 'appearance.animationLevel', type: 'string', default: 'full', scopes: ['global'], label: 'Animation', description: 'Animation level (full, reduced, none)' },

  { key: 'linear.pat', type: 'string', default: '', scopes: ['global'], label: 'Linear PAT', description: 'Personal access token for Linear' },
  { key: 'linear.workspace', type: 'string', default: '', scopes: ['global'], label: 'Linear Workspace', description: 'Linear workspace slug' },
  { key: 'linear.team', type: 'string', default: '', scopes: ['global', 'project'], label: 'Linear Team', description: 'Default Linear team key' },
  { key: 'linear.syncIntervalMs', type: 'number', default: 30000, scopes: ['global'], label: 'Sync Interval', description: 'Linear sync interval in ms' },

  { key: 'plans.defaultStorage', type: 'string', default: 'auto', scopes: ['global', 'project'], label: 'Plan Storage', description: 'Where to store plans (file, inline, attachment, auto)' },
  { key: 'plans.fileDir', type: 'string', default: 'docs/plans', scopes: ['global', 'project'], label: 'Plans Directory', description: 'Relative path for plan files' },

  { key: 'models.planner', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Planner Model', description: 'CLI used for planning' },
  { key: 'models.reviewer', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Reviewer Model', description: 'CLI used for review' },
  { key: 'models.executor', type: 'string', default: 'claude', scopes: ['global', 'project'], label: 'Executor Model', description: 'CLI used for execution' },

  { key: 'git.branchTemplate', type: 'string', default: '{ticket}-{slug}', scopes: ['global', 'project'], label: 'Branch Template', description: 'Template for branch names' },
  { key: 'git.baseBranch', type: 'string', default: 'main', scopes: ['global', 'project'], label: 'Base Branch', description: 'Default base branch' },
  { key: 'git.autoMerge', type: 'boolean', default: false, scopes: ['global', 'project'], label: 'Auto-Merge', description: 'Automatically merge passing PRs' },

  { key: 'workspaces.maxParallel', type: 'number', default: 3, scopes: ['global'], label: 'Max Parallel', description: 'Max simultaneous workspaces' },

  { key: 'providers.claude', type: 'string', default: 'claude', scopes: ['global'], label: 'Claude Path', description: 'Path to claude CLI' },
  { key: 'providers.codex', type: 'string', default: 'codex', scopes: ['global'], label: 'Codex Path', description: 'Path to codex CLI' },
  { key: 'providers.gemini', type: 'string', default: 'gemini', scopes: ['global'], label: 'Gemini Path', description: 'Path to gemini CLI' },
  { key: 'providers.gh', type: 'string', default: 'gh', scopes: ['global'], label: 'GitHub CLI Path', description: 'Path to gh CLI' },

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

  { key: 'notifications.native', type: 'boolean', default: false, scopes: ['global'], label: 'Native Notifications', description: 'Send OS notifications when Pixler is unfocused' },
  { key: 'notifications.dnd.start', type: 'string', default: '', scopes: ['global'], label: 'DnD Start', description: 'Do-not-disturb start time (HH:MM)' },
  { key: 'notifications.dnd.end', type: 'string', default: '', scopes: ['global'], label: 'DnD End', description: 'Do-not-disturb end time (HH:MM)' },
  { key: 'notifications.events.agent.done', type: 'boolean', default: true, scopes: ['global'], label: 'Agent done', description: 'Notify when agent completes' },
  { key: 'notifications.events.agent.error', type: 'boolean', default: true, scopes: ['global'], label: 'Agent error', description: 'Notify on agent errors' },
  { key: 'notifications.events.pr.opened', type: 'boolean', default: true, scopes: ['global'], label: 'PR opened', description: 'Notify when PR is opened' },
  { key: 'notifications.events.pr.checks', type: 'boolean', default: true, scopes: ['global'], label: 'PR checks', description: 'Notify on CI pass/fail' },

  { key: 'integrations.linear.deeplinkOnCreate', type: 'boolean', default: true, scopes: ['global', 'project'], label: 'Post deep link on create', description: 'Post a pixler:// deep link comment to the Linear ticket when a workspace is created' },
];
