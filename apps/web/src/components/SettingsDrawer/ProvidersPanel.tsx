import { useSetting } from '../../hooks/useSetting';
import { Label } from '@pixler/ui/components/label';
import { Input } from '@pixler/ui/components/input';

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

export function ProvidersPanel() {
  return (
    <div className="space-y-6">
      <Section label="GitHub CLI">
        <ProviderRow label="gh path" settingKey="providers.gh" placeholder="gh" />
        <p className="text-[11px] text-muted-foreground">
          GitHub authentication is managed in the GitHub settings tab.
        </p>
      </Section>

      <Section label="Agent CLIs">
        <ProviderRow label="claude path" settingKey="providers.claude" placeholder="claude" />
        <ProviderRow label="codex path" settingKey="providers.codex" placeholder="codex" />
        <ProviderRow label="gemini path" settingKey="providers.gemini" placeholder="gemini" />
      </Section>
    </div>
  );
}
