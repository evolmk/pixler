import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { Separator } from '@pixler/ui/components/separator';
import { Switch } from '@pixler/ui/components/switch';
import { useSetting } from '../../hooks/useSetting';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1 space-y-0.5">
        <span className="text-sm">{label}</span>
        {description && <p className="text-[10px] text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function WorkspacesPanel() {
  const { value: maxParallel = 3, set: setMaxParallel } = useSetting<number>('workspaces.maxParallel');
  const { value: loopLimit = 3, set: setLoopLimit } = useSetting<number>('gates.loopLimit');
  const { value: autoApprovePlan = false, set: setAutoApprovePlan } = useSetting<boolean>('gates.autoApprovePlan');
  const { value: autoApproveValidation = false, set: setAutoApproveValidation } = useSetting<boolean>('gates.autoApproveValidation');
  const { value: autoApprovePr = false, set: setAutoApprovePr } = useSetting<boolean>('gates.autoApprovePr');

  return (
    <div className="space-y-6">
      <Section label="Concurrency">
        <Row
          label="Max parallel workspaces"
          description="How many agent loops may run simultaneously."
        >
          <Input
            type="number"
            value={maxParallel}
            min={1}
            max={10}
            onChange={(e) => setMaxParallel(Number(e.target.value))}
            className="h-8 w-20 text-sm"
          />
        </Row>
      </Section>

      <Separator />

      <Section label="Loop limits">
        <Row
          label="Rejection limit"
          description="Max plan rejections before pausing and asking for human input (1–5)."
        >
          <Input
            type="number"
            value={loopLimit}
            min={1}
            max={5}
            onChange={(e) => setLoopLimit(Number(e.target.value))}
            className="h-8 w-20 text-sm"
          />
        </Row>
      </Section>

      <Separator />

      <Section label="Auto-approve gates">
        <p className="text-[11px] text-muted-foreground">
          When enabled, the agent skips the human-in-the-loop gate and continues automatically after a brief delay.
        </p>
        <Row
          label="Auto-approve plan"
          description="Skip the plan-approval gate."
        >
          <Switch checked={autoApprovePlan} onCheckedChange={setAutoApprovePlan} />
        </Row>
        <Row
          label="Auto-approve validation"
          description="Skip the validation-approval gate."
        >
          <Switch checked={autoApproveValidation} onCheckedChange={setAutoApproveValidation} />
        </Row>
        <Row
          label="Auto-approve PR"
          description="Skip the PR-approval gate."
        >
          <Switch checked={autoApprovePr} onCheckedChange={setAutoApprovePr} />
        </Row>
      </Section>
    </div>
  );
}
