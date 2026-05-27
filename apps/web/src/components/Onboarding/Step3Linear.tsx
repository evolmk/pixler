import { useState } from 'react';
import { CheckCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { Separator } from '@pixler/ui/components/separator';
import { useLinearStatus, useLinearTeams, useConnectLinear, useLinearOAuthUrl } from '../../hooks/useLinear';
import { useSetting } from '../../hooks/useSetting';

interface Props {
  onNext?: () => void;
}

export function Step3Linear({ onNext: _onNext }: Props = {}) {
  const { data: status } = useLinearStatus();
  const { data: teams = [] } = useLinearTeams();
  const connect = useConnectLinear();
  const oauthUrl = useLinearOAuthUrl();
  const { value: teamKey = '', set: setTeamKey } = useSetting<string>('linear.team');

  const [pat, setPat] = useState('');
  const [showPat, setShowPat] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!pat.trim()) return;
    setError('');
    try {
      await connect.mutateAsync(pat.trim());
      setPat('');
    } catch {
      setError('Invalid PAT — check your Linear Personal API Key');
    }
  };

  if (status?.connected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-success">
          <CheckCircle className="size-5" />
          <span className="text-sm font-medium">Connected to Linear</span>
        </div>

        {teams.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs">Default team</Label>
            <select
              value={teamKey}
              onChange={(e) => setTeamKey(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select a team…</option>
              {teams.map((t) => (
                <option key={t.id} value={t.key}>
                  {t.name} ({t.key})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect Linear so Pixler can read tickets and update their status automatically.
      </p>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => oauthUrl.mutateAsync()}
        disabled={oauthUrl.isPending}
      >
        {oauthUrl.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Connect with Linear OAuth
      </Button>
      {oauthUrl.error && (
        <p className="text-xs text-destructive">
          {oauthUrl.error instanceof Error ? oauthUrl.error.message : 'OAuth unavailable'}.{' '}
          Set <code className="font-mono">PIXLER_LINEAR_CLIENT_ID</code> to enable.
        </p>
      )}

      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-[10px] uppercase text-muted-foreground">or use a PAT</span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Personal API Key</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showPat ? 'text' : 'password'}
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              placeholder="lin_api_…"
              className="pr-9 h-9 font-mono text-xs"
              onKeyDown={(e) => e.key === 'Enter' && void handleConnect()}
            />
            <button
              type="button"
              onClick={() => setShowPat((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPat ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>
          <Button
            onClick={() => void handleConnect()}
            disabled={!pat.trim() || connect.isPending}
            className="h-9 gap-1.5"
          >
            {connect.isPending && <Loader2 className="size-3.5 animate-spin" />}
            Connect
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <p className="text-xs text-muted-foreground">
        Get your key at{' '}
        <span className="font-medium">Linear → Settings → API → Personal API keys</span>.
      </p>
    </div>
  );
}
