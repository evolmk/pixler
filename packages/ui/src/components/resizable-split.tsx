import * as React from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@pixler/ui/components/resizable';
import { cn } from '@pixler/ui/lib/utils';

interface ResizableSplitProps {
  direction?: 'horizontal' | 'vertical';
  sizes?: [number, number];
  onResize?: (layout: { [id: string]: number }) => void;
  className?: string;
  children: [React.ReactNode, React.ReactNode];
}

function ResizableSplit({ direction = 'horizontal', sizes = [50, 50], onResize, className, children }: ResizableSplitProps) {
  return (
    <ResizablePanelGroup
      orientation={direction}
      className={cn('h-full w-full', className)}
      onLayoutChange={onResize}
    >
      <ResizablePanel
        defaultSize={sizes[0]}
        className="max-lg:!min-h-0 max-lg:w-full"
      >
        {children[0]}
      </ResizablePanel>
      <ResizableHandle className="max-lg:hidden" />
      <ResizablePanel
        defaultSize={sizes[1]}
        className="max-lg:!min-h-0 max-lg:w-full"
      >
        {children[1]}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export { ResizableSplit };
