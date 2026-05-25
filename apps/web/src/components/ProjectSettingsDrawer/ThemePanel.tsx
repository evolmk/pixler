import { useThemeStore } from '../../stores/theme';
import { useSetting } from '../../hooks/useSetting';
import type { ThemeName, ThemeMode } from '@pixler/ui-styles';
import { ThemeSwatchGrid } from '../ThemeSwatchGrid';

export function ThemePanel() {
  const { theme, mode, resolvedMode, setTheme } = useThemeStore();
  const { set: persistTheme } = useSetting<ThemeName>('appearance.theme');

  const handleTheme = (next: ThemeName) => {
    setTheme(next);
    persistTheme(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Override the global theme for this project. The mode (light/dark) is set globally in Appearance settings.
      </p>
      <ThemeSwatchGrid
        currentTheme={theme}
        currentMode={mode}
        resolvedMode={resolvedMode}
        onSelect={handleTheme}
      />
    </div>
  );
}
