import { Injectable } from '@nestjs/common';
import type { AgentPhase } from '@pixler/orchestrator';

export interface PromptContext {
  ticketId?: string;
  ticketTitle?: string;
  ticketDescription?: string;
  planPath?: string;
  planContents?: string;
  lastCritique?: string;
  workspaceId: string;
}

@Injectable()
export class PromptTemplatesService {
  build(phase: AgentPhase, ctx: PromptContext): string {
    switch (phase) {
      case 'planning':
        return this.planningPrompt(ctx);
      case 'reviewing':
        return this.reviewingPrompt(ctx);
      case 'executing':
        return this.executingPrompt(ctx);
      case 'validating':
        return this.validatingPrompt(ctx);
      default:
        return '';
    }
  }

  private planningPrompt(ctx: PromptContext): string {
    const parts: string[] = [];
    if (ctx.ticketTitle) parts.push(`Ticket: ${ctx.ticketTitle}`);
    if (ctx.ticketDescription) parts.push(`Description:\n${ctx.ticketDescription}`);
    if (ctx.lastCritique) parts.push(`Previous plan was rejected. Critique:\n${ctx.lastCritique}`);
    const planPath = ctx.planPath ?? `docs/plans/${ctx.ticketId ?? 'plan'}.md`;
    parts.push(`Write your implementation plan to ${planPath}. Be specific and actionable.`);
    return parts.join('\n\n');
  }

  private reviewingPrompt(ctx: PromptContext): string {
    const parts: string[] = ['Review the following implementation plan.'];
    if (ctx.planContents) parts.push(`Plan:\n${ctx.planContents}`);
    parts.push(
      'If the plan is sound and complete, reply with a line starting with APPROVED.',
      'If it needs changes, reply with a line starting with REJECTED: followed by your critique.',
    );
    return parts.join('\n\n');
  }

  private executingPrompt(ctx: PromptContext): string {
    const planPath = ctx.planPath ?? `docs/plans/${ctx.ticketId ?? 'plan'}.md`;
    return `Implement the plan at ${planPath}. Follow it exactly. Run tests if they exist.`;
  }

  private validatingPrompt(_ctx: PromptContext): string {
    return '/review';
  }
}
