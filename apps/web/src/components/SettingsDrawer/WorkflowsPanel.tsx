import { useState, useEffect } from 'react';
import { Archive, Copy, FilePlus, Loader2, Pencil, X } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { Badge } from '@pixler/ui/components/badge';
import { Separator } from '@pixler/ui/components/separator';
import { Textarea } from '@pixler/ui/components/textarea';
import {
  useWorkflows,
  useWorkflow,
  useSaveWorkflow,
  useDuplicateWorkflow,
  useArchiveWorkflow,
} from '../../hooks/useWorkflows';
import type { WorkflowDefDto } from '@pixler/shared-types';

const BLANK_YAML = `name: my-workflow
description: "Custom workflow"
version: 1
steps:
  - id: review_issue
    type: builtin:review_issue
    label: Review Issue
  - id: create_plan
    type: builtin:create_plan
    label: Create Plan
  - id: approve_plan
    type: approval
    label: Approve Plan
    message: "Review the plan and approve to continue."
  - id: implement
    type: builtin:run_plan
    label: Implement
  - id: open_pr
    type: builtin:open_pr
    label: Open PR
`;

const SOURCE_LABEL: Record<string, string> = {
  builtin: 'Built-in',
  user: 'User',
  repo: 'Repo',
};

function SourceBadge({ source }: { source: string }) {
  const variant = source === 'builtin' ? 'secondary' : source === 'repo' ? 'default' : 'outline';
  return <Badge variant={variant} className="text-[10px]">{SOURCE_LABEL[source] ?? source}</Badge>;
}

function WorkflowRow({
  wf,
  onEdit,
  onDuplicate,
  onArchive,
}: {
  wf: WorkflowDefDto;
  onEdit: (name: string) => void;
  onDuplicate: (name: string) => void;
  onArchive: (name: string) => void;
}) {
  const dup = useDuplicateWorkflow();
  const arc = useArchiveWorkflow();

  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium">{wf.name}</span>
        <SourceBadge source={wf.source} />
        {wf.archived && <Badge variant="outline" className="text-[10px] text-muted-foreground">archived</Badge>}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{wf.steps.length} steps</span>
      <Button variant="ghost" size="icon-sm" onClick={() => onEdit(wf.name)} aria-label="Edit">
        <Pencil className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={dup.isPending}
        onClick={() => { onDuplicate(wf.name); dup.mutate({ name: wf.name }); }}
        aria-label="Duplicate"
      >
        <Copy className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={arc.isPending}
        onClick={() => { onArchive(wf.name); arc.mutate(wf.name); }}
        aria-label="Archive"
      >
        <Archive className="size-3.5" />
      </Button>
    </div>
  );
}

function YamlEditor({
  name,
  onClose,
}: {
  name: string | null;
  onClose: () => void;
}) {
  const isNew = name === '__new__';
  const { data } = useWorkflow(isNew ? '' : (name ?? ''));
  const save = useSaveWorkflow();

  const [yaml, setYaml] = useState('');
  const [wfName, setWfName] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) {
      setYaml(BLANK_YAML);
      setWfName('my-workflow');
    } else if (data) {
      setYaml(data.yaml);
      setWfName(name ?? '');
    }
  }, [isNew, data, name]);

  const handleSave = async () => {
    setError('');
    if (!wfName.trim()) { setError('Workflow name required'); return; }
    try {
      await save.mutateAsync({ name: wfName.trim(), yaml });
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 800);
    } catch {
      setError('Failed to save workflow');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{isNew ? 'New workflow' : `Editing: ${name}`}</p>
        <Button variant="ghost" size="icon-sm" onClick={onClose}><X className="size-4" /></Button>
      </div>
      <Textarea
        value={yaml}
        onChange={(e) => setYaml(e.target.value)}
        className="min-h-[320px] font-mono text-xs"
        spellCheck={false}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={() => void handleSave()} disabled={save.isPending}>
          {save.isPending ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : null}
          {saved ? 'Saved!' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export function WorkflowsPanel() {
  const { data: workflows = [], isLoading } = useWorkflows();
  const [editingName, setEditingName] = useState<string | null>(null);

  const active = workflows.filter((wf) => !wf.archived);
  const archived = workflows.filter((wf) => wf.archived);

  const grouped: Record<string, WorkflowDefDto[]> = {};
  for (const wf of active) {
    const src = wf.source;
    grouped[src] ??= [];
    grouped[src].push(wf);
  }

  if (editingName !== null) {
    return <YamlEditor name={editingName} onClose={() => setEditingName(null)} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Workflows</p>
        <Button variant="outline" size="sm" onClick={() => setEditingName('__new__')}>
          <FilePlus className="mr-1.5 size-3.5" />
          New
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Loading…
        </div>
      )}

      {(['builtin', 'repo', 'user'] as const).map((source) => {
        const group = grouped[source];
        if (!group?.length) return null;
        return (
          <div key={source} className="flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {SOURCE_LABEL[source]}
            </p>
            {group.map((wf) => (
              <WorkflowRow
                key={wf.name}
                wf={wf}
                onEdit={setEditingName}
                onDuplicate={() => {}}
                onArchive={() => {}}
              />
            ))}
          </div>
        );
      })}

      {archived.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Archived</p>
            {archived.map((wf) => (
              <WorkflowRow
                key={wf.name}
                wf={wf}
                onEdit={setEditingName}
                onDuplicate={() => {}}
                onArchive={() => {}}
              />
            ))}
          </div>
        </>
      )}

      {!isLoading && workflows.length === 0 && (
        <p className="text-sm text-muted-foreground">No workflows found.</p>
      )}
    </div>
  );
}
