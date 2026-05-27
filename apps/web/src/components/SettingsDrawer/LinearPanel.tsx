import { useState } from 'react';
import { Check, Eye, EyeOff, Loader2, LogIn, Trash2, Unplug, Zap } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { Separator } from '@pixler/ui/components/separator';
import {
  useLinearStatus,
  useLinearTeams,
  useConnectLinear,
  useDisconnectLinear,
  useRemoveLinearCredential,
  useLinearOAuthUrl,
} from '../../hooks/useLinear';
import { useSetting } from '../../hooks/useSetting';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function MethodBadge({ method }: { method: 'pat' | 'oauth' }) {
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
      {method === 'oauth' ? 'OAuth' : 'PAT'}
    </span>
  );
}

export function LinearPanel() {
  const { data: status } = useLinearStatus();
  const { data: teams = [] } = useLinearTeams();
  const connect = useConnectLinear();
  const disconnect = useDisconnectLinear();
  const removeCredential = useRemoveLinearCredential();
  const oauthUrl = useLinearOAuthUrl();

  const { value: teamKey = '', set: setTeamKey } = useSetting<string>('linear.team');
  const { value: syncIntervalMs = 60000, set: setSyncIntervalMs } = useSetting<number>('linear.syncIntervalMs');

  const [pat, setPat] = useState('');
  const [showPat, setShowPat] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!pat.trim()) return;
    setError('');
    try {
      await connect.mutateAsync(pat.trim());
      setPat('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid PAT');
    }
  };

  const storedMethods = status?.storedMethods ?? [];

  return (
    <div className="space-y-6">
      {/* Connection status */}
      <Section label="Connection">
        {status?.connected ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <Zap className="size-4 fill-emerald-500 text-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium">{status.viewerName ?? 'Connected'}</p>
                    {status.authMethod && <MethodBadge method={status.authMethod} />}
                  </div>
                  {status.organization && (
                    <p className="text-xs text-muted-foreground">{status.organization}</p>
                  )}
                </div>
              </div>
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
            </div>
            <p className="text-[11px] text-muted-foreground">
              Disconnect deactivates the credential without removing it. Use "Remove key" to fully delete.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* OAuth section */}
            <div className="space-y-2">
              <Label className="text-xs">Connect with OAuth</Label>
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
                    <LogIn className="size-3.5" />
                  )}
                  Connect with Linear
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
              {oauthUrl.error && (
                <p className="text-xs text-destructive">
                  {oauthUrl.error instanceof Error ? oauthUrl.error.message : 'OAuth unavailable'}.{' '}
                  Set <code className="font-mono">PIXLER_LINEAR_CLIENT_ID</code> to enable.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-[10px] uppercase text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            {/* PAT section */}
            <div className="space-y-2">
              <Label className="text-xs">Personal API Key</Label>
              {!status?.connected && storedMethods.includes('pat') && (
                <p className="text-[11px] text-muted-foreground">
                  A PAT is stored but inactive — enter it again to reconnect, or switch to OAuth.
                </p>
              )}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPat ? 'text' : 'password'}
                    placeholder="lin_api_…"
                    value={pat}
                    onChange={(e) => setPat(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleConnect(); }}
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
                  onClick={handleConnect}
                  disabled={connect.isPending || !pat.trim()}
                  size="sm"
                  className="gap-1.5"
                >
                  {connect.isPending ? (
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
              {error && <p className="text-xs text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">
                Create a Personal Access Token in Linear → Settings → API.
              </p>
            </div>
          </div>
        )}
      </Section>

      {status?.connected && (
        <>
          <Separator />

          {/* Default team */}
          <Section label="Default team">
            <select
              value={teamKey}
              onChange={(e) => setTeamKey(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">None</option>
              {teams.map((t) => (
                <option key={t.id} value={t.key}>
                  {t.name} ({t.key})
                </option>
              ))}
            </select>
          </Section>

          <Separator />

          {/* Sync interval */}
          <Section label="Sync interval">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={10000}
                step={5000}
                value={syncIntervalMs}
                onChange={(e) => setSyncIntervalMs(Number(e.target.value))}
                className="w-28 text-sm"
              />
              <span className="text-xs text-muted-foreground">ms ({Math.round(syncIntervalMs / 1000)}s)</span>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
