import { useState, useEffect, useCallback } from 'react';
import { Search, AlertTriangle, Check } from 'lucide-react';
import { SegmentedControl } from '@pixler/ui/components/segmented-control';
import type { SegmentedOption } from '@pixler/ui/components/segmented-control';
import { Button } from '@pixler/ui/components/button';
import { useSetting } from '../../hooks/useSetting';
import { getActions } from '../../lib/palette/registry';
import {
  loadKeyboard,
  getKey,
  findConflict,
  setOverride,
  getOverrides,
  formatKey,
  getPreset,
  type KeyPreset,
} from '../../lib/palette/keyboard';

const PRESET_OPTIONS: SegmentedOption<KeyPreset>[] = [
  { value: 'default', label: 'Default' },
  { value: 'vim', label: 'Vim' },
  { value: 'emacs', label: 'Emacs' },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

interface RebindState {
  actionId: string | null;
  captured: string;
  conflict: string | undefined;
}

export function KeyboardPanel() {
  const { value: preset = 'default', set: savePreset } = useSetting<KeyPreset>('keyboard.preset');
  const { value: bindings = {}, set: saveBindings } = useSetting<Record<string, string>>('keyboard.bindings');

  const [searchQuery, setSearchQuery] = useState('');
  const [rebind, setRebind] = useState<RebindState>({ actionId: null, captured: '', conflict: undefined });

  useEffect(() => {
    loadKeyboard(preset as KeyPreset, bindings as Record<string, string>);
  }, [preset, bindings]);

  const allActions = getActions().filter((a) => a.group !== 'workspaces' && a.group !== 'tickets' && a.group !== 'files');
  const filtered = searchQuery
    ? allActions.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.keywords?.some((k) => k.includes(searchQuery.toLowerCase())),
      )
    : allActions;

  const handlePreset = (next: KeyPreset) => {
    savePreset(next);
    loadKeyboard(next, bindings as Record<string, string>);
  };

  const startRebind = (actionId: string) => {
    setRebind({ actionId, captured: '', conflict: undefined });
  };

  const cancelRebind = () => {
    setRebind({ actionId: null, captured: '', conflict: undefined });
  };

  const captureKey = useCallback(
    (e: KeyboardEvent) => {
      if (!rebind.actionId) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        cancelRebind();
        return;
      }

      const parts: string[] = [];
      if (e.metaKey) parts.push('meta');
      if (e.ctrlKey) parts.push('ctrl');
      if (e.shiftKey) parts.push('shift');
      if (e.altKey) parts.push('alt');

      const k = e.key.toLowerCase();
      if (!['meta', 'control', 'shift', 'alt'].includes(k)) {
        parts.push(k);
      }

      if (parts.length < 2) return; // require modifier

      const combo = parts.join('+');
      const conflict = findConflict(rebind.actionId, combo);
      setRebind({ actionId: rebind.actionId, captured: combo, conflict });
    },
    [rebind.actionId],
  );

  useEffect(() => {
    if (rebind.actionId) {
      window.addEventListener('keydown', captureKey, true);
      return () => window.removeEventListener('keydown', captureKey, true);
    }
  }, [rebind.actionId, captureKey]);

  const confirmRebind = () => {
    if (!rebind.actionId || !rebind.captured) return;
    setOverride(rebind.actionId, rebind.captured);
    const next = { ...(bindings as Record<string, string>), [rebind.actionId]: rebind.captured };
    saveBindings(next);
    setRebind({ actionId: null, captured: '', conflict: undefined });
  };

  const clearBinding = (actionId: string) => {
    setOverride(actionId, '');
    const next = { ...(bindings as Record<string, string>), [actionId]: '' };
    saveBindings(next);
  };

  return (
    <div className="space-y-6">
      <Section label="Preset">
        <SegmentedControl
          options={PRESET_OPTIONS}
          value={(preset as KeyPreset) ?? 'default'}
          onChange={handlePreset}
        />
      </Section>

      <Section label="Shortcuts">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search shortcuts…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-transparent py-1.5 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        {/* Rebind capture prompt */}
        {rebind.actionId && (
          <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-xs">
            <p className="font-medium">Press a key combo for this action…</p>
            {rebind.captured && (
              <p className="mt-1 font-mono text-sm">{formatKey(rebind.captured)}</p>
            )}
            {rebind.conflict && (
              <p className="mt-1 flex items-center gap-1 text-destructive">
                <AlertTriangle className="size-3" />
                Conflicts with "{getActions().find((a) => a.id === rebind.conflict)?.title ?? rebind.conflict}"
              </p>
            )}
            <div className="mt-2 flex gap-2">
              {rebind.captured && (
                <Button size="xs" variant="default" onClick={confirmRebind}>
                  <Check className="size-3" />
                  Confirm
                </Button>
              )}
              <Button size="xs" variant="ghost" onClick={cancelRebind}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Bindings list */}
        <div className="space-y-0.5">
          {filtered.map((action) => {
            const key = getKey(action.id);
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent/50"
              >
                {Icon && <Icon className="size-3.5 shrink-0 text-muted-foreground" />}
                <span className="flex-1 text-xs">{action.title}</span>
                {key ? (
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {formatKey(key)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/50">—</span>
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-5 px-1.5 text-[10px]"
                  onClick={() => startRebind(action.id)}
                >
                  Edit
                </Button>
                {key && (
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-5 px-1.5 text-[10px] text-muted-foreground"
                    onClick={() => clearBinding(action.id)}
                  >
                    ×
                  </Button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">No matching shortcuts.</p>
          )}
        </div>
      </Section>
    </div>
  );
}
