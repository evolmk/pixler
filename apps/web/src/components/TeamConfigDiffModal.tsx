import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@pixler/ui/components/dialog';
import { Button } from '@pixler/ui/components/button';
import { Checkbox } from '@pixler/ui/components/checkbox';
import { Label } from '@pixler/ui/components/label';
import { useAppEvents } from '../hooks/useAppEvents';
import type { AppEvent } from '@pixler/shared-types';

type DiffEntry = { key: string; teamValue: unknown; localValue: unknown };

export function TeamConfigDiffModal() {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [diff, setDiff] = useState<DiffEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleEvent = useCallback((event: AppEvent) => {
    if (event.type === 'project.team-config-diff') {
      const entries = event.diff as DiffEntry[];
      setProjectId(event.projectId);
      setDiff(entries);
      setSelected(new Set(entries.map((d) => d.key)));
      setOpen(true);
    }
  }, []);

  useAppEvents(handleEvent);

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleApply = async () => {
    const patch = Object.fromEntries(
      diff.filter((d) => selected.has(d.key)).map((d) => [d.key, d.teamValue]),
    );
    if (Object.keys(patch).length > 0) {
      await fetch(`/api/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'project', id: projectId, patch }),
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Team workflow settings found</DialogTitle>
          <DialogDescription>
            This repo includes a <code className="font-mono text-xs">pixler.json</code>. Choose
            which settings to import from the team config.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1 divide-y divide-border">
          {diff.map((entry) => (
            <div key={entry.key} className="flex items-start gap-3 py-3">
              <Checkbox
                id={`diff-${entry.key}`}
                checked={selected.has(entry.key)}
                onCheckedChange={() => toggle(entry.key)}
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <Label
                  htmlFor={`diff-${entry.key}`}
                  className="cursor-pointer font-mono text-sm font-medium"
                >
                  {entry.key}
                </Label>
                <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="mb-0.5 text-muted-foreground">Team</p>
                    <pre className="overflow-auto rounded bg-muted px-2 py-1 text-foreground">
                      {JSON.stringify(entry.teamValue, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-0.5 text-muted-foreground">Local</p>
                    <pre className="overflow-auto rounded bg-muted px-2 py-1 text-muted-foreground">
                      {JSON.stringify(entry.localValue, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Skip</Button>
          <Button onClick={handleApply} disabled={selected.size === 0}>
            Apply {selected.size} setting{selected.size !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
