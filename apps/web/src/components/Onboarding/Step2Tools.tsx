import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronRight, Github } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useDetectTools } from '../../hooks/useOnboarding';
import { useGithubAuthStatus, useGithubOAuthUrl, useConnectGithubPAT } from '../../hooks/useGithubAuth';
import type { ToolStatus } from '../../hooks/useOnboarding';

function ToolRow({
  name,
  status,
  showAuth = false,
}: {
  name: string;
  status: ToolStatus | undefined;
  showAuth?: boolean;
}) {
  if (!status) return null;
  const ok = status.available;
  const authOk = showAuth ? status.authenticated : null;

  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm font-medium">{name}</p>
        {status.version && <p className="text-xs text-muted-foreground">{status.version}</p>}
      </div>
      <div className="flex items-center gap-2">
        {showAuth && authOk !== null && (
          <span className={`text-xs ${authOk ? 'text-success' : 'text-destructive'}`}>
            {authOk ? 'authed' : 'not authed'}
          </span>
        )}
        {ok ? (
          <CheckCircle className="size-4 text-success" />
        ) : (
          <XCircle className="size-4 text-destructive" />
        )}
      </div>
    </div>
  );
}

function GithubAuthSection() {
  const { data: ghStatus } = useGithubAuthStatus();
  const oauthUrl = useGithubOAuthUrl();
  const connectPAT = useConnectGithubPAT();
  const [pat, setPat] = useState('');
  const [patError, setPatError] = useState('');

  if (ghStatus?.authed) return null;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
      <p className="text-xs font-medium text-muted-foreground">GitHub not authenticated — connect via:</p>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 w-full justify-start"
          onClick={() => oauthUrl.mutateAsync()}
          disabled={oauthUrl.isPending}
        >
          <Github className="size-3.5" />
          Connect with GitHub OAuth
        </Button>
        <div className="flex gap-2">
          <input
            type="password"
            placeholder="ghp_… (PAT)"
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button
            size="sm"
            variant="outline"
            disabled={!pat.trim() || connectPAT.isPending}
            onClick={async () => {
              setPatError('');
              try { await connectPAT.mutateAsync(pat.trim()); setPat(''); }
              catch (e) { setPatError(e instanceof Error ? e.message : 'Invalid'); }
            }}
          >
            Connect
          </Button>
        </div>
        {patError && <p className="text-[11px] text-destructive">{patError}</p>}
        <p className="text-[10px] text-muted-foreground">
          Or run <code className="font-mono">gh auth login</code> in your terminal.
        </p>
      </div>
    </div>
  );
}

interface Props {
  onNext?: () => void;
}

export function Step2Tools({ onNext: _onNext }: Props = {}) {
  const [showOptional, setShowOptional] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const { data: tools, isLoading, refetch } = useDetectTools(enabled);

  if (!enabled) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Pixler will detect which agent CLIs are available on your system.
        </p>
        <Button onClick={() => setEnabled(true)} className="w-full">
          Detect tools
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <RefreshCw className="size-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Detecting tools…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1 rounded-lg border border-border bg-card/50 px-4 py-1">
        <ToolRow name="Git" status={tools?.git} />
        <ToolRow name="Claude" status={tools?.claude} />
        <ToolRow name="GitHub CLI (gh)" status={tools?.gh} showAuth />
      </div>

      <button
        type="button"
        onClick={() => setShowOptional((v) => !v)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showOptional ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        Optional tools (Codex, Gemini)
      </button>

      {showOptional && (
        <div className="space-y-1 rounded-lg border border-border bg-card/50 px-4 py-1">
          <ToolRow name="Codex" status={tools?.codex} />
          <ToolRow name="Gemini" status={tools?.gemini} />
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => refetch()}
        className="w-full gap-2"
      >
        <RefreshCw className="size-3.5" />
        Re-check all
      </Button>

      <GithubAuthSection />
    </div>
  );
}
