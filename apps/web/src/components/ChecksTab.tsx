import { useParams } from '@tanstack/react-router';
import { GitStatusCard } from './checks/GitStatusCard';
import { CiRunsCard } from './checks/CiRunsCard';
import { PrReviewCommentsCard } from './checks/PrReviewCommentsCard';
import { PlanTodosCard } from './checks/PlanTodosCard';
import { DeployPreviewsCard } from './checks/DeployPreviewsCard';

interface Props {
  onOpenDiff?: () => void;
}

export function ChecksTab({ onOpenDiff }: Props) {
  const params = useParams({ strict: false }) as { workspaceId?: string };
  const workspaceId = params.workspaceId;

  if (!workspaceId) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-xs text-muted-foreground">No workspace selected</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto p-3">
      <GitStatusCard workspaceId={workspaceId} onOpenDiff={onOpenDiff} />
      <CiRunsCard workspaceId={workspaceId} />
      <PrReviewCommentsCard workspaceId={workspaceId} />
      <PlanTodosCard workspaceId={workspaceId} />
      <DeployPreviewsCard workspaceId={workspaceId} />
    </div>
  );
}
