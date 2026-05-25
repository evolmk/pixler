import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useSetting } from '../../hooks/useSetting';
import { useGithubStatus } from '../../hooks/useGithubStatus';
import { Label } from '@pixler/ui/components/label';
import { Input } from '@pixler/ui/components/input';
import { Button } from '@pixler/ui/components/button';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ProviderRow({
  label,
  settingKey,
  placeholder,
  statusBadge,
}: {
  label: string;
  settingKey: string;
  placeholder: string;
  statusBadge?: React.ReactNode;
}) {
  const { value = '', set } = useSetting<string>(settingKey);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        {statusBadge}
      </div>
      <Input
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="h-8 font-mono text-xs"
      />
    </div>
  );
}

function GhStatusBadge() {
  const { data: status } = useGithubStatus();
  if (!status) return null;
  return status.authed ? (
    <span className="flex items-center gap-1 text-[11px] text-success">
      <CheckCircle className="size-3" />
      {status.username ?? 'authed'}
    </span>
  ) : (
    <span className="flex items-center gap-1 text-[11px] text-destructive">
      <AlertCircle className="size-3" />
      not logged in
    </span>
  );
}

export function ProvidersPanel() {
  const { data: ghStatus } = useGithubStatus();

  return (
    <div className="space-y-6">
      <Section label="GitHub CLI">
        <ProviderRow
          label="gh path"
          settingKey="providers.gh"
          placeholder="gh"
          statusBadge={<GhStatusBadge />}
        />
        {ghStatus && !ghStatus.authed && (
          <div className="rounded-md border border-warning/40 bg-warning/10 px-2.5 py-2 space-y-1.5">
            <p className="text-[11px] text-warning-foreground">
              Run <code className="font-mono">gh auth login</code> in your terminal to authenticate.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs gap-1"
              onClick={() => window.open('https://github.com/cli/cli#installation', '_blank')}
            >
              <ExternalLink className="size-3" />
              gh CLI docs
            </Button>
          </div>
        )}
      </Section>

      <Section label="Agent CLIs">
        <ProviderRow label="claude path" settingKey="providers.claude" placeholder="claude" />
        <ProviderRow label="codex path" settingKey="providers.codex" placeholder="codex" />
        <ProviderRow label="gemini path" settingKey="providers.gemini" placeholder="gemini" />
      </Section>
    </div>
  );
}
