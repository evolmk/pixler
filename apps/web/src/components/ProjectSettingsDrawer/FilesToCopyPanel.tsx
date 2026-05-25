import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';

interface FilesToCopyPanelProps {
  /** Globs from pixler.json; pass [] if none configured */
  initialGlobs?: string[];
}

export function FilesToCopyPanel({ initialGlobs = [] }: FilesToCopyPanelProps) {
  const [globs, setGlobs] = useState<string[]>(initialGlobs);
  const [input, setInput] = useState('');

  const add = () => {
    const val = input.trim();
    if (val && !globs.includes(val)) {
      setGlobs((prev) => [...prev, val]);
      setInput('');
    }
  };

  const remove = (glob: string) => {
    setGlobs((prev) => prev.filter((g) => g !== glob));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        Paths or globs to copy from the root repo into each new worktree. Useful for <code>.env</code> files and local secrets.
      </p>

      <div className="flex gap-2">
        <Input
          placeholder=".env, secrets/**"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          className="flex-1 font-mono text-sm"
        />
        <Button onClick={add} disabled={!input.trim()}>
          <Plus className="size-4" />
        </Button>
      </div>

      {globs.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-4">No files to copy configured.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {globs.map((glob) => (
            <li
              key={glob}
              className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-1.5"
            >
              <span className="font-mono text-sm">{glob}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => remove(glob)}
                aria-label={`Remove ${glob}`}
              >
                <X className="size-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
