import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Terminal } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { cn } from '@pixler/ui/lib/utils';

interface Props {
  stepId: string;
  stepLabel: string;
  prompt: string;
  onSendToTerminal: () => void;
  isSending: boolean;
}

const PREVIEW_LINES = 3;

export function StepPromptAccordion({ stepLabel, prompt, onSendToTerminal, isSending }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = prompt.split('\n');
  const preview = lines.slice(0, PREVIEW_LINES).join('\n');
  const hasMore = lines.length > PREVIEW_LINES;

  function handleCopy() {
    void navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="rounded-md border border-border bg-muted/30">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="size-3.5 shrink-0 text-primary" />
          <span className="text-xs font-medium truncate">{stepLabel}</span>
          <span className="text-xs text-muted-foreground shrink-0">— ready to run</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="size-6" onClick={handleCopy} title="Copy prompt">
            <Copy className={cn('size-3', copied && 'text-green-500')} />
          </Button>
          {hasMore && (
            <Button variant="ghost" size="icon" className="size-6" onClick={() => setExpanded((v) => !v)} title={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </Button>
          )}
        </div>
      </div>

      <div className="border-t border-border px-3 py-2">
        <pre className="whitespace-pre-wrap font-mono text-xs text-foreground/80 leading-relaxed">
          {expanded ? prompt : preview}
          {!expanded && hasMore && (
            <span className="text-muted-foreground"> …</span>
          )}
        </pre>
      </div>

      <div className="border-t border-border px-3 py-2">
        <Button
          size="sm"
          className="w-full text-xs"
          onClick={onSendToTerminal}
          disabled={isSending}
        >
          <Terminal className="mr-1.5 size-3" />
          {isSending ? 'Sending…' : 'Send to terminal'}
        </Button>
      </div>
    </div>
  );
}
