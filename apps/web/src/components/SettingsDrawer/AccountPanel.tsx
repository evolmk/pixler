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

type InspectorMode = 'telemetry' | 'crashes';

export function AccountPanel() {
  const [inspecting, setInspecting] = useState<InspectorMode | null>(null);
  const [payload, setPayload] = useState<string>('');

  const inspect = async (mode: InspectorMode) => {
    try {
      const url = mode === 'crashes' ? '/api/crashes' : '/api/telemetry/preview';
      const res = await fetch(url);
      const data = await res.json();
      setPayload(JSON.stringify(data, null, 2));
      setInspecting(mode);
    } catch {
      setPayload('Failed to load preview');
      setInspecting(mode);
    }
  };

  return (
    <div className="space-y-8">
      <Section label="Privacy Controls">
        <ToggleRow
          label="Anonymous telemetry"
          description="Send anonymized feature usage to help improve Pixler. No PII is ever sent."
          settingKey="telemetry.enabled"
        />
        <ToggleRow
          label="Crash reporting"
          description="Send sanitized crash reports (no code content, no paths)."
          settingKey="crashes.reporting.enabled"
        />
      </Section>

      <Section label="Inspect What We'd Send">
        <p className="text-xs text-muted-foreground">
          Click below to preview the exact payload that would be sent. These payloads contain only
          feature counts, error types, and model names — never code, files, or paths.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => void inspect('telemetry')}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
          >
            View telemetry payload
          </button>
          <button
            onClick={() => void inspect('crashes')}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
          >
            View crash log
          </button>
        </div>

        {inspecting && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium capitalize">{inspecting} payload</span>
              <button onClick={() => setInspecting(null)} className="text-[10px] text-muted-foreground hover:text-foreground">
                Close
              </button>
            </div>
            <pre className="max-h-48 overflow-auto rounded-md border border-border bg-muted p-3 text-[11px] font-mono text-muted-foreground">
              {payload}
            </pre>
          </div>
        )}
      </Section>
    </div>
  );
}
