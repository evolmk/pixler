import { RotateCcw } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Label } from '@pixler/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pixler/ui/components/select';
import { Separator } from '@pixler/ui/components/separator';
import { useSetting } from '../../hooks/useSetting';
import { resolvePlanFolder } from '../../lib/resolvePlanFolder';
import { FolderPicker } from '../FolderPicker';

export function PlansPanel() {
  const { value: storageMode = 'auto', set: setStorageMode } = useSetting<string>('plans.storageMode');
  const { value: planFolder = '_plans', set: setPlanFolder } = useSetting<string>('plans.fileDir');

  async function handleResetAllPrompts() {
    await fetch('/api/plans/reset-all-prompts', { method: 'DELETE' });
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Storage</p>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm">Default storage method</Label>
          <Select value={storageMode} onValueChange={setStorageMode}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (recommended)</SelectItem>
              <SelectItem value="file">File</SelectItem>
              <SelectItem value="inline">Inline</SelectItem>
              <SelectItem value="attachment">Attachment</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Auto picks file/inline/attachment based on ticket complexity.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm">Plan folder</Label>
          <FolderPicker
            value={planFolder}
            onChange={setPlanFolder}
            placeholder="_plans"
            title="Choose plan folder"
            inputClassName="text-sm"
          />
          <p className="break-all font-mono text-xs text-muted-foreground">
            {resolvePlanFolder(undefined, planFolder)}
          </p>
          <p className="text-xs text-muted-foreground">
            Relative folders are created in each repo's root. Projects can override this.
          </p>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prompts</p>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <Label className="text-sm">Reset all prompts</Label>
            <p className="text-xs text-muted-foreground">
              Clear "don't ask again" flags for every project.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void handleResetAllPrompts()}>
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset
          </Button>
        </div>
      </section>
    </div>
  );
}
