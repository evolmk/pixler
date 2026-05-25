import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import type { McpOverheadSummary, McpOverheadEntry } from '@pixler/shared-types';

/** Rough token overhead of a typical MCP tool schema definition. */
const SCHEMA_TOKENS_PER_TOOL = 200;

/** Average tokens used per MCP tool call (schema re-injection + result). */
const TOKENS_PER_CALL = 150;

interface WorkspaceRow {
  id: string;
  state: string;
}

@Injectable()
export class McpOverheadEstimatorService {
  constructor(private readonly db: DatabaseService) {}

  estimate(): McpOverheadSummary {
    const workspaces = this.db.connection
      .prepare("SELECT id FROM workspaces WHERE state NOT IN ('archived')")
      .all() as WorkspaceRow[];

    const entries: McpOverheadEntry[] = workspaces.map((ws) => {
      const callCount = this.estimateCallCount(ws.id);
      return {
        workspaceId: ws.id,
        schemaTokens: SCHEMA_TOKENS_PER_TOOL * 10,
        callCount,
        estimatedTokens: SCHEMA_TOKENS_PER_TOOL * 10 + callCount * TOKENS_PER_CALL,
      };
    });

    const totalEstimatedTokens = entries.reduce((s, e) => s + e.estimatedTokens, 0);
    return { entries, totalEstimatedTokens };
  }

  private estimateCallCount(workspaceId: string): number {
    const row = this.db.connection
      .prepare(
        `SELECT COUNT(*) as cnt FROM usage_snapshots
         WHERE workspace_id = ? AND ts > ?`,
      )
      .get(workspaceId, Math.floor(Date.now() / 1000) - 5 * 3600) as { cnt: number } | undefined;
    return row?.cnt ?? 0;
  }
}
