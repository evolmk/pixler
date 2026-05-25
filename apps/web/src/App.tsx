import { useCallback, useEffect, useState } from 'react';
import { useThemeStore } from './stores/theme';
import { useAppEvents } from './hooks/useAppEvents';
import { OnboardingShell } from './components/Onboarding/OnboardingShell';
import type { AppEvent } from '@pixler/shared-types';

export function App() {
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const { theme, mode, resolvedMode, cycleTheme, setMode } = useThemeStore();

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch((err) => setError(err.message));
  }, []);

  const handleAppEvent = useCallback((event: AppEvent) => {
    console.log('[pixler] app event:', event);
    setLastEvent(event.type);
  }, []);

  useAppEvents(handleAppEvent);

  if (error) return <p className="p-4 text-destructive">Error connecting to API: {error}</p>;
  if (!version) return <p className="p-4 text-muted-foreground">Loading...</p>;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-bold text-primary mb-4">
        Pixler is alive — version {version}
      </h1>

      <div className="flex gap-3 items-center mb-4">
        <button
          onClick={cycleTheme}
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
        >
          Theme: {theme}
        </button>

        <button
          onClick={() => {
            const modes = ['light', 'dark', 'system'] as const;
            const idx = modes.indexOf(mode);
            setMode(modes[(idx + 1) % modes.length]);
          }}
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
        >
          {resolvedMode === 'dark' ? '🌙' : '☀️'} {mode}
        </button>
      </div>

      {lastEvent && (
        <p className="text-sm text-muted-foreground">
          Last socket event: <code className="text-primary">{lastEvent}</code>
        </p>
      )}

      <OnboardingShell />
    </div>
  );
}
