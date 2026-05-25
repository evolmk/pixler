import { Paperclip, FileText, AlignLeft } from 'lucide-react';
import { Badge } from '@pixler/ui/components/badge';
import { cn } from '@pixler/ui/lib/utils';
import type { PlanStorageMode } from '@pixler/shared-types';

interface Props {
  mode: PlanStorageMode;
  onClick?: () => void;
}

const CONFIG: Record<PlanStorageMode, { icon: React.ElementType; label: string }> = {
  file: { icon: FileText, label: 'File' },
  inline: { icon: AlignLeft, label: 'Inline' },
  attachment: { icon: Paperclip, label: 'Attachment' },
  auto: { icon: FileText, label: 'Auto' },
};

export function PlanStorageBadge({ mode, onClick }: Props) {
  const { icon: Icon, label } = CONFIG[mode] ?? CONFIG.file;

  return (
    <Badge
      variant="secondary"
      className={cn('gap-1 text-xs', onClick && 'cursor-pointer hover:bg-accent')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}
