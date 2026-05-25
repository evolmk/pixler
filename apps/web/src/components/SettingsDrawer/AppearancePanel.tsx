import { SegmentedControl } from '@pixler/ui/components/segmented-control';
import type { SegmentedOption } from '@pixler/ui/components/segmented-control';
import { useThemeStore } from '../../stores/theme';
import { useSetting } from '../../hooks/useSetting';
import type { ThemeMode, ThemeName } from '@pixler/ui-styles';
import { themeNames } from '@pixler/ui-styles';

type Density = 'compact' | 'comfortable' | 'spacious';
type AnimationLevel = 'full' | 'reduced' | 'none';

const MODE_OPTIONS: SegmentedOption<ThemeMode>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const DENSITY_OPTIONS: SegmentedOption<Density>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
];

const ANIMATION_OPTIONS: SegmentedOption<AnimationLevel>[] = [
  { value: 'full', label: 'Full' },
  { value: 'reduced', label: 'Reduced' },
  { value: 'none', label: 'None' },
];

const THEME_COLORS: Record<ThemeName, string> = {
  forest: '#16a355',
  graphite: '#6b7280',
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function AppearancePanel() {
  const { theme, mode, setTheme, setMode } = useThemeStore();
  const { set: persistTheme } = useSetting<ThemeName>('appearance.theme');
  const { set: persistMode } = useSetting<ThemeMode>('appearance.mode');
  const { value: density = 'comfortable', set: setDensity } = useSetting<Density>('appearance.density');
  const { value: animationLevel = 'full', set: setAnimationLevel } = useSetting<AnimationLevel>('appearance.animationLevel');

  const handleTheme = (next: ThemeName) => {
    setTheme(next);
    persistTheme(next);
  };

  const handleMode = (next: ThemeMode) => {
    setMode(next);
    persistMode(next);
  };

  return (
    <div className="space-y-6">
      <Section label="Theme">
        <div className="flex gap-2">
          {themeNames.map((t) => (
            <button
              key={t}
              onClick={() => handleTheme(t)}
              className={`flex flex-col items-center gap-1.5 rounded-md border-2 p-2 transition-colors ${
                theme === t
                  ? 'border-primary'
                  : 'border-transparent hover:border-border'
              }`}
              aria-label={t}
              aria-pressed={theme === t}
            >
              <span
                className="size-6 rounded-full"
                style={{ backgroundColor: THEME_COLORS[t] }}
              />
              <span className="text-[10px] capitalize text-muted-foreground">{t}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section label="Mode">
        <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={handleMode} />
      </Section>

      <Section label="Density">
        <SegmentedControl
          options={DENSITY_OPTIONS}
          value={density}
          onChange={setDensity}
        />
      </Section>

      <Section label="Animation">
        <SegmentedControl
          options={ANIMATION_OPTIONS}
          value={animationLevel}
          onChange={setAnimationLevel}
        />
      </Section>
    </div>
  );
}
