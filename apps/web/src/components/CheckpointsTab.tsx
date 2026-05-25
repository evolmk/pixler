import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { Timer } from 'lucide-react';
import { EmptyState } from '@pixler/ui/components/empty-state';
import { Button } from '@pixler/ui/components/button';
import { useCheckpoints, useRollbackCheckpoint, useDeleteCheckpoint, useTakeCheckpoint } from '../hooks/useCheckpoints';
import { CheckpointCard } from './CheckpointCard';
import { RollbackConfirmModal } from './RollbackConfirmModal';
import type { Checkpoint } from '@pixler/shared-types';

export function CheckpointsTab() {
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string };
  const { data: checkpoints, isLoading } = useCheckpoints(workspaceId);
  const rollback = useRollbackCheckpoint();
  const deleteCheckpoint = useDeleteCheckpoint(workspaceId);
  const takeCheckpoint = useTakeCheckpoint(workspaceId);
  const [pendingRollback, setPendingRollback] = useState<Checkpoint | null>(null);

  const sorted = [...(checkpoints ?? [])].sort((a, b) => b.createdAt - a.createdAt);

  function handleRollbackConfirm() {
    if (!pendingRollback) return;
    rollback.mutate(pendingRollback.id, {
      onSettled: () => setPendingRollback(null),
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {sorted.length} checkpoint{sorted.length !== 1 ? 's' : ''}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => takeCheckpoint.mutate({})}
          disabled={!workspaceId || takeCheckpoint.isPending}
          className="h-6 gap-1 px-2 text-xs"
        >
          <Timer className="size-3" />
          Take snapshot
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-muted-foreground">Loading…</span>
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex h-full min-h-48 items-center justify-center p-4">
            <EmptyState
              icon={Timer}
              title="No checkpoints yet"
              body="Checkpoints are taken automatically before execution and large batches. You can also take one manually."
              className="max-w-xs border-none"
            />
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sorted.map((cp) => (
              <CheckpointCard
                key={cp.id}
                checkpoint={cp}
                onRollback={(cp) => setPendingRollback(cp)}
                onDelete={(id) => deleteCheckpoint.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>

      <RollbackConfirmModal
        checkpoint={pendingRollback}
        hasUncommitted={false}
        onConfirm={handleRollbackConfirm}
        onCancel={() => setPendingRollback(null)}
      />
    </div>
  );
}
