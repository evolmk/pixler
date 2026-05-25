export interface ThemePalette {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeDefinition {
  name: string;
  label: string;
  cssScheme: string | undefined;
  light: ThemePalette;
  dark: ThemePalette;
}

export type ThemeName = 'forest' | 'graphite' | 'catppuccin' | 'tokyo-night' | 'nord' | 'rose-pine' | 'solarized' | 'mono';
export type ThemeMode = 'light' | 'dark' | 'system';
