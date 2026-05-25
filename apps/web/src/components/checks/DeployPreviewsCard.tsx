import { ExternalLink } from 'lucide-react';

interface Props {
  workspaceId: string;
}

export function DeployPreviewsCard({ workspaceId: _ }: Props) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <ExternalLink className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-medium">Deploy Previews</span>
      </div>
      <p className="text-xs text-muted-foreground">No deploy previews</p>
    </div>
  );
}
