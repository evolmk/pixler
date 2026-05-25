export const DEFAULT_MAX_REJECTIONS = 3;
export const MIN_MAX_REJECTIONS = 1;
export const MAX_MAX_REJECTIONS = 5;

export function clampMaxRejections(n: number): number {
  return Math.max(MIN_MAX_REJECTIONS, Math.min(MAX_MAX_REJECTIONS, Math.round(n)));
}

export function isAtLimit(rejectionCount: number, maxRejections: number): boolean {
  return rejectionCount >= maxRejections;
}
