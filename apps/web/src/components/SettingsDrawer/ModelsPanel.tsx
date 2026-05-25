import { Label } from '@pixler/ui/components/label';
import { Separator } from '@pixler/ui/components/separator';
import { useSetting } from '../../hooks/useSetting';

type AgentCli = 'claude' | 'codex' | 'gemini';

const CLI_OPTIONS: Array<{ value: AgentCli; label: string }> = [
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'codex', label: 'Codex (OpenAI)' },
  { value: 'gemini', label: 'Gemini (Google)' },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function AgentSelect({ label, settingKey, description }: { label: string; settingKey: string; description: string }) {
  const { value = 'claude', set } = useSetting<AgentCli>(settingKey);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <select
        value={value}
        onChange={(e) => set(e.target.value as AgentCli)}
        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {CLI_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}

export function ModelsPanel() {
  return (
    <div className="space-y-6">
      <Section label="Agent roles">
        <AgentSelect
          label="Planner"
          settingKey="models.planner"
          description="Reads the ticket and writes a step-by-step plan."
        />
        <AgentSelect
          label="Reviewer"
          settingKey="models.reviewer"
          description="Critiques the plan and emits APPROVED or REJECTED."
        />
        <AgentSelect
          label="Executor"
          settingKey="models.executor"
          description="Implements the plan and opens the PR."
        />
      </Section>

      <Separator />

      <p className="text-[11px] text-muted-foreground">
        Individual projects can override these defaults in{' '}
        <span className="font-medium">Project Settings → Models</span>.
      </p>
    </div>
  );
}
