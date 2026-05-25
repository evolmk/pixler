import { SegmentedControl } from '@pixler/ui/components/segmented-control';
import type { SegmentedOption } from '@pixler/ui/components/segmented-control';
import { useThemeStore } from '../../stores/theme';
import { useSetting } from '../../hooks/useSetting';
import type { ThemeMode, ThemeName } from '@pixler/ui-styles';
import { ThemeSwatchGrid } from '../ThemeSwatchGrid';

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

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function AppearancePanel() {
  const { theme, mode, resolvedMode, setTheme, setMode } = useThemeStore();
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
        <ThemeSwatchGrid
          currentTheme={theme}
          currentMode={mode}
          resolvedMode={resolvedMode}
          onSelect={handleTheme}
        />
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

      <Section label="Diff viewer">
        <DiffSettings />
      </Section>
    </div>
  );
}

type DiffWordWrap = 'off' | 'on';
type DiffWhitespace = 'none' | 'boundary' | 'all';

const WORD_WRAP_OPTIONS: SegmentedOption<DiffWordWrap>[] = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
];

const WHITESPACE_OPTIONS: SegmentedOption<DiffWhitespace>[] = [
  { value: 'none', label: 'None' },
  { value: 'boundary', label: 'Boundary' },
  { value: 'all', label: 'All' },
];

function DiffSettings() {
  const { value: wordWrap = 'off', set: setWordWrap } = useSetting<DiffWordWrap>('diff.wordWrap');
  const { value: whitespace = 'none', set: setWhitespace } = useSetting<DiffWhitespace>('diff.renderWhitespace');

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Word wrap</p>
        <SegmentedControl options={WORD_WRAP_OPTIONS} value={wordWrap} onChange={setWordWrap} />
      </div>
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Render whitespace</p>
        <SegmentedControl options={WHITESPACE_OPTIONS} value={whitespace} onChange={setWhitespace} />
      </div>
    </div>
  );
}
