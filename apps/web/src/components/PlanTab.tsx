import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { ExternalLink, Pencil, Eye } from 'lucide-react';
import { FileText } from 'lucide-react';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { Button } from '@pixler/ui/components/button';
import { usePlan, useSavePlan, useToggleTask } from '../hooks/usePlan';
import { PlanEditor } from './PlanEditor';
import { PlanStorageBadge } from './PlanStorageBadge';
import { BigPlanPromptModal } from './BigPlanPromptModal';
import type { BigPlanChoice } from './BigPlanPromptModal';

function parseSections(content: string) {
  const lines = content.split('\n');
  const sections: { heading: string; body: string[] }[] = [];
  let current: { heading: string; body: string[] } | null = null;

  for (const line of lines) {
    if (/^## /.test(line)) {
      if (current) sections.push(current);
      current = { heading: line.replace(/^## /, ''), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

interface TaskListProps {
  content: string;
  onToggle: (index: number, completed: boolean) => void;
}

function TaskList({ content, onToggle }: TaskListProps) {
  const taskLines = content
    .split('\n')
    .map((line, idx) => ({ line, idx }))
    .filter(({ line }) => /^- \[[ x]\] /.test(line));

  let taskIdx = -1;
  return (
    <ul className="space-y-1">
      {taskLines.map(({ line, idx }) => {
        taskIdx++;
        const localTaskIdx = taskIdx;
        const completed = /^- \[x\] /.test(line);
        const text = line.replace(/^- \[[ x]\] /, '');
        return (
          <li key={idx} className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={completed}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
              onChange={(e) => onToggle(localTaskIdx, e.target.checked)}
            />
            <span className={completed ? 'line-through text-muted-foreground text-sm' : 'text-sm'}>
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function PlanTab() {
  const params = useParams({ strict: false }) as { workspaceId?: string };
  const workspaceId = params.workspaceId;
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [bigPlanOpen, setBigPlanOpen] = useState(false);
  const [bigPlanData, setBigPlanData] = useState<{ taskCount: number; charCount: number } | null>(null);
  const [pendingContent, setPendingContent] = useState<string | null>(null);

  const { data: plan, isLoading } = usePlan(workspaceId);
  const savePlan = useSavePlan(workspaceId ?? '');
  const toggleTask = useToggleTask(workspaceId ?? '');

  if (!workspaceId) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState icon={FileText} title="No workspace selected" body="Open a workspace to see its plan." className="border-none" />
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Loading…</div>;
  }

  if (!plan) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState icon={FileText} title="No plan yet" body="Start the orchestrator loop to generate a plan." className="border-none" />
      </div>
    );
  }

  const sections = parseSections(plan.content);
  const tasksSection = sections.find((s) => /^tasks/i.test(s.heading));

  function handleStartEdit() {
    setEditContent(plan!.content);
    setEditing(true);
  }

  async function handleSaveEdit() {
    try {
      await savePlan.mutateAsync({ content: editContent });
      setEditing(false);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'PLAN_TOO_BIG') {
        const e = err as unknown as { taskCount: number; charCount: number };
        setBigPlanData({ taskCount: e.taskCount, charCount: e.charCount });
        setPendingContent(editContent);
        setBigPlanOpen(true);
      }
    }
  }

  async function handleBigPlanChoice(choice: BigPlanChoice, dontAskAgain: boolean) {
    setBigPlanOpen(false);
    if (choice === 'cancel' || !pendingContent) return;

    if (dontAskAgain) {
      await fetch(`/api/projects/${workspaceId}/plans/reset-prompts`, { method: 'DELETE' });
    }

    await savePlan.mutateAsync({ content: pendingContent, mode: choice });
    setPendingContent(null);
    setEditing(false);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2">
          <PlanStorageBadge mode={plan.storage} />
          <span className="text-[11px] text-muted-foreground">rev {plan.revision}</span>
          {plan.linearUrl && (
            <a
              href={plan.linearUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
            >
              Open in Linear
              <ExternalLink className="size-2.5" />
            </a>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={editing ? () => void handleSaveEdit() : handleStartEdit}
          aria-label={editing ? 'Save plan' : 'Edit plan'}
        >
          {editing ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
        </Button>
      </div>

      {/* Body */}
      {editing ? (
        <div className="flex-1 min-h-0">
          <PlanEditor value={editContent} onChange={setEditContent} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {sections.map((sec) => {
            const isTasks = /^tasks/i.test(sec.heading);
            return (
              <section key={sec.heading}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {sec.heading}
                </h3>
                {isTasks ? (
                  <TaskList
                    content={sec.body.join('\n')}
                    onToggle={(idx, completed) => void toggleTask.mutateAsync({ taskIndex: idx, completed })}
                  />
                ) : (
                  <div className="text-sm whitespace-pre-wrap text-foreground">
                    {sec.body.join('\n').trim()}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <BigPlanPromptModal
        open={bigPlanOpen}
        taskCount={bigPlanData?.taskCount ?? 0}
        charCount={bigPlanData?.charCount ?? 0}
        onChoose={(choice, dontAsk) => void handleBigPlanChoice(choice, dontAsk)}
      />
    </div>
  );
}
