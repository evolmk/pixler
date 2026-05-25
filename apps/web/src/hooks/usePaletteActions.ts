import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { loadKeyboard, type KeyPreset } from '../lib/palette/keyboard';
import {
  Palette,
  Keyboard,
  Settings,
  Sun,
  Moon,
  Monitor,
  Laptop,
  Trees,
  Coffee,
  Waves,
  Sunset,
  Snowflake,
  Flower,
  Zap,
  Square,
  ToggleLeft,
  GitMerge,
  Terminal,
  Globe,
  Timer,
} from 'lucide-react';
import { registerAction, unregisterAction } from '../lib/palette/registry';
import { useLayoutStore } from '../stores/layout';
import { useThemeStore } from '../stores/theme';
import { useSetting } from './useSetting';
import { useTakeCheckpoint } from './useCheckpoints';
import type { ThemeMode, ThemeName } from '@pixler/ui-styles';
import { themeNames } from '@pixler/ui-styles';

const THEME_ICONS: Record<ThemeName, typeof Palette> = {
  forest: Trees,
  graphite: Square,
  catppuccin: Coffee,
  'tokyo-night': Zap,
  nord: Snowflake,
  'rose-pine': Flower,
  solarized: Sunset,
  mono: Square,
};

const THEME_LABELS: Record<ThemeName, string> = {
  forest: 'Forest',
  graphite: 'Graphite',
  catppuccin: 'Catppuccin',
  'tokyo-night': 'Tokyo Night',
  nord: 'Nord',
  'rose-pine': 'Rosé Pine',
  solarized: 'Solarized',
  mono: 'Mono',
};

