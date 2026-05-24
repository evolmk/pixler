import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@pixler/ui/lib/utils';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ value, min = 0, max = Infinity, step = 1, onChange, className, disabled }, ref) => {
    const dec = () => onChange(Math.max(min, value - step));
    const inc = () => onChange(Math.min(max, value + step));

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-9 items-center rounded-md border border-input bg-transparent',
          className,
        )}
      >
        <button
          type="button"
          onClick={dec}
          disabled={disabled || value <= min}
          className="flex h-full w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="Decrease"
        >
          <Minus className="size-3.5" />
        </button>
        <div className="flex-1 border-x border-input px-3 text-center text-sm tabular-nums">
          {value}
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={disabled || value >= max}
          className="flex h-full w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          aria-label="Increase"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    );
  },
);
Stepper.displayName = 'Stepper';

export { Stepper };
