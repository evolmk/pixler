import { Label } from '@pixler/ui/components/label';
import { Input } from '@pixler/ui/components/input';
import { useSetting } from '../../hooks/useSetting';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

type MergeStrategy = 'merge' | 'squash' | 'rebase';

const MERGE_STRATEGIES: Array<{ value: MergeStrategy; label: string }> = [
  { value: 'squash', label: 'Squash and merge' },
  { value: 'merge', label: 'Create a merge commit' },
  { value: 'rebase', label: 'Rebase and merge' },
];

export function GitPanel() {
  const { value: branchTemplate = '{ticket}-{slug}', set: setBranchTemplate } = useSetting<string>('git.branchTemplate');
  const { value: baseBranch = 'main', set: setBaseBranch } = useSetting<string>('git.baseBranch');
  const { value: autoMerge = false, set: setAutoMerge } = useSetting<boolean>('git.autoMerge');
  const { value: mergeStrategy = 'squash', set: setMergeStrategy } = useSetting<MergeStrategy>('git.mergeStrategy');

  return (
    <div className="space-y-6">
      <Section label="Branch">
        <div className="space-y-1.5">
          <Label htmlFor="branch-template" className="text-xs">Name template</Label>
          <Input
            id="branch-template"
            value={branchTemplate}
            onChange={(e) => setBranchTemplate(e.target.value)}
            placeholder="{ticket}-{slug}"
            className="h-8 font-mono text-xs"
          />
          <p className="text-[10px] text-muted-foreground">
            Tokens: <code>{'{ticket}'}</code> <code>{'{slug}'}</code> <code>{'{id}'}</code>
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="base-branch" className="text-xs">Base branch</Label>
          <Input
            id="base-branch"
            value={baseBranch}
            onChange={(e) => setBaseBranch(e.target.value)}
            placeholder="main"
            className="h-8 font-mono text-xs"
          />
        </div>
      </Section>

      <Section label="Pull requests">
        <div className="space-y-1.5">
          <Label className="text-xs">Merge strategy</Label>
          <select
            value={mergeStrategy}
            onChange={(e) => setMergeStrategy(e.target.value as MergeStrategy)}
            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {MERGE_STRATEGIES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoMerge}
            onChange={(e) => setAutoMerge(e.target.checked)}
            className="accent-primary"
          />
          <span className="text-sm">Auto-merge when checks pass</span>
        </label>
      </Section>
    </div>
  );
}
