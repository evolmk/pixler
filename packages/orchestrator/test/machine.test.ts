import { describe, it, expect } from 'vitest';
import { createMachine, step } from '../src/machine.js';
import { clampMaxRejections, isAtLimit, DEFAULT_MAX_REJECTIONS, MIN_MAX_REJECTIONS, MAX_MAX_REJECTIONS } from '../src/loop-limit.js';
import { TERMINAL_PHASES, INTERRUPTIBLE_PHASES, GATE_PHASES } from '../src/states.js';

// ─── loop-limit ────────────────────────────────────────────────────────────

describe('loop-limit', () => {
  it('clamps below min', () => expect(clampMaxRejections(0)).toBe(MIN_MAX_REJECTIONS));
  it('clamps above max', () => expect(clampMaxRejections(99)).toBe(MAX_MAX_REJECTIONS));
  it('accepts valid value', () => expect(clampMaxRejections(3)).toBe(3));
  it('rounds floats', () => expect(clampMaxRejections(2.7)).toBe(3));
  it('isAtLimit true when at limit', () => expect(isAtLimit(3, 3)).toBe(true));
  it('isAtLimit false below limit', () => expect(isAtLimit(2, 3)).toBe(false));
  it('DEFAULT_MAX_REJECTIONS is 3', () => expect(DEFAULT_MAX_REJECTIONS).toBe(3));
});

// ─── states ────────────────────────────────────────────────────────────────

describe('state sets', () => {
  it('TERMINAL_PHASES contains done and error', () => {
    expect(TERMINAL_PHASES.has('done')).toBe(true);
    expect(TERMINAL_PHASES.has('error')).toBe(true);
  });
  it('INTERRUPTIBLE_PHASES contains active phases', () => {
    expect(INTERRUPTIBLE_PHASES.has('planning')).toBe(true);
    expect(INTERRUPTIBLE_PHASES.has('executing')).toBe(true);
  });
  it('GATE_PHASES contains all three gates', () => {
    expect(GATE_PHASES.has('awaiting_plan_approval')).toBe(true);
    expect(GATE_PHASES.has('awaiting_validation_approval')).toBe(true);
    expect(GATE_PHASES.has('awaiting_pr_approval')).toBe(true);
  });
});

// ─── createMachine ─────────────────────────────────────────────────────────

describe('createMachine', () => {
  it('starts in idle phase', () => {
    expect(createMachine().phase).toBe('idle');
  });

  it('applies default maxRejections', () => {
    expect(createMachine().maxRejections).toBe(DEFAULT_MAX_REJECTIONS);
  });

  it('clamps custom maxRejections', () => {
    expect(createMachine({ maxRejections: 99 }).maxRejections).toBe(MAX_MAX_REJECTIONS);
  });

  it('stores ticketId', () => {
    expect(createMachine({ ticketId: 'TKT-1' }).ticketId).toBe('TKT-1');
  });

  it('all auto-approve flags default to false', () => {
    const ctx = createMachine();
    expect(ctx.autoApprovePlan).toBe(false);
    expect(ctx.autoApproveValidation).toBe(false);
    expect(ctx.autoApprovePr).toBe(false);
  });

  it('sets auto-approve flags', () => {
    const ctx = createMachine({ autoApprovePlan: true, autoApproveValidation: true, autoApprovePr: true });
    expect(ctx.autoApprovePlan).toBe(true);
    expect(ctx.autoApproveValidation).toBe(true);
    expect(ctx.autoApprovePr).toBe(true);
  });
});

// ─── Happy path (manual gates) ─────────────────────────────────────────────

