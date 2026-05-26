import { Github, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@pixler/ui/components/tooltip';
import { useGithubAuthStatus } from '../hooks/useGithubAuth';
import { useLayoutStore } from '../stores/layout';

/**
 * Renders a connected pill (green) when GitHub auth is healthy, or a warning pill
 * (amber, click-to-fix) when auth is missing or broken. Mirrors LinearStatusPill.
 * Clicking the warning pill opens Settings → GitHub.
 */
export function GithubStatusPill() {
  const { data: status, isLoading } = useGithubAuthStatus();
  const setSettingsOpen = useLayoutStore((s) => s.setSettingsOpen);

  if (isLoading || !status) return null;

  const authed = status.authed === true;
  const username = status.username;
  const method = status.authMethod;

  if (authed) {
    const label = username
      ? `GitHub: ${username}${method ? ` (${method})` : ''}`
      : 'GitHub: connected';
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground"
              aria-label={label}
            >
              <Github className="size-2.5 fill-emerald-500 text-emerald-500" />
              <span>GitHub</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const label = status.error
    ? `GitHub not connected — ${status.error}. Click to re-auth.`
    : 'GitHub not connected. Click to re-auth.';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setSettingsOpen(true, 'github')}
            className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-600 hover:bg-amber-500/15 dark:text-amber-400"
            aria-label={label}
          >
            <AlertTriangle className="size-2.5" />
            <span>GitHub</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
