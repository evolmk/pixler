import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { createMachine, step } from '@pixler/orchestrator';
import { WorkflowRunner } from '@pixler/orchestrator/server';
import type { MachineContext, SideEffect, WorkflowStep, WorkflowContext, StepEvent } from '@pixler/orchestrator';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { SettingsService } from '../settings/settings.service';
import { EventsService } from '../events/events.service';
import { AgentRunnerService } from './agent-runner.service';
import { PromptTemplatesService } from './prompt-templates.service';
import { LinearBridgeService } from './linear-bridge.service';
import { LinearService } from '../linear/linear.service';
import { TriggersService } from '../checkpoints/triggers.service';
import { WorkflowsService } from '../workflows/workflows.service';
import { WorkflowRunsService } from '../workflows/workflow-runs.service';
import { TerminalsService } from '../terminals/terminals.service';

const exec = promisify(execCb);

const AUTO_APPROVE_DELAY_MS = 800;

@Injectable()
export class OrchestratorService implements OnModuleInit {
  private readonly logger = new Logger(OrchestratorService.name);
  private machines = new Map<string, MachineContext>();
  private workflowRunners = new Map<string, WorkflowRunner>();
  private workflowRunIds = new Map<string, string>(); // workspaceId → runId
  private workflowStepPrompts = new Map<string, { stepId: string; label: string; prompt: string }>(); // workspaceId → current step prompt

  constructor(
    private readonly workspaces: WorkspacesService,
    private readonly settings: SettingsService,
    private readonly events: EventsService,
    private readonly runner: AgentRunnerService,
    private readonly templates: PromptTemplatesService,
    private readonly linearBridge: LinearBridgeService,
    private readonly linear: LinearService,
    private readonly triggers: TriggersService,
    private readonly workflowsService: WorkflowsService,
    private readonly workflowRuns: WorkflowRunsService,
    private readonly terminals: TerminalsService,
  ) {}

  onModuleInit(): void {
    this.rehydratePausedRuns();
  }

  private rehydratePausedRuns(): void {
    try {
      const paused = this.workflowRuns.findAllPaused();
      for (const run of paused) {
        const loader = this.workflowsService.getLoader();
        const workflowDef = loader.loadByName(run.workflowName);
        if (!workflowDef) continue;

        const context = run.context as unknown as WorkflowContext;
        const wfRunner = new WorkflowRunner(
          workflowDef,
          context,
          (event: StepEvent) => this.emitStepEvent(run.workspaceId, event, run.id),
          (wfStep: WorkflowStep, ctx: WorkflowContext) =>
            this.executeWorkflowStep(run.workspaceId, wfStep, ctx),
          { steps: workflowDef.steps.map((s, i) => ({
              id: s.id,
              label: s.label ?? s.id,
              type: s.type,
              status: i < run.currentStepIndex ? 'completed' : 'pending' as const,
            })),
            currentStepIndex: run.currentStepIndex,
            context,
          },
        );
        this.workflowRunners.set(run.workspaceId, wfRunner);
        this.workflowRunIds.set(run.workspaceId, run.id);
        this.logger.log(`[Workflow] Rehydrated paused run ${run.id} for workspace ${run.workspaceId}`);
      }
    } catch (err) {
      this.logger.warn(`[Workflow] Boot rehydration failed: ${String(err)}`);
    }
  }

  getState(workspaceId: string): MachineContext | null {
    return this.machines.get(workspaceId) ?? null;
  }

  countRunning(): number {
    let count = 0;
    for (const ctx of this.machines.values()) {
      if (ctx.phase !== 'idle' && ctx.phase !== 'done' && ctx.phase !== 'error') {
        count++;
      }
    }
    return count;
  }

