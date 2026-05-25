import { useState } from 'react';
import { MessageSquare, Terminal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@pixler/ui/components/dialog';
import { Button } from '@pixler/ui/components/button';
import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pixler/ui/components/select';
import { useCreateWorkspace } from '../hooks/useWorkspaces';
import { useWorkspaceEvents } from '../hooks/useWorkspaceEvents';
import { useWorkflows } from '../hooks/useWorkflows';
import { useCallback, useRef } from 'react';
import { slugify } from '@pixler/shared-types';
import type { WorkspaceMode, WorkspaceEvent } from '@pixler/shared-types';

interface NewWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  prefillTicketId?: string;
}

type Step = 'form' | 'creating';

export function NewWorkspaceDialog({ open, onOpenChange, projectId, prefillTicketId }: NewWorkspaceDialogProps) {
  const [step, setStep] = useState<Step>('form');
  const [mode, setMode] = useState<WorkspaceMode>('chat');
  const [ticketId, setTicketId] = useState(prefillTicketId ?? '');
  const [customName, setCustomName] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [error, setError] = useState('');
  const [setupLog, setSetupLog] = useState<string[]>([]);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const create = useCreateWorkspace();
  const logRef = useRef<HTMLDivElement>(null);
  const { data: workflows = [] } = useWorkflows();

  const handleEvent = useCallback((event: WorkspaceEvent) => {
    if (event.type === 'workspace.setup-log') {
      setSetupLog((prev) => {
        const next = [...prev, event.line];
        setTimeout(() => logRef.current?.scrollTo({ top: logRef.current.scrollHeight }), 0);
        return next;
      });
    }
    if (event.type === 'workspace.state-changed' && (event.to === 'ready' || event.to === 'error')) {
      setTimeout(() => onOpenChange(false), 1000);
    }
  }, [onOpenChange]);

  useWorkspaceEvents(createdId, handleEvent);

  const activeWorkflows = workflows.filter((wf) => !wf.archived);
  const selectedWf = activeWorkflows.find((wf) => wf.name === selectedWorkflow);

  const reset = () => {
    setStep('form');
    setMode('chat');
    setTicketId('');
    setCustomName('');
    setSelectedWorkflow('');
    setError('');
    setSetupLog([]);
    setCreatedId(null);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleCreate = async () => {
    setError('');
    setSetupLog([]);
    try {
      setStep('creating');
      const ws = await create.mutateAsync({
        projectId,
        mode,
        ticketId: ticketId.trim() || undefined,
        name: customName.trim() || undefined,
      });
      setCreatedId(ws.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create workspace');
      setStep('form');
    }
  };

  const slug = customName.trim()
    ? slugify(customName.trim())
    : ticketId.trim()
    ? slugify(ticketId.trim())
    : '';
  const branchPreview = slug ? `pixler/${slug}` : 'pixler/<color-name>';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === 'form' ? 'New workspace' : 'Creating workspace…'}</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new git worktree workspace for this project.
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="flex flex-col gap-4">
            {/* Mode picker */}
            <div className="flex flex-col gap-1.5">
              <Label>Mode</Label>
              <div className="flex gap-2">
                {(['chat', 'terminal'] as WorkspaceMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={[
                      'flex flex-1 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                      mode === m
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card hover:bg-accent',
                    ].join(' ')}
                  >
                    {m === 'chat' ? <MessageSquare className="size-4" /> : <Terminal className="size-4" />}
                    <span className="capitalize">{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket ID */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-id">Ticket ID <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="ticket-id"
                placeholder="ENG-101"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
              />
            </div>

            {/* Workflow picker — shown when workflows exist */}
            {activeWorkflows.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <Label>Workflow <span className="text-muted-foreground">(optional)</span></Label>
                <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                  <SelectTrigger>
                    <SelectValue placeholder="Auto-detect from ticket label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Auto-detect from ticket label</SelectItem>
                    {activeWorkflows.map((wf) => (
                      <SelectItem key={wf.name} value={wf.name}>{wf.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedWf && (
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Steps</p>
                    <ol className="flex flex-col gap-0.5">
                      {selectedWf.steps.map((s, i) => (
                        <li key={s.id} className="flex items-center gap-1.5 text-xs text-foreground">
                          <span className="text-muted-foreground">{i + 1}.</span>
                          <span>{s.label}</span>
                          {s.model && <span className="ml-auto text-[10px] text-muted-foreground">{s.model}</span>}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Custom name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="custom-name">Custom name <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="custom-name"
                placeholder="leave blank to auto-generate"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            {/* Preview */}
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <p>Branch: <span className="font-mono text-foreground">{branchPreview}</span></p>
              <p className="mt-0.5">Worktree: <span className="font-mono text-foreground">../pixler-worktrees/{slug || '<name>'}</span></p>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={create.isPending}>
                {create.isPending ? 'Creating…' : 'Create workspace'}
              </Button>
            </div>
          </div>
        )}

        {step === 'creating' && (
          <div className="flex flex-col gap-3">
            <div
              ref={logRef}
              className="h-48 overflow-y-auto rounded-md border border-border bg-black/80 p-3 font-mono text-xs text-green-400"
            >
              {setupLog.length === 0 ? (
                <p className="text-muted-foreground">Waiting for setup script…</p>
              ) : (
                setupLog.map((line, i) => <p key={i}>{line}</p>)
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
