import { useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';

const CURRENT_VERSION = '0.1.0';
const NPM_REGISTRY_URL = 'https://registry.npmjs.org/pixler/latest';

export function AboutPanel() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const checkForUpdates = async () => {
    setChecking(true);
    try {
      const res = await fetch(NPM_REGISTRY_URL);
      if (res.ok) {
        const data = (await res.json()) as { version: string };
        setLatestVersion(data.version ?? null);
      }
    } catch {
      setLatestVersion(null);
    } finally {
      setChecking(false);
    }
  };

  const isOutdated = latestVersion && latestVersion !== CURRENT_VERSION;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-medium">Pixler</p>
        <p className="text-xs text-muted-foreground">v{CURRENT_VERSION}</p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => void checkForUpdates()}
          disabled={checking}
        >
          <RefreshCw className={`mr-1.5 size-3.5 ${checking ? 'animate-spin' : ''}`} />
          Check for updates
        </Button>
        {latestVersion && (
          <p className={`text-xs ${isOutdated ? 'text-yellow-600' : 'text-green-600'}`}>
            {isOutdated ? `v${latestVersion} available` : 'Up to date'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <a
          href="https://github.com/evolmk/pixler/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="size-3.5" />
          Changelog
        </a>
        <a
          href="https://github.com/evolmk/pixler/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="size-3.5" />
          MIT License
        </a>
        <a
          href="https://github.com/evolmk/pixler/issues"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ExternalLink className="size-3.5" />
          Give feedback
        </a>
      </div>
    </div>
  );
}
