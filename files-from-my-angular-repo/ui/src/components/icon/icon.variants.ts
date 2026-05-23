import { cva } from 'class-variance-authority';

export const iconVariants = cva('inline-flex items-center justify-center shrink-0');

export type IconSize = 'mini' | 'sm' | 'default' | 'lg' | 'xl' | 'xxl';

export const ICON_SIZE_MAP: Record<IconSize, number> = {
  mini: 12,
  sm: 16,
  default: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};
