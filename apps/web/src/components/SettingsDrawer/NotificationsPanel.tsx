import { useSetting } from '../../hooks/useSetting';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h3>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, settingKey }: { label: string; description?: string; settingKey: string }) {
  const { value, set } = useSetting<boolean>(settingKey);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={!!value}
        onClick={() => set(!value)}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${value ? 'bg-primary' : 'bg-input'}`}
      >
        <span
          className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}

function TimeInput({ label, settingKey }: { label: string; settingKey: string }) {
  const { value, set } = useSetting<string>(settingKey);
  return (
    <div className="flex items-center gap-3">
      <label className="w-12 text-xs text-muted-foreground">{label}</label>
      <input
        type="time"
        value={(value as string) ?? ''}
        onChange={(e) => set(e.target.value)}
        className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

export function NotificationsPanel() {
  return (
    <div className="space-y-8">
      <Section label="In-App Toasts">
        <ToggleRow
          label="Success notifications"
          description="Show toast when agent completes or PR is merged."
          settingKey="notifications.toast.success"
        />
        <ToggleRow
          label="Warning notifications"
          description="Show toast for context spikes and stuck agents."
          settingKey="notifications.toast.warning"
        />
        <ToggleRow
          label="Error notifications"
          description="Show toast for agent errors and CI failures."
          settingKey="notifications.toast.error"
        />
      </Section>

      <Section label="Native OS Notifications">
        <ToggleRow
          label="Enable native notifications"
          description="Send OS-level notifications when Pixler is not focused."
          settingKey="notifications.native"
        />
      </Section>

      <Section label="Do Not Disturb">
        <p className="text-xs text-muted-foreground">Silence all notifications during these hours.</p>
        <div className="space-y-2">
          <TimeInput label="Start" settingKey="notifications.dnd.start" />
          <TimeInput label="End" settingKey="notifications.dnd.end" />
        </div>
      </Section>
    </div>
  );
}
