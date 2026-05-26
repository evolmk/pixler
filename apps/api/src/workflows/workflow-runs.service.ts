import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../db/database.service';
import type { WorkflowRunDto, WorkflowStepAttemptDto } from '@pixler/shared-types';
import type { WorkflowContext, StepState } from '@pixler/orchestrator/server';

type DbRun = {
  id: string;
  workspace_id: string;
  workflow_name: string;
  status: string;
  current_step_index: number;
  context_json: string;
  created_at: number;
  updated_at: number;
};

type DbAttempt = {
  id: string;
  run_id: string;
  step_id: string;
  attempt_no: number;
  added_context: string | null;
  status: string;
  checkpoint_id: string | null;
  started_at: number | null;
  completed_at: number | null;
  error: string | null;
};

@Injectable()
export class WorkflowRunsService {
  constructor(private readonly db: DatabaseService) {}

  create(workspaceId: string, workflowName: string, context: WorkflowContext): WorkflowRunDto {
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    this.db.connection
      .prepare(
        `INSERT INTO workflow_runs (id, workspace_id, workflow_name, status, current_step_index, context_json, created_at, updated_at)
         VALUES (?, ?, ?, 'running', 0, ?, ?, ?)`,
      )
      .run(id, workspaceId, workflowName, JSON.stringify(context), now, now);
    return this.findOne(id);
  }

  findOne(id: string): WorkflowRunDto {
    const row = this.db.connection
      .prepare('SELECT * FROM workflow_runs WHERE id = ?')
      .get(id) as DbRun | undefined;
    if (!row) throw new NotFoundException(`WorkflowRun ${id} not found`);
    return this.toRunDto(row);
  }

  findByWorkspace(workspaceId: string): WorkflowRunDto[] {
    const rows = this.db.connection
      .prepare('SELECT * FROM workflow_runs WHERE workspace_id = ? ORDER BY created_at DESC')
      .all(workspaceId) as DbRun[];
    return rows.map((r) => this.toRunDto(r));
  }

  findPausedByWorkspace(workspaceId: string): WorkflowRunDto[] {
    const rows = this.db.connection
      .prepare("SELECT * FROM workflow_runs WHERE workspace_id = ? AND status = 'paused' ORDER BY updated_at DESC")
      .all(workspaceId) as DbRun[];
    return rows.map((r) => this.toRunDto(r));
  }

  findAllPaused(): WorkflowRunDto[] {
    const rows = this.db.connection
      .prepare("SELECT * FROM workflow_runs WHERE status = 'paused' ORDER BY updated_at DESC")
      .all() as DbRun[];
    return rows.map((r) => this.toRunDto(r));
  }

  updateStatus(
    id: string,
    status: WorkflowRunDto['status'],
    currentStepIndex?: number,
    context?: WorkflowContext,
  ): void {
    const now = Math.floor(Date.now() / 1000);
    if (currentStepIndex !== undefined && context !== undefined) {
      this.db.connection
        .prepare(
          'UPDATE workflow_runs SET status = ?, current_step_index = ?, context_json = ?, updated_at = ? WHERE id = ?',
        )
        .run(status, currentStepIndex, JSON.stringify(context), now, id);
    } else if (currentStepIndex !== undefined) {
      this.db.connection
        .prepare('UPDATE workflow_runs SET status = ?, current_step_index = ?, updated_at = ? WHERE id = ?')
        .run(status, currentStepIndex, now, id);
    } else {
      this.db.connection
        .prepare('UPDATE workflow_runs SET status = ?, updated_at = ? WHERE id = ?')
        .run(status, now, id);
    }
  }

  appendAttempt(
    runId: string,
    stepId: string,
    addedContext?: string,
    checkpointId?: string,
  ): WorkflowStepAttemptDto {
    const existing = this.db.connection
      .prepare('SELECT MAX(attempt_no) as max_no FROM workflow_step_attempts WHERE run_id = ? AND step_id = ?')
      .get(runId, stepId) as { max_no: number | null };
    const attemptNo = (existing.max_no ?? 0) + 1;
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    this.db.connection
      .prepare(
        `INSERT INTO workflow_step_attempts (id, run_id, step_id, attempt_no, added_context, status, checkpoint_id, started_at)
         VALUES (?, ?, ?, ?, ?, 'running', ?, ?)`,
      )
      .run(id, runId, stepId, attemptNo, addedContext ?? null, checkpointId ?? null, now);
    return this.findAttempt(id);
  }

  updateAttempt(id: string, status: WorkflowStepAttemptDto['status'], error?: string): void {
    const now = Math.floor(Date.now() / 1000);
    this.db.connection
      .prepare('UPDATE workflow_step_attempts SET status = ?, completed_at = ?, error = ? WHERE id = ?')
      .run(status, now, error ?? null, id);
  }

  findAttempt(id: string): WorkflowStepAttemptDto {
    const row = this.db.connection
      .prepare('SELECT * FROM workflow_step_attempts WHERE id = ?')
      .get(id) as DbAttempt | undefined;
    if (!row) throw new NotFoundException(`WorkflowStepAttempt ${id} not found`);
    return this.toAttemptDto(row);
  }

  findAttemptsForRun(runId: string): WorkflowStepAttemptDto[] {
    const rows = this.db.connection
      .prepare('SELECT * FROM workflow_step_attempts WHERE run_id = ? ORDER BY step_id, attempt_no')
      .all(runId) as DbAttempt[];
    return rows.map((r) => this.toAttemptDto(r));
  }

  findLastAttemptForStep(runId: string, stepId: string): WorkflowStepAttemptDto | null {
    const row = this.db.connection
      .prepare(
        'SELECT * FROM workflow_step_attempts WHERE run_id = ? AND step_id = ? ORDER BY attempt_no DESC LIMIT 1',
      )
      .get(runId, stepId) as DbAttempt | undefined;
    return row ? this.toAttemptDto(row) : null;
  }

  /** Persists the full runner state (steps + context) so it can be rehydrated after restart. */
  persistRunnerState(
    runId: string,
    status: WorkflowRunDto['status'],
    currentStepIndex: number,
    context: WorkflowContext,
    _steps: StepState[],
  ): void {
    // Context + step index is enough to reconstruct state; steps are re-derived from the workflow def.
    // Full step state could be stored in context_json if needed later.
    this.updateStatus(runId, status, currentStepIndex, context);
  }

  private toRunDto(row: DbRun): WorkflowRunDto {
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      workflowName: row.workflow_name,
      status: row.status as WorkflowRunDto['status'],
      currentStepIndex: row.current_step_index,
      context: JSON.parse(row.context_json) as Record<string, unknown>,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toAttemptDto(row: DbAttempt): WorkflowStepAttemptDto {
    return {
      id: row.id,
      runId: row.run_id,
      stepId: row.step_id,
      attemptNo: row.attempt_no,
      addedContext: row.added_context ?? undefined,
      status: row.status as WorkflowStepAttemptDto['status'],
      checkpointId: row.checkpoint_id ?? undefined,
      startedAt: row.started_at ?? undefined,
      completedAt: row.completed_at ?? undefined,
      error: row.error ?? undefined,
    };
  }
}
