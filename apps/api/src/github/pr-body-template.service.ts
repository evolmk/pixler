import { Injectable } from '@nestjs/common';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class PrBodyTemplateService {
  generate(opts: {
    worktreePath: string;
    ticketId: string | null;
    planLink?: string;
    executionLog?: string;
  }): string {
    const repoTemplate = join(opts.worktreePath, '.github', 'PULL_REQUEST_TEMPLATE.md');
    let body: string;

    if (existsSync(repoTemplate)) {
      body = readFileSync(repoTemplate, 'utf-8');
    } else {
      body = this.defaultTemplate();
    }

    body = body
      .replace(/\{plan_link\}/g, opts.planLink ?? '')
      .replace(/\{execution_log\}/g, opts.executionLog ?? '')
      .replace(/\{ticket\}/g, opts.ticketId ?? '');

    return body.trim();
  }

  private defaultTemplate(): string {
    return `## Summary

{ticket}

## Changes

-

## Test plan

- [ ]

{plan_link}
{execution_log}`;
  }
}
