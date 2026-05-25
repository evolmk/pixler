import { useState } from 'react';
import { Check } from 'lucide-react';
import { themes, themeNames, applyTheme } from '@pixler/ui-styles';
import type { ThemeName, ThemeMode } from '@pixler/ui-styles';

interface Props {
  currentTheme: ThemeName;
  currentMode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  onSelect: (theme: ThemeName) => void;
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return mode;
}

export function ThemeSwatchGrid({ currentTheme, currentMode, resolvedMode, onSelect }: Props) {
  const [hovered, setHovered] = useState<ThemeName | null>(null);

  const handleMouseEnter = (name: ThemeName) => {
    setHovered(name);
    applyTheme(name, resolvedMode);
  };

  const handleMouseLeave = () => {
    setHovered(null);
    applyTheme(currentTheme, resolvedMode);
  };

  const handleSelect = (name: ThemeName) => {
    setHovered(null);
    onSelect(name);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {themeNames.map((name) => {
        const theme = themes[name];
        const palette = resolvedMode === 'dark' ? theme.dark : theme.light;
        const isActive = name === currentTheme && !hovered;

        return (
          <button
            key={name}
            type="button"
            className={`group relative flex flex-col overflow-hidden rounded-md border-2 transition-colors ${
              isActive ? 'border-primary' : 'border-transparent hover:border-border'
            }`}
            style={{ backgroundColor: palette.background }}
            onClick={() => handleSelect(name)}
            onMouseEnter={() => handleMouseEnter(name)}
            onMouseLeave={handleMouseLeave}
            aria-label={theme.label}
            aria-pressed={name === currentTheme}
          >
            {/* Mini preview strips */}
            <div className="flex h-8 w-full flex-col p-1 gap-0.5">
              <div className="h-1 rounded-full w-3/4" style={{ backgroundColor: palette.primary }} />
              <div className="h-1 rounded-full w-1/2" style={{ backgroundColor: palette.mutedForeground, opacity: 0.6 }} />
              <div className="flex gap-0.5 mt-0.5">
                <div className="h-1.5 flex-1 rounded-sm" style={{ backgroundColor: palette.border }} />
                <div className="h-1.5 flex-1 rounded-sm" style={{ backgroundColor: palette.accent }} />
              </div>
            </div>

            {/* Label */}
            <div
              className="px-1 pb-1 text-center text-[9px] leading-tight truncate w-full"
              style={{ color: palette.mutedForeground }}
            >
              {theme.label}
            </div>

            {/* Active check */}
            {name === currentTheme && (
              <div
                className="absolute top-0.5 right-0.5 size-3.5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: palette.primary }}
              >
                <Check className="size-2" style={{ color: palette.primaryForeground }} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
