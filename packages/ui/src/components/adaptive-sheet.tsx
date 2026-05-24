import * as React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@pixler/ui/components/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@pixler/ui/components/sheet';
import { useMediaQuery } from '@pixler/ui/hooks/use-media-query';

interface AdaptiveSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

function AdaptiveSheet({ open, onOpenChange, title, children, side = 'right' }: AdaptiveSheetProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side={side}>
          {title && (
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
          )}
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {title && (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        )}
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export { AdaptiveSheet };
