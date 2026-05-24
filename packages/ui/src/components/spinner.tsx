import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@pixler/ui/lib/utils';

interface SpinnerProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, ...props }, ref) => (
    <Loader2
      ref={ref}
      className={cn('animate-spin text-current', className)}
      {...props}
    />
  ),
);
Spinner.displayName = 'Spinner';

export { Spinner };