describe('happy path — manual gates', () => {
  it('idle → planning on START', () => {
    const ctx = createMachine();
    const { context, effects } = step(ctx, { type: 'START', ticketId: 'TKT-1' });
    expect(context.phase).toBe('planning');
    expect(context.ticketId).toBe('TKT-1');
    expect(effects).toContainEqual({ type: 'RUN_PLANNER' });
  });

  it('planning → reviewing on PLAN_DONE', () => {
    const ctx = { ...createMachine(), phase: 'planning' as const };
    const { context, effects } = step(ctx, { type: 'PLAN_DONE' });
    expect(context.phase).toBe('reviewing');
    expect(effects).toContainEqual({ type: 'RUN_REVIEWER' });
  });

  it('reviewing → awaiting_plan_approval on REVIEW_APPROVED (manual)', () => {
    const ctx = { ...createMachine(), phase: 'reviewing' as const };
    const { context, effects } = step(ctx, { type: 'REVIEW_APPROVED' });
    expect(context.phase).toBe('awaiting_plan_approval');
    expect(effects).toContainEqual({ type: 'NOTIFY_GATE', gate: 'plan' });
    expect(context.rejectionCount).toBe(0);
  });

  it('awaiting_plan_approval → executing on PLAN_APPROVED', () => {
    const ctx = { ...createMachine(), phase: 'awaiting_plan_approval' as const };
    const { context, effects } = step(ctx, { type: 'PLAN_APPROVED' });
    expect(context.phase).toBe('executing');
    expect(effects).toContainEqual({ type: 'RUN_EXECUTOR' });
  });

  it('executing → validating on EXEC_DONE', () => {
    const ctx = { ...createMachine(), phase: 'executing' as const };
    const { context, effects } = step(ctx, { type: 'EXEC_DONE' });
    expect(context.phase).toBe('validating');
    expect(effects).toContainEqual({ type: 'RUN_VALIDATOR' });
  });

  it('validating → awaiting_validation_approval on VALIDATION_DONE (manual)', () => {
    const ctx = { ...createMachine(), phase: 'validating' as const };
    const { context, effects } = step(ctx, { type: 'VALIDATION_DONE' });
    expect(context.phase).toBe('awaiting_validation_approval');
    expect(effects).toContainEqual({ type: 'NOTIFY_GATE', gate: 'validation' });
  });

  it('awaiting_validation_approval → awaiting_pr_approval on VALIDATION_APPROVED (manual pr)', () => {
    const ctx = { ...createMachine(), phase: 'awaiting_validation_approval' as const };
    const { context, effects } = step(ctx, { type: 'VALIDATION_APPROVED' });
    expect(context.phase).toBe('awaiting_pr_approval');
    expect(effects).toContainEqual({ type: 'NOTIFY_GATE', gate: 'pr' });
  });

  it('awaiting_pr_approval → pr_open on PR_APPROVED', () => {
    const ctx = { ...createMachine(), phase: 'awaiting_pr_approval' as const };
    const { context, effects } = step(ctx, { type: 'PR_APPROVED' });
    expect(context.phase).toBe('pr_open');
    expect(effects).toContainEqual({ type: 'OPEN_PR' });
  });

  it('pr_open → done on PR_OPENED', () => {
    const ctx = { ...createMachine(), phase: 'pr_open' as const };
    const { context, effects } = step(ctx, { type: 'PR_OPENED', prUrl: 'https://github.com/org/repo/pull/1' });
    expect(context.phase).toBe('done');
    expect(context.prUrl).toBe('https://github.com/org/repo/pull/1');
    expect(effects).toContainEqual({ type: 'NOTIFY_DONE', prUrl: 'https://github.com/org/repo/pull/1' });
  });
});

// ─── Auto-approve paths ────────────────────────────────────────────────────

describe('auto-approve plan', () => {
  it('reviewing → executing directly when autoApprovePlan=true', () => {
    const ctx = { ...createMachine({ autoApprovePlan: true }), phase: 'reviewing' as const };
    const { context, effects } = step(ctx, { type: 'REVIEW_APPROVED' });
    expect(context.phase).toBe('executing');
    expect(effects).toContainEqual({ type: 'RUN_EXECUTOR' });
  });
});

