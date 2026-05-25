import { Injectable } from '@nestjs/common';
import { UsageService } from '../usage/usage.service';

const PREFLIGHT_THRESHOLD = 70;

export interface PreflightResult {
  ok: boolean;
  percent: number;
  parallelCount: number;
  threshold: number;
}

@Injectable()
export class PreflightService {
  constructor(private readonly usage: UsageService) {}

  check(parallelCount: number): PreflightResult {
    const window = this.usage.getWindow(5);
    const pct = window.percent;
    const ok = pct < PREFLIGHT_THRESHOLD || parallelCount === 0;
    return { ok, percent: pct, parallelCount, threshold: PREFLIGHT_THRESHOLD };
  }
}
