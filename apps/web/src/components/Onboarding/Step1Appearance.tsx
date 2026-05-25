import { Monitor, Moon, Sun } from 'lucide-react';
import { ThemeSwatchGrid } from '../ThemeSwatchGrid';
import { useThemeStore } from '../../stores/theme';
import { useSetting } from '../../hooks/useSetting';
import type { ThemeMode, ThemeName } from '@pixler/ui-styles';

const MODE_OPTIONS: Array<{ value: ThemeMode; icon: typeof Sun; label: string }> = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

interface Props {
  onNext?: () => void;
}

export function Step1Appearance({ onNext: _onNext }: Props = {}) {
  const { theme, mode, resolvedMode } = useThemeStore();
  const { set: setTheme } = useSetting<ThemeName>('appearance.theme');
  const { set: setMode } = useSetting<ThemeMode>('appearance.mode');
  const store = useThemeStore();

  const handleThemeSelect = (name: ThemeName) => {
    setTheme(name);
    store.setTheme(name);
  };

  const handleModeSelect = (m: ThemeMode) => {
    setMode(m);
    store.setMode(m);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl font-bold text-primary">Pixler</div>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Local-first agent orchestrator. Takes tickets from <span className="text-foreground font-medium">Todo</span> to{' '}
          <span className="text-foreground font-medium">Merged PR</span> — autonomously.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Color theme</p>
        <ThemeSwatchGrid
          currentTheme={theme}
          currentMode={mode}
          resolvedMode={resolvedMode}
          onSelect={handleThemeSelect}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Appearance</p>
        <div className="flex gap-2">
          {MODE_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => handleModeSelect(value)}
              className={`flex-1 flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs transition-colors ${
                mode === value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-border/80'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
