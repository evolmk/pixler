import type {
  WorkflowDef,
  WorkflowStep,
  WorkflowContext,
  WorkflowRunState,
  StepState,
  StepStatus,
  StepEvent,
  StepExecutor,
} from './workflow-types.js';

export class WorkflowRunner {
  private readonly steps: StepState[];
  private status: WorkflowRunState['status'] = 'running';
  private currentStepIndex = 0;
  private approvalResolve: ((approved: boolean) => void) | null = null;

  constructor(
    private readonly workflow: WorkflowDef,
    private readonly context: WorkflowContext,
    private readonly onEvent: (event: StepEvent) => void,
    private readonly executor: StepExecutor,
  ) {
    this.steps = workflow.steps.map((s) => ({
      id: s.id,
      label: s.label ?? s.id,
      type: s.type,
      status: 'pending' as StepStatus,
    }));
  }

  get state(): WorkflowRunState {
    const current = this.steps.find((s) => s.status === 'running' || s.status === 'awaiting_approval');
    return {
      workflowName: this.workflow.name,
      currentStepId: current?.id ?? null,
      steps: [...this.steps],
      status: this.status,
    };
  }

  async run(): Promise<WorkflowRunState> {
    for (let i = 0; i < this.workflow.steps.length; i++) {
      if (this.status === 'cancelled') break;

      const step = this.workflow.steps[i];
      const state = this.steps[i];
      if (!step || !state) continue;
      this.currentStepIndex = i;

      // Evaluate skip_if
      if (step.skip_if && this.evalSkipIf(step.skip_if)) {
        state.status = 'skipped';
        this.context.steps[step.id] = { status: 'skipped' };
        this.onEvent({ type: 'step:skipped', stepId: step.id, label: state.label });
        continue;
      }

      state.status = 'running';
      state.startedAt = new Date().toISOString();
      this.onEvent({ type: 'step:start', stepId: step.id, label: state.label });

      // Handle approval steps
      if (step.type === 'approval') {
        state.status = 'awaiting_approval';
        const message = this.interpolate(step.message ?? 'Please review and approve.');
        this.onEvent({ type: 'step:approval', stepId: step.id, label: state.label, payload: { message } });

        const approved = await this.waitForApproval();
        if (!approved) {
          this.status = 'cancelled';
          state.status = 'failed';
          state.error = 'Approval denied';
          this.onEvent({ type: 'step:error', stepId: step.id, error: 'Approval denied' });
          break;
        }
        state.status = 'completed';
        state.completedAt = new Date().toISOString();
        this.context.steps[step.id] = { status: 'completed' };
        this.onEvent({ type: 'step:complete', stepId: step.id, label: state.label });
        continue;
      }

      // Execute step with retry support
      const maxAttempts = step.retry?.max_attempts ?? 1;
      const delayMs = step.retry?.delay_ms ?? 0;
      let lastError: string | undefined;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (attempt > 0 && delayMs > 0) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
        try {
          const output = await this.executor(step, this.context);
          state.status = 'completed';
          state.completedAt = new Date().toISOString();
          this.context.steps[step.id] = { output, status: 'completed' };
          this.onEvent({ type: 'step:complete', stepId: step.id, label: state.label, payload: output });
          lastError = undefined;
          break;
        } catch (err) {
          lastError = err instanceof Error ? err.message : String(err);
        }
      }

      if (lastError) {
        const onError = step.on_error ?? 'fail';
        if (onError === 'skip') {
          state.status = 'skipped';
          this.context.steps[step.id] = { status: 'skipped' };
          this.onEvent({ type: 'step:skipped', stepId: step.id, label: state.label });
        } else {
          state.status = 'failed';
          state.error = lastError;
          this.context.steps[step.id] = { status: 'failed' };
          this.onEvent({ type: 'step:error', stepId: step.id, error: lastError });
          if (onError === 'fail') {
            this.status = 'failed';
            break;
          }
        }
      }
    }

    if (this.status === 'running') this.status = 'completed';
    return this.state;
  }

  /** Called when user approves/rejects an approval step. */
  resolve(approved: boolean): void {
    if (this.approvalResolve) {
      this.approvalResolve(approved);
      this.approvalResolve = null;
    }
  }

  cancel(): void {
    this.status = 'cancelled';
    this.resolve(false);
  }

  private waitForApproval(): Promise<boolean> {
    return new Promise<boolean>((res) => {
      this.approvalResolve = res;
    });
  }

  private evalSkipIf(expr: string): boolean {
    try {
      // Support simple property access: $issue.field, $workflow.field
      const normalized = expr.trim();
      if (normalized.startsWith('$issue.')) {
        const field = normalized.slice('$issue.'.length);
        return !!(this.context.issue as Record<string, unknown>)[field];
      }
      if (normalized.startsWith('$workflow.')) {
        const field = normalized.slice('$workflow.'.length);
        return !!(this.context.workflow as Record<string, unknown>)[field];
      }
      if (normalized.startsWith('$step.')) {
        const parts = normalized.slice('$step.'.length).split('.');
        const stepId = parts[0] ?? '';
        const rest = parts.slice(1).join('.');
        const stepCtx = this.context.steps[stepId];
        if (!stepCtx) return false;
        if (rest === 'output') return !!stepCtx.output;
        if (rest === 'status') return !!stepCtx.status;
      }
      return false;
    } catch {
      return false;
    }
  }

  private interpolate(template: string): string {
    return template.replace(/\{\{\s*(\S+)\s*\}\}/g, (_, key: string) => {
      const parts = key.split('.');
      const root = parts[0];
      const field = parts[1] ?? '';
      if (root === 'issue') return String((this.context.issue as Record<string, unknown>)[field] ?? '');
      if (root === 'plan_filename') return `plan-${this.context.issue.id}.md`;
      return `{{${key}}}`;
    });
  }
}