  async start(workspaceId: string): Promise<void> {
    const ws = this.workspaces.findOne(workspaceId);
    const projectId = ws.project_id;

    // Check if any ticket label matches a workflow name
    if (ws.ticket_id) {
      const workflow = await this.findWorkflowForTicket(ws.ticket_id, ws.worktree_path ?? undefined);
      if (workflow) {
        this.logger.log(`[Workflow] Running '${workflow.name}' for ticket ${ws.ticket_id}`);
        await this.runWorkflow(workspaceId, workflow, ws.ticket_id);
        return;
      }
    }

    // Fall back to the hardcoded state machine
    const ctx = createMachine({
      maxRejections: (this.settings.get('gates.loopLimit', { projectId }) as number) ?? 3,
      autoApprovePlan: (this.settings.get('gates.autoApprovePlan', { projectId }) as boolean) ?? false,
      autoApproveValidation: (this.settings.get('gates.autoApproveValidation', { projectId }) as boolean) ?? false,
      autoApprovePr: (this.settings.get('gates.autoApprovePr', { projectId }) as boolean) ?? false,
      ticketId: ws.ticket_id ?? undefined,
    });

    this.machines.set(workspaceId, ctx);
    this.applyAndDrive(workspaceId, ctx, [{ type: 'START', ticketId: ws.ticket_id ?? undefined }]);
  }

  private async findWorkflowForTicket(ticketId: string, repoDir?: string) {
    try {
      const ticket = await this.linear.fetchTicket(ticketId);
      const labelNames = ticket.labels.map((l) => l.name.toLowerCase());
      if (!labelNames.length) return null;
      const workflows = this.workflowsService.list(repoDir);
      return workflows.find((wf) => !wf.archived && labelNames.includes(wf.name.toLowerCase())) ?? null;
    } catch {
      return null;
    }
  }

  private emitStepEvent(workspaceId: string, event: StepEvent, runId?: string): void {
    this.events.emitWorkspaceEvent(workspaceId, {
      type: 'workflow.step',
      stepEventType: event.type,
      stepId: event.stepId,
      label: event.label,
      payload: event.payload,
      error: event.error,
      workspaceId,
      timestamp: Date.now(),
    });

    if (runId) {
      const runner = this.workflowRunners.get(workspaceId);
      if (runner) {
        const state = runner.state;
        const status = state.status === 'running' ? 'running' : state.status;
        this.workflowRuns.updateStatus(runId, status, state.steps.findIndex((s) => s.id === event.stepId));
        this.events.emitWorkspaceEvent(workspaceId, {
          type: 'workflow.run-updated',
          workspaceId,
          runId,
          status,
          currentStepIndex: state.steps.findIndex((s) => s.id === event.stepId),
          timestamp: Date.now(),
        });
      }
    }
  }

