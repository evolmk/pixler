import type { ThemeName, ThemeMode } from '@pixler/ui-styles';

export type ShikiTheme = string;

const SHIKI_THEME_MAP: Record<ThemeName, { light: ShikiTheme; dark: ShikiTheme }> = {
  forest: { light: 'github-light', dark: 'github-dark' },
  graphite: { light: 'github-light', dark: 'github-dark-dimmed' },
  catppuccin: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' },
  'tokyo-night': { light: 'tokyo-night', dark: 'tokyo-night' },
  nord: { light: 'nord', dark: 'nord' },
  'rose-pine': { light: 'rose-pine-dawn', dark: 'rose-pine' },
  solarized: { light: 'solarized-light', dark: 'solarized-dark' },
  mono: { light: 'github-light', dark: 'github-dark' },
};

export function getShikiTheme(name: ThemeName, mode: ThemeMode, resolvedMode: 'light' | 'dark'): ShikiTheme {
  const effective = mode === 'system' ? resolvedMode : mode;
  return SHIKI_THEME_MAP[name]?.[effective] ?? (effective === 'dark' ? 'github-dark' : 'github-light');
}
