import type { AgentPhase } from '@pixler/orchestrator';

interface Props {
  phase: AgentPhase;
  className?: string;
}

const PHASE_CONFIG: Record<AgentPhase, { label: string; color: string }> = {
  idle: { label: 'Idle', color: 'bg-muted text-muted-foreground' },
  planning: { label: 'Planning', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  reviewing: { label: 'Reviewing', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' },
  awaiting_plan_approval: { label: 'Awaiting approval', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  executing: { label: 'Executing', color: 'bg-primary/15 text-primary' },
  validating: { label: 'Validating', color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' },
  awaiting_validation_approval: { label: 'Awaiting review', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  awaiting_pr_approval: { label: 'Awaiting PR', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  pr_open: { label: 'PR open', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  done: { label: 'Done', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  paused: { label: 'Paused', color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
  error: { label: 'Error', color: 'bg-destructive/15 text-destructive' },
};

const ANIMATED_PHASES = new Set<AgentPhase>(['planning', 'reviewing', 'executing', 'validating']);

export function WorkspaceStateBadge({ phase, className = '' }: Props) {
  const config = PHASE_CONFIG[phase] ?? PHASE_CONFIG.idle;
  const animate = ANIMATED_PHASES.has(phase);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${config.color} ${className}`}
    >
      {animate && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {config.label}
    </span>
  );
}
