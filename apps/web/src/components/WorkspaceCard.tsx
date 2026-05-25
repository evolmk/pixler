import { useState, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import type { Workspace, WorkspaceState } from '@pixler/shared-types';
import { Badge } from '@pixler/ui/components/badge';
import { WorkspaceContextMenu } from './WorkspaceContextMenu';
import { useArchiveWorkspace } from '../hooks/useWorkspaces';

const LONG_PRESS_MS = 500;

const STATE_COLORS: Record<WorkspaceState, string> = {
  pending: '#94a3b8',
  setting_up: '#f59e0b',
  ready: '#16a355',
  error: '#ef4444',
  archived: '#6b7280',
};

const STATE_BADGE: Record<WorkspaceState, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'outline',
  setting_up: 'secondary',
  ready: 'default',
  error: 'destructive',
  archived: 'outline',
};

const STATE_LABEL: Record<WorkspaceState, string> = {
  pending: 'pending',
  setting_up: 'setup',
  ready: 'ready',
  error: 'error',
  archived: 'archived',
};

interface WorkspaceCardProps {
  workspace: Workspace;
  onRemove: () => void;
}

const SWIPE_THRESHOLD = 0.5;
const FLICK_VELOCITY = 0.5;
const CARD_WIDTH = 220;

export function WorkspaceCard({ workspace, onRemove }: WorkspaceCardProps) {
  const dotColor = STATE_COLORS[workspace.state];
  const archive = useArchiveWorkspace();
  const [swiped, setSwiped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-CARD_WIDTH * 0.6, 0, CARD_WIDTH * 0.6], [0.3, 1, 0.3]);
  const archiveLabelOpacity = useTransform(x, [0, CARD_WIDTH * 0.3], [0, 1]);

  const bind = useDrag(
    ({ movement: [mx], velocity: [vx], last, cancel }) => {
      if (workspace.state === 'archived') { cancel?.(); return; }
      x.set(mx);

      if (last) {
        const pct = Math.abs(mx) / CARD_WIDTH;
        const flick = Math.abs(vx) > FLICK_VELOCITY;
        if (pct > SWIPE_THRESHOLD || flick) {
          setSwiped(true);
          void animate(x, mx > 0 ? CARD_WIDTH * 1.5 : -CARD_WIDTH * 1.5, {
            type: 'spring',
            stiffness: 300,
            damping: 30,
            onComplete: () => archive.mutate(workspace.id),
          });
        } else {
          void animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 });
        }
      }
    },
    { axis: 'x', filterTaps: true },
  );

  if (swiped) return null;

  // Separate the gesture handler div from the motion.div to avoid type conflicts
  // (use-gesture onDrag vs motion onDrag have incompatible signatures)
  const gestureHandlers = bind() as React.HTMLAttributes<HTMLDivElement>;

  return (
    <div className="relative overflow-hidden rounded-md">
      {/* Archive hint visible behind */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end px-4 text-[10px] font-medium text-muted-foreground"
        style={{ opacity: archiveLabelOpacity }}
      >
        Archive
      </motion.div>

      <div
        {...gestureHandlers}
        onPointerDown={(e) => {
          gestureHandlers.onPointerDown?.(e);
          longPressTimer.current = setTimeout(() => setMenuOpen(true), LONG_PRESS_MS);
        }}
        onPointerUp={(e) => {
          gestureHandlers.onPointerUp?.(e);
          if (longPressTimer.current) clearTimeout(longPressTimer.current);
        }}
        onPointerLeave={(e) => {
          gestureHandlers.onPointerLeave?.(e);
          if (longPressTimer.current) clearTimeout(longPressTimer.current);
        }}
        className="group relative touch-pan-y select-none"
      >
        <motion.div
          style={{ x, opacity }}
          className="flex cursor-default items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
        >
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          <span className="flex-1 truncate text-sm">{workspace.name}</span>
          {workspace.pinned && (
            <span className="text-xs text-muted-foreground">📌</span>
          )}
          <Badge variant={STATE_BADGE[workspace.state]} className="py-0 text-[10px]">
            {STATE_LABEL[workspace.state]}
          </Badge>
          <WorkspaceContextMenu
            workspace={workspace}
            onRemove={onRemove}
            open={menuOpen}
            onOpenChange={setMenuOpen}
          />
        </motion.div>
      </div>
    </div>
  );
}