describe('auto-approve validation', () => {
  it('validating → awaiting_pr_approval when autoApproveValidation=true, autoApprovePr=false', () => {
    const ctx = { ...createMachine({ autoApproveValidation: true }), phase: 'validating' as const };
    const { context, effects } = step(ctx, { type: 'VALIDATION_DONE' });
    expect(context.phase).toBe('awaiting_pr_approval');
    expect(effects).toContainEqual({ type: 'NOTIFY_GATE', gate: 'pr' });
  });

  it('validating → pr_open when both autoApproveValidation + autoApprovePr=true', () => {
    const ctx = { ...createMachine({ autoApproveValidation: true, autoApprovePr: true }), phase: 'validating' as const };
    const { context, effects } = step(ctx, { type: 'VALIDATION_DONE' });
    expect(context.phase).toBe('pr_open');
    expect(effects).toContainEqual({ type: 'OPEN_PR' });
  });

  it('awaiting_validation_approval → pr_open directly when autoApprovePr=true', () => {
    const ctx = { ...createMachine({ autoApprovePr: true }), phase: 'awaiting_validation_approval' as const };
    const { context, effects } = step(ctx, { type: 'VALIDATION_APPROVED' });
    expect(context.phase).toBe('pr_open');
    expect(effects).toContainEqual({ type: 'OPEN_PR' });
  });
});

// ─── Rejection loop ─────────────────────────────────────────────────────────

describe('rejection loop', () => {
  it('REVIEW_REJECTED loops back to planning and increments count', () => {
    const ctx = { ...createMachine(), phase: 'reviewing' as const, rejectionCount: 0 };
    const { context, effects } = step(ctx, { type: 'REVIEW_REJECTED', critique: 'Too vague' });
    expect(context.phase).toBe('planning');
    expect(context.rejectionCount).toBe(1);
    expect(context.lastCritique).toBe('Too vague');
    expect(effects).toContainEqual({ type: 'RUN_PLANNER' });
  });

  it('REVIEW_REJECTED at max → paused', () => {
    const ctx = { ...createMachine({ maxRejections: 3 }), phase: 'reviewing' as const, rejectionCount: 2 };
    const { context, effects } = step(ctx, { type: 'REVIEW_REJECTED', critique: 'Still bad' });
    expect(context.phase).toBe('paused');
    expect(context.rejectionCount).toBe(3);
    expect(effects).toContainEqual({ type: 'NOTIFY_PAUSED', rejectionCount: 3 });
  });

  it('PLAN_REJECTED from human loops back to planning', () => {
    const ctx = { ...createMachine(), phase: 'awaiting_plan_approval' as const };
    const { context, effects } = step(ctx, { type: 'PLAN_REJECTED', note: 'Make it smaller' });
    expect(context.phase).toBe('planning');
    expect(context.lastCritique).toBe('Make it smaller');
    expect(effects).toContainEqual({ type: 'RUN_PLANNER' });
  });

  it('RESUME from paused → planning with reset count', () => {
    const ctx = { ...createMachine(), phase: 'paused' as const, rejectionCount: 3 };
    const { context, effects } = step(ctx, { type: 'RESUME' });
    expect(context.phase).toBe('planning');
    expect(context.rejectionCount).toBe(0);
    expect(effects).toContainEqual({ type: 'RUN_PLANNER' });
  });
});

// ─── VALIDATION_REJECTED ───────────────────────────────────────────────────

describe('validation rejection', () => {
  it('VALIDATION_REJECTED → re-executes', () => {
    const ctx = { ...createMachine(), phase: 'awaiting_validation_approval' as const };
    const { context, effects } = step(ctx, { type: 'VALIDATION_REJECTED' });
    expect(context.phase).toBe('executing');
    expect(effects).toContainEqual({ type: 'RUN_EXECUTOR' });
  });
});

// ─── INTERRUPT ─────────────────────────────────────────────────────────────

