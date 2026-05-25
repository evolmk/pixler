import { RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PrComment } from '@pixler/shared-types';

interface Props {
  workspaceId: string;
}

async function fetchPrComments(workspaceId: string): Promise<PrComment[]> {
  const res = await fetch(`/api/workspaces/${workspaceId}/pr/comments`);
  if (!res.ok) return [];
  return res.json() as Promise<PrComment[]>;
}

export function PrReviewCommentsCard({ workspaceId }: Props) {
  const qc = useQueryClient();
  const { data: comments = [], isFetching } = useQuery({
    queryKey: ['pr-comments', workspaceId],
    queryFn: () => fetchPrComments(workspaceId),
    staleTime: 30_000,
  });

  const refresh = () => void qc.invalidateQueries({ queryKey: ['pr-comments', workspaceId] });

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium">PR Reviews</span>
          {comments.length > 0 && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {comments.length}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon-xs" onClick={refresh} disabled={isFetching}>
          <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      {comments.length === 0 ? (
        <p className="text-xs text-muted-foreground">No review comments</p>
      ) : (
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-1.5 text-xs">
              <MessageSquare className="size-3 mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <span className="font-medium">{c.author}</span>
                <p className="text-muted-foreground line-clamp-2">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
