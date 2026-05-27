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

type ConfirmAction = 'prompts' | 'settings' | 'database' | 'factory-reset' | null;

const ACTION_LABELS: Record<NonNullable<ConfirmAction>, string> = {
  prompts: 'Reset all prompts',
  settings: 'Reset all settings',
  database: 'Wipe database',
  'factory-reset': 'Factory reset',
};

const ACTION_DESCRIPTIONS: Partial<Record<NonNullable<ConfirmAction>, string>> = {
  'factory-reset': 'Removes all projects, workspaces, settings, and stored credentials. App returns to first-run state.',
};

export function StoragePanel() {
  const [confirming, setConfirming] = useState<ConfirmAction>(null);
  const [result, setResult] = useState<{ action: NonNullable<ConfirmAction>; message: string } | null>(null);

  const runAction = async (action: NonNullable<ConfirmAction>) => {
    const endpoints: Record<NonNullable<ConfirmAction>, string> = {
      prompts: '/api/settings/reset-prompts',
      settings: '/api/settings/reset',
      database: '/api/db/wipe',
      'factory-reset': '/api/db/wipe',
    };
    try {
      const res = await fetch(endpoints[action], { method: 'POST' });
      setResult({ action, message: res.ok ? `${ACTION_LABELS[action]} — done.` : `Failed (${res.status}).` });
    } catch {
      setResult({ action, message: 'Request failed.' });
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
        {result && result.action !== 'factory-reset' && <p className="text-xs text-muted-foreground">{result.message}</p>}
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

      <Section label="Factory Reset">
        <p className="text-xs text-muted-foreground">{ACTION_DESCRIPTIONS['factory-reset']}</p>
        {result?.action === 'factory-reset' && confirming === null && (
          <p className="text-xs text-muted-foreground">{result.message}</p>
        )}
        {confirming === 'factory-reset' ? (
          <div className="rounded-md border border-destructive/60 bg-destructive/5 p-3 space-y-3">
            <p className="text-xs font-medium text-destructive">
              This will permanently delete all data. This cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void runAction('factory-reset')}
                className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Yes, factory reset
              </button>
              <button
                onClick={() => setConfirming(null)}
                className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirming('factory-reset')}
            className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Factory Reset
          </button>
        )}
      </Section>
    </div>
  );
}