  private async runWorkflow(workspaceId: string, workflowDto: { name: string }, ticketId: string): Promise<void> {
    const ws = this.workspaces.findOne(workspaceId);
    const loader = this.workflowsService.getLoader();
    const workflowDef = loader.loadByName(workflowDto.name, ws.worktree_path ?? undefined);
    if (!workflowDef) return;

    let issueTitle = ticketId;
    let issueDescription: string | null = null;
    try {
      const ticket = await this.linear.fetchTicket(ticketId);
      issueTitle = ticket.title;
      issueDescription = ticket.description;
    } catch {
      // non-fatal — use ticketId as title
    }

    const context: WorkflowContext = {
      issue: {
        id: ticketId,
        title: issueTitle,
        description: issueDescription,
      },
      workflow: {},
      steps: {},
    };

    const runRecord = this.workflowRuns.create(workspaceId, workflowDto.name, context);

    const workflowRunner = new WorkflowRunner(
      workflowDef,
      context,
      (event: StepEvent) => this.emitStepEvent(workspaceId, event, runRecord.id),
      (wfStep: WorkflowStep, ctx: WorkflowContext) => this.executeWorkflowStep(workspaceId, wfStep, ctx),
    );

    this.workflowRunners.set(workspaceId, workflowRunner);
    this.workflowRunIds.set(workspaceId, runRecord.id);

    try {
      void this.linearBridge.onWorkspaceStart(ticketId, ws.project_id);
      const finalState = await workflowRunner.run();
      this.workflowRunners.delete(workspaceId);
      this.workflowRunIds.delete(workspaceId);
      this.workflowRuns.updateStatus(runRecord.id, finalState.status);

      if (finalState.status === 'completed') {
        void this.linearBridge.onPrMerged(ticketId, ws.project_id);
        this.events.emitWorkspaceEvent(workspaceId, {
          type: 'agent.done',
          workspaceId,
          prUrl: undefined,
          timestamp: Date.now(),
        });
      } else {
        this.events.emitWorkspaceEvent(workspaceId, {
          type: 'agent.error',
          workspaceId,
          error: `Workflow ${finalState.status}`,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      this.workflowRunners.delete(workspaceId);
      const runId = this.workflowRunIds.get(workspaceId);
      this.workflowRunIds.delete(workspaceId);
      if (runId) this.workflowRuns.updateStatus(runId, 'failed');
      this.events.emitWorkspaceEvent(workspaceId, {
        type: 'agent.error',
        workspaceId,
        error: String(err),
        timestamp: Date.now(),
      });
    }
  }

  getWorkflowRunId(workspaceId: string): string | undefined {
    return this.workflowRunIds.get(workspaceId);
  }

  private async executeWorkflowStep(
    workspaceId: string,
    step: WorkflowStep,
    ctx: WorkflowContext,
  ): Promise<unknown> {
    const ws = this.workspaces.findOne(workspaceId);

    // Auto-run: open PR (non-AI, no user interaction needed)
    if (step.type === 'builtin:open_pr') {
      void this.linearBridge.onPrOpened(ctx.issue.id, ws.project_id);
      this.events.emitWorkspaceEvent(workspaceId, {
        type: 'agent.state-changed',
        workspaceId,
        from: 'executing',
        to: 'pr_open',
        timestamp: Date.now(),
      });
      return null;
    }

    // Auto-run: bash step executes the command and resolves on exit
    if (step.type === 'bash') {
      return this.runBashStep(workspaceId, step, ws.worktree_path ?? process.cwd());
    }

    // Terminal-driven: all AI steps (builtin:* and prompt)
    return this.runAiStepTerminalDriven(workspaceId, step, ctx, ws.worktree_path ?? process.cwd());
  }

  private async runBashStep(workspaceId: string, step: WorkflowStep, cwd: string): Promise<unknown> {
    const command = step.prompt;
    if (!command) return null;
    this.logger.log(`[${workspaceId}] bash step: ${command.slice(0, 80)}`);
    try {
      const { stdout, stderr } = await exec(command, { cwd, timeout: 300_000 });
      return { stdout: stdout.trim(), stderr: stderr.trim() };
    } catch (err) {
      throw new Error(`Bash step failed: ${String(err)}`);
    }
  }

  private async runAiStepTerminalDriven(
    workspaceId: string,
    step: WorkflowStep,
    ctx: WorkflowContext,
    cwd: string,
  ): Promise<unknown> {
    const phaseMap: Partial<Record<WorkflowStep['type'], 'planning' | 'reviewing' | 'executing' | 'validating'>> = {
      'builtin:create_plan': 'planning',
      'builtin:review_issue': 'reviewing',
      'builtin:review_plan': 'reviewing',
      'builtin:run_plan': 'executing',
      'builtin:qa_review': 'validating',
    };
    const phase = phaseMap[step.type];

    // Snapshot before file-writing steps (executing phase)
    if (phase === 'executing') void this.triggers.onBeforeExecution(workspaceId);

    const prompt = step.prompt
      ? step.prompt
      : phase
        ? this.templates.build(phase, {
            workspaceId,
            ticketId: ctx.issue.id,
            planPath: `docs/plans/${ctx.issue.id}.md`,
          })
        : (step.prompt ?? '');

    const label = step.label ?? step.id;

    if (phase) {
      this.events.emitWorkspaceEvent(workspaceId, {
        type: 'agent.state-changed',
        workspaceId,
        from: 'idle',
        to: phase,
        timestamp: Date.now(),
      });
    }

    // Store prompt so send-to-terminal can retrieve it
    this.workflowStepPrompts.set(workspaceId, { stepId: step.id, label, prompt });

    // Set step status to awaiting_run so UI shows it correctly
    const wfRunner = this.workflowRunners.get(workspaceId);
    wfRunner?.setStepStatus(step.id, 'awaiting_run');

    // Emit the prompt event for the UI to display the accordion
    this.events.emitWorkspaceEvent(workspaceId, {
      type: 'workflow.step-prompt',
      workspaceId,
      stepId: step.id,
      stepLabel: label,
      prompt,
      timestamp: Date.now(),
    });

    this.logger.log(`[${workspaceId}] AI step '${step.id}' awaiting terminal run`);

    // Block until the user marks the step done (or stops/rejects it)
    const outcome = await (wfRunner?.waitForStepDone() ?? Promise.resolve('done' as const));

    this.workflowStepPrompts.delete(workspaceId);

    if (outcome === 'rejected') {
      throw new Error(`Step '${step.id}' was rejected`);
    }
    if (outcome === 'cancelled') {
      throw new Error(`Step '${step.id}' was cancelled`);
    }

    // Emit step-advanced so UI updates
    this.events.emitWorkspaceEvent(workspaceId, {
      type: 'workflow.step-advanced',
      workspaceId,
      stepId: step.id,
      status: 'completed',
      timestamp: Date.now(),
    });

    return { status: 'done', cwd };
  }

  approve(workspaceId: string): void {
    const wfRunner = this.workflowRunners.get(workspaceId);
    if (wfRunner) {
      wfRunner.resolve(true);
      return;
    }
    const ctx = this.machines.get(workspaceId);
    if (!ctx) return;
    const { context, effects } = step(ctx, { type: 'PLAN_APPROVED' });
    const { context: ctx2, effects: effects2 } = context.phase === ctx.phase
      ? step(ctx, { type: 'VALIDATION_APPROVED' })
      : { context, effects };
    const { context: ctx3, effects: effects3 } = ctx2.phase === ctx.phase
      ? step(ctx, { type: 'PR_APPROVED' })
      : { context: ctx2, effects: effects2 };
    this.machines.set(workspaceId, ctx3);
    void this.runEffects(workspaceId, ctx3, effects3.length ? effects3 : effects.length ? effects : effects2);
  }

  reject(workspaceId: string, note?: string): void {
    const wfRunner = this.workflowRunners.get(workspaceId);
    if (wfRunner) {
      wfRunner.resolve(false);
      return;
    }
    const ctx = this.machines.get(workspaceId);
    if (!ctx) return;
    const { context, effects } = step(ctx, { type: 'PLAN_REJECTED', note });
    const { context: ctx2, effects: effects2 } = context.phase === ctx.phase
      ? step(ctx, { type: 'VALIDATION_REJECTED' })
      : { context, effects };
    this.machines.set(workspaceId, ctx2);
    void this.runEffects(workspaceId, ctx2, effects2.length ? effects2 : effects);
  }

  interrupt(workspaceId: string): void {
    const wfRunner = this.workflowRunners.get(workspaceId);
    if (wfRunner) {
      wfRunner.cancel();
      this.workflowRunners.delete(workspaceId);
      this.runner.interrupt(workspaceId);
      return;
    }
    const ctx = this.machines.get(workspaceId);
    if (!ctx) return;
    this.runner.interrupt(workspaceId);
    const { context, effects } = step(ctx, { type: 'INTERRUPT' });
    this.machines.set(workspaceId, context);
    void this.runEffects(workspaceId, context, effects);
  }

  stop(workspaceId: string): void {
    const wfRunner = this.workflowRunners.get(workspaceId);
    if (wfRunner) {
      wfRunner.cancel();
      this.workflowRunners.delete(workspaceId);
    }
    this.runner.interrupt(workspaceId);
    this.machines.delete(workspaceId);
  }

  /** Mark the current AI step as done — advances the workflow. */
  markStepDone(workspaceId: string): void {
    const wfRunner = this.workflowRunners.get(workspaceId);
    wfRunner?.resolveStep('done');
    const runId = this.workflowRunIds.get(workspaceId);
    if (runId) {
      const promptInfo = this.workflowStepPrompts.get(workspaceId);
      if (promptInfo) {
        const existing = this.workflowRuns.findLastAttemptForStep(runId, promptInfo.stepId);
        if (existing) this.workflowRuns.updateAttempt(existing.id, 'completed');
      }
    }
  }

  /** Retry a step — implemented in Sprint 3. Stub here to satisfy controller. */
  async retryStep(_workspaceId: string, _dto: import('@pixler/shared-types').RetryStepDto): Promise<void> {
    // Sprint 3 implementation
    throw new Error('retryStep not yet implemented — see Sprint 3');
  }

  /** Pause the current workflow step — keeps run record, allows resume. */
  pauseStep(workspaceId: string): void {
    const wfRunner = this.workflowRunners.get(workspaceId);
    if (wfRunner) {
      wfRunner.pause();
    }
    const runId = this.workflowRunIds.get(workspaceId);
    if (runId) this.workflowRuns.updateStatus(runId, 'paused');
    // Don't delete runner — it stays paused in memory so UI can show it.
    // The runner's status is now 'paused'; any further step-done calls are ignored.
  }

  /** Send the current step's prompt to the workspace terminal. */
  sendStepToTerminal(workspaceId: string): { ok: boolean; noSession: boolean } {
    const promptInfo = this.workflowStepPrompts.get(workspaceId);
    if (!promptInfo) return { ok: false, noSession: false };

    const terminalIds = this.terminals.getForWorkspace(workspaceId);
    let targetId: string;
    if (terminalIds.length > 0) {
      targetId = terminalIds[0]!;
    } else {
      targetId = this.terminals.findOrCreate(workspaceId);
    }

    try {
      // Write the prompt text followed by newline into the terminal.
      // If no claude session is active the user will need to start one first.
      this.terminals.write(targetId, promptInfo.prompt + '\n');
      return { ok: true, noSession: false };
    } catch {
      return { ok: false, noSession: true };
    }
  }

  /** Get the current step prompt for display in the UI. */
  getCurrentStepPrompt(workspaceId: string): { stepId: string; label: string; prompt: string } | null {
    return this.workflowStepPrompts.get(workspaceId) ?? null;
  }

  private applyAndDrive(workspaceId: string, ctx: MachineContext, events: Parameters<typeof step>[1][]): void {
    let current = ctx;
    for (const event of events) {
      const { context, effects } = step(current, event);
      current = context;
      this.machines.set(workspaceId, current);
      void this.runEffects(workspaceId, current, effects);
    }
  }

  private emitStateChange(workspaceId: string, from: string, to: string): void {
    this.events.emitWorkspaceEvent(workspaceId, {
      type: 'agent.state-changed',
      workspaceId,
      from,
      to,
      timestamp: Date.now(),
    });
  }

  private async runEffects(workspaceId: string, ctx: MachineContext, effects: SideEffect[]): Promise<void> {
    const ws = this.workspaces.findOne(workspaceId);

    for (const effect of effects) {
      switch (effect.type) {
        case 'RUN_PLANNER':
        case 'RUN_REVIEWER':
        case 'RUN_EXECUTOR':
        case 'RUN_VALIDATOR': {
          const phaseMap = {
            RUN_PLANNER: 'planning',
            RUN_REVIEWER: 'reviewing',
            RUN_EXECUTOR: 'executing',
            RUN_VALIDATOR: 'validating',
          } as const;
          const phase = phaseMap[effect.type];
          this.emitStateChange(workspaceId, ctx.phase, phase);

          if (effect.type === 'RUN_PLANNER' && ctx.ticketId) {
            void this.linearBridge.onWorkspaceStart(ctx.ticketId, ws.project_id);
          }

          if (effect.type === 'RUN_EXECUTOR') {
            void this.triggers.onBeforeExecution(workspaceId);
          }

          const prompt = this.templates.build(phase, {
            workspaceId,
            ticketId: ctx.ticketId,
            planPath: ctx.ticketId ? `docs/plans/${ctx.ticketId}.md` : undefined,
            lastCritique: ctx.lastCritique,
          });

          let result;
          try {
            result = await this.runner.run({
              workspaceId,
              worktreePath: ws.worktree_path ?? process.cwd(),
              phase,
              prompt,
              ticketId: ctx.ticketId,
              branch: ws.branch ?? undefined,
              onData: phase === 'executing' ? (data) => void this.triggers.onAgentOutput(workspaceId, data) : undefined,
            });
          } catch (err) {
            const { context } = step(ctx, { type: 'ERROR', error: String(err) });
            this.machines.set(workspaceId, context);
            this.events.emitWorkspaceEvent(workspaceId, {
              type: 'agent.error',
              workspaceId,
              error: String(err),
              timestamp: Date.now(),
            });
            return;
          }

          if (phase === 'reviewing') {
            const current = this.machines.get(workspaceId)!;
            if (result.approved === true) {
              const { context, effects: nextEffects } = step(current, { type: 'REVIEW_APPROVED' });
              this.machines.set(workspaceId, context);
              void this.runEffects(workspaceId, context, nextEffects);
            } else {
              const critique = result.critique ?? 'Plan was rejected without critique.';
              const { context, effects: nextEffects } = step(current, { type: 'REVIEW_REJECTED', critique });
              this.machines.set(workspaceId, context);
              void this.runEffects(workspaceId, context, nextEffects);
            }
          } else {
            const eventMap = {
              planning: { type: 'PLAN_DONE' as const },
              executing: { type: 'EXEC_DONE' as const },
              validating: { type: 'VALIDATION_DONE' as const },
            } as const;
            const nextEvent = eventMap[phase as keyof typeof eventMap];
            if (nextEvent) {
              const current = this.machines.get(workspaceId)!;
              const { context, effects: nextEffects } = step(current, nextEvent);
              this.machines.set(workspaceId, context);
              void this.runEffects(workspaceId, context, nextEffects);
            }
          }
          break;
        }

        case 'OPEN_PR': {
          this.emitStateChange(workspaceId, 'awaiting_pr_approval', 'pr_open');
          if (ctx.ticketId) void this.linearBridge.onPrOpened(ctx.ticketId, ws.project_id);
          break;
        }

        case 'NOTIFY_GATE': {
          this.events.emitWorkspaceEvent(workspaceId, {
            type: 'agent.gate',
            workspaceId,
            gate: effect.gate,
            timestamp: Date.now(),
          });

          if (effect.gate === 'plan' && ctx.autoApprovePlan) {
            await this.delayedAutoApprove(workspaceId, 'PLAN_APPROVED');
          } else if (effect.gate === 'validation' && ctx.autoApproveValidation) {
            await this.delayedAutoApprove(workspaceId, 'VALIDATION_APPROVED');
          } else if (effect.gate === 'pr' && ctx.autoApprovePr) {
            await this.delayedAutoApprove(workspaceId, 'PR_APPROVED');
          }
          break;
        }

        case 'NOTIFY_PAUSED':
          this.events.emitWorkspaceEvent(workspaceId, {
            type: 'agent.paused',
            workspaceId,
            rejectionCount: effect.rejectionCount,
            timestamp: Date.now(),
          });
          break;

        case 'NOTIFY_DONE':
          if (ctx.ticketId) void this.linearBridge.onPrMerged(ctx.ticketId, ws.project_id);
          this.events.emitWorkspaceEvent(workspaceId, {
            type: 'agent.done',
            workspaceId,
            prUrl: effect.prUrl,
            timestamp: Date.now(),
          });
          break;

        case 'KILL_AGENT':
          this.runner.interrupt(workspaceId);
          break;
      }
    }
  }

  private async delayedAutoApprove(
    workspaceId: string,
    eventType: 'PLAN_APPROVED' | 'VALIDATION_APPROVED' | 'PR_APPROVED',
  ): Promise<void> {
    await new Promise<void>((r) => setTimeout(r, AUTO_APPROVE_DELAY_MS));
    const current = this.machines.get(workspaceId);
    if (!current) return;
    const { context, effects } = step(current, { type: eventType });
    this.machines.set(workspaceId, context);
    void this.runEffects(workspaceId, context, effects);
  }
}
