import { useState } from 'react';
import { Check, Eye, EyeOff, Github, Loader2, Terminal, Trash2, Unplug } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { Separator } from '@pixler/ui/components/separator';
import {
  useGithubAuthStatus,
  useGithubOAuthUrl,
  useConnectGithubPAT,
  useDisconnectGithub,
  useRemoveGithubCredential,
} from '../../hooks/useGithubAuth';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function MethodBadge({ method }: { method: 'pat' | 'oauth' | 'cli' }) {
  const labels: Record<string, string> = { pat: 'PAT', oauth: 'OAuth', cli: 'gh CLI' };
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
      {labels[method] ?? method}
    </span>
  );
}

export function GitHubPanel() {
  const { data: status } = useGithubAuthStatus();
  const oauthUrl = useGithubOAuthUrl();
  const connectPAT = useConnectGithubPAT();
  const disconnect = useDisconnectGithub();
  const removeCredential = useRemoveGithubCredential();

  const [pat, setPat] = useState('');
  const [showPat, setShowPat] = useState(false);
  const [patError, setPatError] = useState('');

  const handlePATConnect = async () => {
    if (!pat.trim()) return;
    setPatError('');
    try {
      await connectPAT.mutateAsync(pat.trim());
      setPat('');
    } catch (e) {
      setPatError(e instanceof Error ? e.message : 'Invalid PAT');
    }
  };

  const storedMethods = status?.storedMethods ?? [];
  const isConnected = status?.authed && !!status.authMethod;

  return (
    <div className="space-y-6">
      <Section label="Connection">
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <Github className="size-4 text-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium">{status?.username ?? 'Connected'}</p>
                    {status?.authMethod && <MethodBadge method={status.authMethod} />}
                  </div>
                  {status?.hostname && (
                    <p className="text-xs text-muted-foreground">{status.hostname}</p>
                  )}
                </div>
              </div>
              {status?.authMethod !== 'cli' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnect.mutateAsync()}
                  disabled={disconnect.isPending}
                  className="gap-1.5 text-xs"
                >
                  <Unplug className="size-3" />
                  Disconnect
                </Button>
              )}
            </div>
            {status?.authMethod !== 'cli' && (
              <p className="text-[11px] text-muted-foreground">
                Disconnect deactivates the credential without removing it.
              </p>
            )}
            {status?.authMethod === 'cli' && (
              <p className="text-[11px] text-muted-foreground">
                Authenticated via gh CLI. Use <code className="font-mono">gh auth logout</code> to disconnect, or set up OAuth / PAT to switch methods.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* gh CLI notice */}
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 space-y-1">
              <div className="flex items-center gap-1.5">
                <Terminal className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">GitHub CLI</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {status?.authed && !status.authMethod
                  ? `Detected: gh CLI logged in as ${status.username ?? 'unknown'}.`
                  : 'Run gh auth login in your terminal to use gh CLI authentication.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-[10px] uppercase text-muted-foreground">or connect with</span>
              <Separator className="flex-1" />
            </div>

            {/* OAuth section */}
            <div className="space-y-2">
              <Label className="text-xs">GitHub OAuth</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => oauthUrl.mutateAsync()}
                  disabled={oauthUrl.isPending}
                  className="gap-1.5"
                >
                  {oauthUrl.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Github className="size-3.5" />
                  )}
                  Connect with GitHub
                </Button>
                {storedMethods.includes('oauth') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCredential.mutateAsync('oauth')}
                    disabled={removeCredential.isPending}
                    className="gap-1 text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                    Remove key
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-[10px] uppercase text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            {/* PAT section */}
            <div className="space-y-2">
              <Label className="text-xs">Personal Access Token</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPat ? 'text' : 'password'}
                    placeholder="ghp_…"
                    value={pat}
                    onChange={(e) => setPat(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handlePATConnect(); }}
                    className="pr-8 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPat((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPat ? 'Hide PAT' : 'Show PAT'}
                  >
                    {showPat ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
                <Button
                  onClick={handlePATConnect}
                  disabled={connectPAT.isPending || !pat.trim()}
                  size="sm"
                  className="gap-1.5"
                >
                  {connectPAT.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Connect
                </Button>
                {storedMethods.includes('pat') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCredential.mutateAsync('pat')}
                    disabled={removeCredential.isPending}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
              {patError && <p className="text-xs text-destructive">{patError}</p>}
              <p className="text-xs text-muted-foreground">
                Create a token at GitHub → Settings → Developer settings → Personal access tokens. Needs <code className="font-mono">repo</code> scope.
              </p>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
