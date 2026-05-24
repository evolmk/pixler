import * as React from 'react';
import { cn } from '@pixler/ui/lib/utils';
import { useMediaQuery } from '@pixler/ui/hooks/use-media-query';

interface BottomTabItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomTabsProps {
  items: BottomTabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function BottomTabs({ items, value, onChange, className }: BottomTabsProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) return null;

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center border-t border-border bg-background pb-safe',
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
            value === item.value
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
          aria-selected={value === item.value}
          role="tab"
        >
          <span className="size-5 [&_svg]:size-5">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export { BottomTabs };
export type { BottomTabItem };
