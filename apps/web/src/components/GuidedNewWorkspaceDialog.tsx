import { useEffect, useRef, useState } from 'react';
import { NewWorkspaceDialog } from './NewWorkspaceDialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const HINT_KEY = 'pixler:guided-ws-hint-seen';

function HintBalloon({ text, onDismiss }: { text: string; onDismiss: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[60] flex justify-center">
      <div className="pointer-events-auto relative max-w-xs rounded-lg bg-primary px-4 py-2.5 text-primary-foreground shadow-lg">
        <p className="text-xs leading-relaxed">{text}</p>
        <button
          onClick={onDismiss}
          className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-background text-foreground text-[9px] flex items-center justify-center border border-border"
          aria-label="Dismiss hint"
        >
          ×
        </button>
        {/* Caret */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary" />
      </div>
    </div>
  );
}

export function GuidedNewWorkspaceDialog({ open, onOpenChange, projectId }: Props) {
  const [showHint, setShowHint] = useState(false);
  const hasShown = useRef(false);

  useEffect(() => {
    if (!open) return;
    if (hasShown.current) return;
    if (localStorage.getItem(HINT_KEY)) return;
    hasShown.current = true;
    setShowHint(true);
  }, [open]);

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem(HINT_KEY, '1');
  };

  return (
    <>
      {showHint && (
        <HintBalloon
          text="Give your workspace a name and pick a ticket — Pixler will spin up a branch and start the agent."
          onDismiss={dismissHint}
        />
      )}
      <NewWorkspaceDialog
        open={open}
        onOpenChange={(v) => {
          if (!v) dismissHint();
          onOpenChange(v);
        }}
        projectId={projectId}
      />
    </>
  );
}
