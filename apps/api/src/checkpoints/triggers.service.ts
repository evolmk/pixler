import { Injectable, Logger } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';

const BATCH_FILE_THRESHOLD = 5;
const BATCH_LINE_THRESHOLD = 200;

const EDIT_TOOL_PATTERN = /(?:Edit|Write|WriteFile)\(|"type":\s*"edit"|"type":\s*"write"/gi;
const LINE_COUNT_PATTERN = /\+(\d+) lines?/gi;

interface BatchState {
  fileCount: number;
  lineCount: number;
  lastCheckpointAt: number;
}

@Injectable()
export class TriggersService {
  private readonly logger = new Logger(TriggersService.name);
  private batchState = new Map<string, BatchState>();

  constructor(private readonly checkpoints: CheckpointsService) {}

  async onBeforeExecution(workspaceId: string): Promise<void> {
    this.batchState.delete(workspaceId);
    try {
      await this.checkpoints.takeSnapshot(workspaceId, { trigger: 'before_execution' });
    } catch (e) {
      this.logger.warn(`[${workspaceId}] before-execution checkpoint failed: ${e}`);
    }
  }

  async onAgentOutput(workspaceId: string, data: string): Promise<void> {
    let state = this.batchState.get(workspaceId);
    if (!state) {
      state = { fileCount: 0, lineCount: 0, lastCheckpointAt: Date.now() };
      this.batchState.set(workspaceId, state);
    }

    const editMatches = data.match(EDIT_TOOL_PATTERN);
    if (editMatches) state.fileCount += editMatches.length;

    const lineMatches = [...data.matchAll(LINE_COUNT_PATTERN)];
    for (const m of lineMatches) state.lineCount += parseInt(m[1] ?? '0', 10);

    if (state.fileCount >= BATCH_FILE_THRESHOLD || state.lineCount >= BATCH_LINE_THRESHOLD) {
      const { fileCount, lineCount } = state;
      this.batchState.set(workspaceId, { fileCount: 0, lineCount: 0, lastCheckpointAt: Date.now() });
      try {
        await this.checkpoints.takeSnapshot(workspaceId, {
          trigger: 'pre_batch',
          fileCount,
          lineCount,
        });
      } catch (e) {
        this.logger.warn(`[${workspaceId}] pre-batch checkpoint failed: ${e}`);
      }
    }
  }

  async onResolveConflicts(workspaceId: string): Promise<void> {
    try {
      await this.checkpoints.takeSnapshot(workspaceId, { trigger: 'resolve_conflicts' });
    } catch (e) {
      this.logger.warn(`[${workspaceId}] resolve-conflicts checkpoint failed: ${e}`);
    }
  }

  async onRebase(workspaceId: string): Promise<void> {
    try {
      await this.checkpoints.takeSnapshot(workspaceId, { trigger: 'rebase' });
    } catch (e) {
      this.logger.warn(`[${workspaceId}] rebase checkpoint failed: ${e}`);
    }
  }

  clearBatchState(workspaceId: string): void {
    this.batchState.delete(workspaceId);
  }
}