describe('interrupt', () => {
  const interruptiblePhases = ['planning', 'reviewing', 'executing', 'validating'] as const;
  for (const phase of interruptiblePhases) {
    it(`INTERRUPT from ${phase} → idle + KILL_AGENT`, () => {
      const ctx = { ...createMachine(), phase };
      const { context, effects } = step(ctx, { type: 'INTERRUPT' });
      expect(context.phase).toBe('idle');
      expect(effects).toContainEqual({ type: 'KILL_AGENT' });
    });
  }

  it('INTERRUPT from idle is a no-op', () => {
    const ctx = createMachine();
    const { context, effects } = step(ctx, { type: 'INTERRUPT' });
    expect(context.phase).toBe('idle');
    expect(effects).toHaveLength(0);
  });

  it('INTERRUPT from done is a no-op', () => {
    const ctx = { ...createMachine(), phase: 'done' as const };
    const { context, effects } = step(ctx, { type: 'INTERRUPT' });
    expect(context.phase).toBe('done');
    expect(effects).toHaveLength(0);
  });

  it('INTERRUPT from paused is a no-op', () => {
    const ctx = { ...createMachine(), phase: 'paused' as const };
    const { context, effects } = step(ctx, { type: 'INTERRUPT' });
    expect(context.phase).toBe('paused');
    expect(effects).toHaveLength(0);
  });
});

// ─── ERROR ─────────────────────────────────────────────────────────────────

describe('error', () => {
  it('ERROR from any phase → error state', () => {
    const phases = ['idle', 'planning', 'executing', 'done'] as const;
    for (const phase of phases) {
      const ctx = { ...createMachine(), phase };
      const { context } = step(ctx, { type: 'ERROR', error: 'boom' });
      expect(context.phase).toBe('error');
      expect(context.error).toBe('boom');
    }
  });
});

// ─── Ignored events (wrong-phase guards) ───────────────────────────────────

describe('wrong-phase guards — events ignored without state change', () => {
  it('PLAN_DONE ignored when not in planning', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'PLAN_DONE' });
    expect(context.phase).toBe('idle');
  });

  it('EXEC_DONE ignored when not executing', () => {
    const ctx = { ...createMachine(), phase: 'reviewing' as const };
    const { context } = step(ctx, { type: 'EXEC_DONE' });
    expect(context.phase).toBe('reviewing');
  });

  it('PR_APPROVED ignored when not awaiting_pr_approval', () => {
    const ctx = { ...createMachine(), phase: 'executing' as const };
    const { context } = step(ctx, { type: 'PR_APPROVED' });
    expect(context.phase).toBe('executing');
  });

  it('START ignored when already planning', () => {
    const ctx = { ...createMachine(), phase: 'planning' as const };
    const { context } = step(ctx, { type: 'START' });
    expect(context.phase).toBe('planning');
  });

  it('RESUME ignored when not paused', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'RESUME' });
    expect(context.phase).toBe('idle');
  });

  it('VALIDATION_APPROVED ignored when not awaiting_validation_approval', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'VALIDATION_APPROVED' });
    expect(context.phase).toBe('idle');
  });

  it('VALIDATION_REJECTED ignored when not awaiting_validation_approval', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'VALIDATION_REJECTED' });
    expect(context.phase).toBe('idle');
  });

  it('REVIEW_APPROVED ignored when not reviewing', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'REVIEW_APPROVED' });
    expect(context.phase).toBe('idle');
  });

  it('REVIEW_REJECTED ignored when not reviewing', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'REVIEW_REJECTED', critique: 'x' });
    expect(context.phase).toBe('idle');
  });

  it('PLAN_APPROVED ignored when not awaiting_plan_approval', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'PLAN_APPROVED' });
    expect(context.phase).toBe('idle');
  });

  it('PLAN_REJECTED ignored when not awaiting_plan_approval', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'PLAN_REJECTED' });
    expect(context.phase).toBe('idle');
  });

  it('PR_OPENED ignored when not pr_open', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'PR_OPENED', prUrl: 'https://x' });
    expect(context.phase).toBe('idle');
  });

  it('VALIDATION_DONE ignored when not validating', () => {
    const ctx = { ...createMachine(), phase: 'idle' as const };
    const { context } = step(ctx, { type: 'VALIDATION_DONE' });
    expect(context.phase).toBe('idle');
  });
});

// ─── START from error state ─────────────────────────────────────────────────

describe('restart from error', () => {
  it('START from error → planning', () => {
    const ctx = { ...createMachine(), phase: 'error' as const };
    const { context, effects } = step(ctx, { type: 'START' });
    expect(context.phase).toBe('planning');
    expect(effects).toContainEqual({ type: 'RUN_PLANNER' });
  });
});
