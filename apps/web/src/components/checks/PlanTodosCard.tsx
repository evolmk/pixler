import { CheckSquare, Square, RefreshCw } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { usePlan } from '../../hooks/usePlan';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  workspaceId: string;
}

function extractTodos(content: string): Array<{ text: string; done: boolean }> {
  const todos: Array<{ text: string; done: boolean }> = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const done = /^\s*-\s*\[x\]/i.test(line);
    const open = /^\s*-\s*\[ \]/.test(line);
    if (done || open) {
      const text = line.replace(/^\s*-\s*\[[ xX]\]\s*/, '').trim();
      if (text) todos.push({ text, done });
    }
  }
  return todos;
}

export function PlanTodosCard({ workspaceId }: Props) {
  const qc = useQueryClient();
  const { data: plan, isFetching } = usePlan(workspaceId);

  const refresh = () => void qc.invalidateQueries({ queryKey: ['plan', workspaceId] });

  const todos = plan ? extractTodos(plan.content) : [];
  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium">Plan Tasks</span>
          {todos.length > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {doneCount}/{todos.length}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon-xs" onClick={refresh} disabled={isFetching}>
          <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      {!plan ? (
        <p className="text-xs text-muted-foreground">No plan loaded</p>
      ) : todos.length === 0 ? (
        <p className="text-xs text-muted-foreground">No tasks found in plan</p>
      ) : (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {todos.slice(0, 10).map((todo, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              {todo.done ? (
                <CheckSquare className="size-3 mt-0.5 shrink-0 text-primary" />
              ) : (
                <Square className="size-3 mt-0.5 shrink-0 text-muted-foreground" />
              )}
              <span className={`line-clamp-1 ${todo.done ? 'text-muted-foreground line-through' : ''}`}>
                {todo.text}
              </span>
            </div>
          ))}
          {todos.length > 10 && (
            <span className="text-[10px] text-muted-foreground">+{todos.length - 10} more</span>
          )}
        </div>
      )}
    </div>
  );
}
