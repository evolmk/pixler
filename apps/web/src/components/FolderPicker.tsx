import { useState } from 'react';
import { FolderOpen, Loader2 } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { cn } from '@pixler/ui/lib/utils';

interface Props {
  value: string;
  onChange: (path: string) => void;
  placeholder?: string;
  title?: string;
  defaultPath?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

/**
 * Text input + native OS folder-picker button. Falls back gracefully on platforms
 * without a picker — user can always type/paste a path.
 */
export function FolderPicker({
  value,
  onChange,
  placeholder,
  title,
  defaultPath,
  className,
  inputClassName,
  disabled,
}: Props) {
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBrowse() {
    setError(null);
    setPicking(true);
    try {
      const res = await fetch('/api/system/pick-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, defaultPath: defaultPath || value || undefined }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message ?? `HTTP ${res.status}`);
      const data = (await res.json()) as { path: string | null };
      if (data.path) onChange(data.path);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open folder picker');
    } finally {
      setPicking(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn('font-mono text-xs', inputClassName)}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void handleBrowse()}
          disabled={disabled || picking}
          className="shrink-0 gap-1.5"
        >
          {picking ? <Loader2 className="size-3.5 animate-spin" /> : <FolderOpen className="size-3.5" />}
          Browse…
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
