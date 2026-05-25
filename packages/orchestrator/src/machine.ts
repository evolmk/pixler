import type { AgentPhase } from './states.js';
import type { MachineEvent, SideEffect } from './events.js';
import { isAtLimit, clampMaxRejections, DEFAULT_MAX_REJECTIONS } from './loop-limit.js';

export interface MachineContext {
  phase: AgentPhase;
  rejectionCount: number;
  maxRejections: number;
  autoApprovePlan: boolean;
  autoApproveValidation: boolean;
  autoApprovePr: boolean;
  ticketId?: string;
  prUrl?: string;
  lastCritique?: string;
  error?: string;
}

export interface StepResult {
  context: MachineContext;
  effects: SideEffect[];
}

export interface MachineOptions {
  maxRejections?: number;
  autoApprovePlan?: boolean;
  autoApproveValidation?: boolean;
  autoApprovePr?: boolean;
  ticketId?: string;
}

export function createMachine(opts: MachineOptions = {}): MachineContext {
  return {
    phase: 'idle',
    rejectionCount: 0,
    maxRejections: clampMaxRejections(opts.maxRejections ?? DEFAULT_MAX_REJECTIONS),
    autoApprovePlan: opts.autoApprovePlan ?? false,
    autoApproveValidation: opts.autoApproveValidation ?? false,
    autoApprovePr: opts.autoApprovePr ?? false,
    ticketId: opts.ticketId,
  };
}

export function step(ctx: MachineContext, event: MachineEvent): StepResult {
  const next = (phase: AgentPhase, patch: Partial<MachineContext> = {}): MachineContext => ({
    ...ctx,
    ...patch,
    phase,
  });

  switch (event.type) {
    case 'START': {
      if (ctx.phase !== 'idle' && ctx.phase !== 'paused' && ctx.phase !== 'error') {
        return { context: ctx, effects: [] };
      }
      return {
        context: next('planning', { ticketId: event.ticketId ?? ctx.ticketId, rejectionCount: 0 }),
        effects: [{ type: 'RUN_PLANNER' }],
      };
    }

    case 'PLAN_DONE': {
      if (ctx.phase !== 'planning') return { context: ctx, effects: [] };
      return {
        context: next('reviewing'),
        effects: [{ type: 'RUN_REVIEWER' }],
      };
    }

    case 'REVIEW_APPROVED': {
      if (ctx.phase !== 'reviewing') return { context: ctx, effects: [] };
      if (ctx.autoApprovePlan) {
        return {
          context: next('executing', { rejectionCount: 0 }),
          effects: [{ type: 'RUN_EXECUTOR' }],
        };
      }
      return {
        context: next('awaiting_plan_approval', { rejectionCount: 0 }),
        effects: [{ type: 'NOTIFY_GATE', gate: 'plan' }],
      };
    }

    case 'REVIEW_REJECTED': {
      if (ctx.phase !== 'reviewing') return { context: ctx, effects: [] };
      const newCount = ctx.rejectionCount + 1;
      if (isAtLimit(newCount, ctx.maxRejections)) {
        return {
          context: next('paused', { rejectionCount: newCount, lastCritique: event.critique }),
          effects: [{ type: 'NOTIFY_PAUSED', rejectionCount: newCount }],
        };
      }
      return {
        context: next('planning', { rejectionCount: newCount, lastCritique: event.critique }),
        effects: [{ type: 'RUN_PLANNER' }],
      };
    }

    case 'PLAN_APPROVED': {
      if (ctx.phase !== 'awaiting_plan_approval') return { context: ctx, effects: [] };
      return {
        context: next('executing'),
        effects: [{ type: 'RUN_EXECUTOR' }],
      };
    }

    case 'PLAN_REJECTED': {
      if (ctx.phase !== 'awaiting_plan_approval') return { context: ctx, effects: [] };
      return {
        context: next('planning', { lastCritique: event.note }),
        effects: [{ type: 'RUN_PLANNER' }],
      };
    }

    case 'EXEC_DONE': {
      if (ctx.phase !== 'executing') return { context: ctx, effects: [] };
      return {
        context: next('validating'),
        effects: [{ type: 'RUN_VALIDATOR' }],
      };
    }

    case 'VALIDATION_DONE': {
      if (ctx.phase !== 'validating') return { context: ctx, effects: [] };
      if (ctx.autoApproveValidation) {
        if (ctx.autoApprovePr) {
          return {
            context: next('pr_open'),
            effects: [{ type: 'OPEN_PR' }],
          };
        }
        return {
          context: next('awaiting_pr_approval'),
          effects: [{ type: 'NOTIFY_GATE', gate: 'pr' }],
        };
      }
      return {
        context: next('awaiting_validation_approval'),
        effects: [{ type: 'NOTIFY_GATE', gate: 'validation' }],
      };
    }

    case 'VALIDATION_APPROVED': {
      if (ctx.phase !== 'awaiting_validation_approval') return { context: ctx, effects: [] };
      if (ctx.autoApprovePr) {
        return {
          context: next('pr_open'),
          effects: [{ type: 'OPEN_PR' }],
        };
      }
      return {
        context: next('awaiting_pr_approval'),
        effects: [{ type: 'NOTIFY_GATE', gate: 'pr' }],
      };
    }

    case 'VALIDATION_REJECTED': {
      if (ctx.phase !== 'awaiting_validation_approval') return { context: ctx, effects: [] };
      return {
        context: next('executing'),
        effects: [{ type: 'RUN_EXECUTOR' }],
      };
    }

    case 'PR_APPROVED': {
      if (ctx.phase !== 'awaiting_pr_approval') return { context: ctx, effects: [] };
      return {
        context: next('pr_open'),
        effects: [{ type: 'OPEN_PR' }],
      };
    }

    case 'PR_OPENED': {
      if (ctx.phase !== 'pr_open') return { context: ctx, effects: [] };
      return {
        context: next('done', { prUrl: event.prUrl }),
        effects: [{ type: 'NOTIFY_DONE', prUrl: event.prUrl }],
      };
    }

    case 'INTERRUPT': {
      if (ctx.phase === 'idle' || ctx.phase === 'done' || ctx.phase === 'paused') {
        return { context: ctx, effects: [] };
      }
      return {
        context: next('idle'),
        effects: [{ type: 'KILL_AGENT' }],
      };
    }

    case 'RESUME': {
      if (ctx.phase !== 'paused') return { context: ctx, effects: [] };
      return {
        context: next('planning', { rejectionCount: 0 }),
        effects: [{ type: 'RUN_PLANNER' }],
      };
    }

    case 'ERROR': {
      return {
        context: next('error', { error: event.error }),
        effects: [],
      };
    }

    /* c8 ignore next 4 */
    default: {
      const _exhaustive: never = event;
      return { context: ctx, effects: [] };
    }
  }
}
