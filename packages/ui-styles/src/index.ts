export type { ThemeDefinition, ThemePalette, ThemeName, ThemeMode } from './types';
export { forest } from './themes/forest';
export { graphite } from './themes/graphite';

import { forest } from './themes/forest';
import { graphite } from './themes/graphite';
import type { ThemeDefinition, ThemeName } from './types';

export const themes: Record<ThemeName, ThemeDefinition> = {
  forest,
  graphite,
};

export const themeNames: ThemeName[] = ['forest', 'graphite'];

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
