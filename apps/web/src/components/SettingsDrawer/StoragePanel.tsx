import { useState } from 'react';
import { useSetting } from '../../hooks/useSetting';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h3>
      {children}
    </div>
  );
}

function PathRow({ label, settingKey, placeholder }: { label: string; settingKey: string; placeholder: string }) {
  const { value, set } = useSetting<string>(settingKey);
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        value={(value as string) ?? ''}
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

type ConfirmAction = 'prompts' | 'settings' | 'database' | null;

const ACTION_LABELS: Record<NonNullable<ConfirmAction>, string> = {
  prompts: 'Reset all prompts',
  settings: 'Reset all settings',
  database: 'Wipe database',
};

export function StoragePanel() {
  const [confirming, setConfirming] = useState<ConfirmAction>(null);
  const [result, setResult] = useState('');

  const runAction = async (action: NonNullable<ConfirmAction>) => {
    const endpoints: Record<NonNullable<ConfirmAction>, string> = {
      prompts: '/api/settings/reset-prompts',
      settings: '/api/settings/reset',
      database: '/api/db/wipe',
    };
    try {
      const res = await fetch(endpoints[action], { method: 'POST' });
      setResult(res.ok ? `${ACTION_LABELS[action]} — done.` : `Failed (${res.status}).`);
    } catch {
      setResult('Request failed.');
    }
    setConfirming(null);
  };

  return (
    <div className="space-y-8">
      <Section label="Directories">
        <PathRow label="Worktree base dir" settingKey="storage.worktreeDir" placeholder="~/.pixler/worktrees" />
        <PathRow label="Plan cache dir" settingKey="storage.planCacheDir" placeholder="~/.pixler/plans" />
        <PathRow label="Log retention (days)" settingKey="storage.logRetentionDays" placeholder="30" />
      </Section>

      <Section label="Destructive Actions">
        {result && <p className="text-xs text-muted-foreground">{result}</p>}
        <div className="space-y-2">
          {(['prompts', 'settings', 'database'] as const).map((action) => (
            confirming === action ? (
              <div key={action} className="flex items-center gap-2">
                <span className="flex-1 text-xs text-muted-foreground">Are you sure?</span>
                <button
                  onClick={() => void runAction(action)}
                  className="rounded-md bg-destructive px-3 py-1.5 text-xs text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirming(null)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                key={action}
                onClick={() => setConfirming(action)}
                className="rounded-md border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
              >
                {ACTION_LABELS[action]}
              </button>
            )
          ))}
        </div>
      </Section>
    </div>
  );
}
