import { useState } from 'react';
import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { useSetting } from '../../hooks/useSetting';

const WHAT_WE_COLLECT = [
  'Page views within Pixler (no URLs outside the app)',
  'Button click events (e.g. "Create workspace clicked")',
  'Error counts and types (no stack traces with PII)',
  'Session duration',
];

interface Props {
  onNext?: () => void;
}

export function Step5Telemetry({ onNext: _onNext }: Props = {}) {
  const { value: enabled = true, set: setEnabled } = useSetting<boolean>('telemetry.enabled');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-4">
        <Shield className="size-5 text-primary mt-0.5 shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Anonymous telemetry</p>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                enabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${
                  enabled ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Helps the team understand what works and what doesn&apos;t. No code or file contents are
            ever sent.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        What gets sent?
      </button>

      {expanded && (
        <ul className="space-y-1.5 pl-2">
          {WHAT_WE_COLLECT.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-0.5 size-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
