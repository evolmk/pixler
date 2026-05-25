export type { ThemeDefinition, ThemePalette, ThemeName, ThemeMode } from './types';
export { forest } from './themes/forest';
export { graphite } from './themes/graphite';
export { catppuccin } from './themes/catppuccin';
export { tokyoNight } from './themes/tokyo-night';
export { nord } from './themes/nord';
export { rosePine } from './themes/rose-pine';
export { solarized } from './themes/solarized';
export { mono } from './themes/mono';

import { forest } from './themes/forest';
import { graphite } from './themes/graphite';
import { catppuccin } from './themes/catppuccin';
import { tokyoNight } from './themes/tokyo-night';
import { nord } from './themes/nord';
import { rosePine } from './themes/rose-pine';
import { solarized } from './themes/solarized';
import { mono } from './themes/mono';
import type { ThemeDefinition, ThemeName } from './types';

export const themes: Record<ThemeName, ThemeDefinition> = {
  forest,
  graphite,
  catppuccin,
  'tokyo-night': tokyoNight,
  nord,
  'rose-pine': rosePine,
  solarized,
  mono,
};

export const themeNames: ThemeName[] = ['forest', 'graphite', 'catppuccin', 'tokyo-night', 'nord', 'rose-pine', 'solarized', 'mono'];

export function applyTheme(name: ThemeName, mode: 'light' | 'dark'): void {
  const html = document.documentElement;
  const theme = themes[name];

  if (theme.cssScheme) {
    html.setAttribute('data-color-scheme', theme.cssScheme);
  } else {
    html.removeAttribute('data-color-scheme');
  }

  if (mode === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}
