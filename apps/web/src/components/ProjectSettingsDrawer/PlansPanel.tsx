import { useParams } from '@tanstack/react-router';
import { RotateCcw } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Label } from '@pixler/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pixler/ui/components/select';
import { Slider } from '@pixler/ui/components/slider';
import { Separator } from '@pixler/ui/components/separator';
import { useSetting } from '../../hooks/useSetting';

export function PlansPanel() {
  const params = useParams({ strict: false }) as { projectId?: string };
  const projectId = params.projectId;

  const { value: storageMode = 'auto', set: setStorageMode } = useSetting<string>('plans.storageMode');
  const { value: inlineMaxTasks = 3, set: setInlineMaxTasks } = useSetting<number>('plans.inlineMaxTasks');
  const { value: inlineMaxChars = 500, set: setInlineMaxChars } = useSetting<number>('plans.inlineMaxApproachChars');

  async function handleResetPrompts() {
    if (!projectId) return;
    await fetch(`/api/projects/${projectId}/plans/reset-prompts`, { method: 'DELETE' });
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Storage</p>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm">Storage method</Label>
          <Select value={storageMode} onValueChange={setStorageMode}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="file">File</SelectItem>
              <SelectItem value="inline">Inline</SelectItem>
              <SelectItem value="attachment">Attachment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Inline thresholds</p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Max tasks for inline</Label>
            <span className="text-xs tabular-nums text-muted-foreground">{inlineMaxTasks}</span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[inlineMaxTasks]}
            onValueChange={([v]) => setInlineMaxTasks(v!)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Max approach chars for inline</Label>
            <span className="text-xs tabular-nums text-muted-foreground">{inlineMaxChars}</span>
          </div>
          <Slider
            min={100}
            max={2000}
            step={100}
            value={[inlineMaxChars]}
            onValueChange={([v]) => setInlineMaxChars(v!)}
            className="w-full"
          />
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prompts</p>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <Label className="text-sm">Reset plan prompts</Label>
            <p className="text-xs text-muted-foreground">
              Clear "don't ask again" flags for this project.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void handleResetPrompts()}>
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset
          </Button>
        </div>
      </section>
    </div>
  );
}
