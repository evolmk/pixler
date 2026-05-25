import { Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@pixler/ui/components/tooltip';
import { useLinearStatus } from '../hooks/useLinear';

export function LinearStatusPill() {
  const { data: status, isLoading } = useLinearStatus();

  if (isLoading || !status) return null;
  if (!status.connected) return null;

  const label = status.organization
    ? `Linear: ${status.organization}`
    : `Linear: connected as ${status.viewerName ?? 'unknown'}`;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground"
            aria-label={label}
          >
            <Zap className="size-2.5 fill-emerald-500 text-emerald-500" />
            <span>Linear</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
