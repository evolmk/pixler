import { create } from 'zustand';
import { applyTheme, type ThemeMode, type ThemeName, themeNames } from '@pixler/ui-styles';

interface ThemeState {
  theme: ThemeName;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  cycleTheme: () => void;
}

const STORAGE_KEY = 'pixler.theme';

function getSystemMode(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'system' ? getSystemMode() : mode;
}

function loadFromStorage(): { theme: ThemeName; mode: ThemeMode } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (themeNames.includes(parsed.theme) && ['light', 'dark', 'system'].includes(parsed.mode)) {
        return parsed;
      }
    }
  } catch {}
  return { theme: 'forest', mode: 'system' };
}

function saveToStorage(theme: ThemeName, mode: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, mode }));
}

function withThemeFade(fn: () => void) {
  document.documentElement.classList.add('theme-transitioning');
  fn();
  setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 220);
}

const initial = loadFromStorage();
const initialResolved = resolveMode(initial.mode);
applyTheme(initial.theme, initialResolved);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initial.theme,
  mode: initial.mode,
  resolvedMode: initialResolved,

  setTheme: (theme) => {
    const resolved = resolveMode(get().mode);
    withThemeFade(() => applyTheme(theme, resolved));
    saveToStorage(theme, get().mode);
    set({ theme, resolvedMode: resolved });
  },

  setMode: (mode) => {
    const resolved = resolveMode(mode);
    withThemeFade(() => applyTheme(get().theme, resolved));
    saveToStorage(get().theme, mode);
    set({ mode, resolvedMode: resolved });
  },

  cycleTheme: () => {
    const current = get().theme;
    const idx = themeNames.indexOf(current);
    const next = themeNames[(idx + 1) % themeNames.length];
    get().setTheme(next);
  },
}));

if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', () => {
    const state = useThemeStore.getState();
    if (state.mode === 'system') {
      const resolved = getSystemMode();
      applyTheme(state.theme, resolved);
      useThemeStore.setState({ resolvedMode: resolved });
    }
  });
}