export function usePaletteActions() {
  const setSettingsOpen = useLayoutStore((s) => s.setSettingsOpen);
  const setNewWorkspaceOpen = useLayoutStore((s) => s.setNewWorkspaceOpen);
  const toggleBigTerminal = useLayoutStore((s) => s.toggleBigTerminal);

  const { theme: currentTheme, mode: currentMode, setTheme, setMode } = useThemeStore();

  const { set: persistTheme } = useSetting<ThemeName>('appearance.theme');
  const { set: persistMode } = useSetting<ThemeMode>('appearance.mode');
  const { value: autoMerge, set: setAutoMerge } = useSetting<boolean>('git.autoMerge');
  const { value: copyOnSelect, set: setCopyOnSelect } = useSetting<boolean>('terminal.copyOnSelect');
  const { value: pasteWarning, set: setPasteWarning } = useSetting<boolean>('terminal.pasteWarning');
  const { value: telemetry, set: setTelemetry } = useSetting<boolean>('telemetry.enabled');
  const { value: kbPreset = 'default' } = useSetting<string>('keyboard.preset');
  const { value: kbBindings = {} } = useSetting<Record<string, string>>('keyboard.bindings');

  // Initialize keyboard registry from persisted settings
  useEffect(() => {
    loadKeyboard((kbPreset as KeyPreset) ?? 'default', (kbBindings as Record<string, string>) ?? {});
  }, [kbPreset, kbBindings]);

  const params = useParams({ strict: false }) as { projectId?: string; workspaceId?: string };
  const projectId = params.projectId;
  const workspaceId = params.workspaceId;
  const navigate = useNavigate();
  const takeCheckpoint = useTakeCheckpoint(workspaceId);

  const handleTheme = useCallback(
    (name: ThemeName) => {
      setTheme(name);
      persistTheme(name);
    },
    [setTheme, persistTheme],
  );

  const handleMode = useCallback(
    (m: ThemeMode) => {
      setMode(m);
      persistMode(m);
    },
    [setMode, persistMode],
  );

  useEffect(() => {
    // — Actions group —
    registerAction({
      id: 'app.open-settings',
      title: 'Open Settings',
      group: 'actions',
      keywords: ['settings', 'preferences', 'config'],
      icon: Settings,
      shortcut: '⌘,',
      perform: () => setSettingsOpen(true, 'appearance'),
    });

    registerAction({
      id: 'app.open-settings-keyboard',
      title: 'Open Keyboard Settings',
      group: 'actions',
      keywords: ['keyboard', 'shortcuts', 'hotkeys', 'bindings'],
      icon: Keyboard,
      perform: () => setSettingsOpen(true, 'keyboard'),
    });

    registerAction({
      id: 'app.open-settings-appearance',
      title: 'Open Appearance Settings',
      group: 'actions',
      keywords: ['appearance', 'theme', 'color', 'style'],
      icon: Palette,
      perform: () => setSettingsOpen(true, 'appearance'),
    });

    registerAction({
      id: 'app.open-settings-usage',
      title: 'Open Token Usage Panel',
      group: 'actions',
      keywords: ['usage', 'tokens', 'cost', 'spending', 'rate limit'],
      icon: Waves,
      perform: () => setSettingsOpen(true, 'usage'),
    });

    registerAction({
      id: 'workspace.new',
      title: 'New Workspace',
      group: 'actions',
      keywords: ['workspace', 'create', 'new', 'add'],
      when: () => !!projectId,
      perform: () => setNewWorkspaceOpen(true),
    });

    registerAction({
      id: 'layout.toggle-big-terminal',
      title: 'Toggle Big Terminal',
      group: 'actions',
      keywords: ['terminal', 'expand', 'big', 'fullscreen'],
      icon: Terminal,
      perform: () => toggleBigTerminal(),
    });

    registerAction({
      id: 'workspace.take-checkpoint',
      title: 'Take Checkpoint',
      group: 'actions',
      keywords: ['checkpoint', 'snapshot', 'rollback', 'save'],
      icon: Timer,
      when: () => !!workspaceId,
      perform: () => takeCheckpoint.mutate({}),
    });

    // — Mode actions —
    registerAction({
      id: 'theme.mode.light',
      title: 'Switch to Light Mode',
      group: 'actions',
      keywords: ['light', 'mode', 'theme', 'appearance'],
      icon: Sun,
      perform: () => handleMode('light'),
    });

    registerAction({
      id: 'theme.mode.dark',
      title: 'Switch to Dark Mode',
      group: 'actions',
      keywords: ['dark', 'mode', 'theme', 'appearance'],
      icon: Moon,
      perform: () => handleMode('dark'),
    });

    registerAction({
      id: 'theme.mode.system',
      title: 'Use System Appearance',
      group: 'actions',
      keywords: ['system', 'mode', 'theme', 'auto'],
      icon: Monitor,
      perform: () => handleMode('system'),
    });

    // — Theme switch actions —
    for (const name of themeNames) {
      registerAction({
        id: `theme.color.${name}`,
        title: `Switch to ${THEME_LABELS[name]} Theme`,
        group: 'actions',
        keywords: ['theme', 'color', name, THEME_LABELS[name].toLowerCase()],
        icon: THEME_ICONS[name] ?? Palette,
        perform: () => handleTheme(name),
      });
    }

    // — Settings group (toggleable boolean settings) —
    registerAction({
      id: 'setting.git.autoMerge',
      title: 'Toggle Auto-Merge PRs',
      group: 'settings',
      keywords: ['auto-merge', 'git', 'pr', 'merge', 'pull request'],
      icon: GitMerge,
      perform: () => setAutoMerge(!autoMerge),
    });

    registerAction({
      id: 'setting.terminal.copyOnSelect',
      title: 'Toggle Copy-on-Select (Terminal)',
      group: 'settings',
      keywords: ['copy', 'select', 'terminal', 'clipboard'],
      icon: Terminal,
      perform: () => setCopyOnSelect(!copyOnSelect),
    });

    registerAction({
      id: 'setting.terminal.pasteWarning',
      title: 'Toggle Paste Warning (Terminal)',
      group: 'settings',
      keywords: ['paste', 'warning', 'terminal', 'multiline'],
      icon: Terminal,
      perform: () => setPasteWarning(!pasteWarning),
    });

    registerAction({
      id: 'setting.telemetry',
      title: 'Toggle Telemetry',
      group: 'settings',
      keywords: ['telemetry', 'analytics', 'tracking', 'privacy'],
      icon: Globe,
      perform: () => setTelemetry(!telemetry),
    });

    return () => {
      const ids = [
        'app.open-settings',
        'app.open-settings-keyboard',
        'app.open-settings-appearance',
        'app.open-settings-usage',
        'workspace.new',
        'layout.toggle-big-terminal',
        'theme.mode.light',
        'theme.mode.dark',
        'theme.mode.system',
        'setting.git.autoMerge',
        'setting.terminal.copyOnSelect',
        'setting.terminal.pasteWarning',
        'setting.telemetry',
        'workspace.take-checkpoint',
        ...themeNames.map((n) => `theme.color.${n}`),
      ];
      for (const id of ids) unregisterAction(id);
    };
  }, [
    setSettingsOpen,
    setNewWorkspaceOpen,
    toggleBigTerminal,
    handleTheme,
    handleMode,
    projectId,
    workspaceId,
    navigate,
    autoMerge,
    setAutoMerge,
    copyOnSelect,
    setCopyOnSelect,
    pasteWarning,
    setPasteWarning,
    telemetry,
    setTelemetry,
    takeCheckpoint,
  ]);
}
