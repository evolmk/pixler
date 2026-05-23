import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { cn } from '../../utils/cn';

export const SIDEBAR_TOKEN = new InjectionToken<SidebarComponent>('SIDEBAR_TOKEN');

// ── Root ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: SIDEBAR_TOKEN, useExisting: forwardRef(() => SidebarComponent) }],
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class SidebarComponent {
  readonly collapsed = model<boolean>(false);
  readonly side = input<'left' | 'right'>('left');
  /** Whether the sidebar supports collapsing (shows toggle button) */
  readonly collapsible = input<boolean>(true);
  /** Explicit expanded width (CSS value or px number) */
  readonly width = input<string | number>('220px');
  /** Explicit collapsed width (CSS value or px number) */
  readonly collapsedWidth = input<string | number>('52px');
  /** Reverse the collapse arrow direction */
  readonly reverseArrow = input<boolean>(false);
  readonly class = input<string>('');

  toggle(): void {
    this.collapsed.update((v) => !v);
  }
  expand(): void {
    this.collapsed.set(false);
  }
  collapse(): void {
    this.collapsed.set(true);
  }

  readonly resolvedWidth = computed(() => {
    const w = this.collapsed() ? this.collapsedWidth() : this.width();
    return typeof w === 'number' ? `${w}px` : w;
  });

  protected readonly computedClass = computed(() =>
    cn(
      'flex h-full min-h-svh flex-col bg-sidebar text-sidebar-foreground',
      'transition-[width] duration-200 ease-in-out',
      this.class(),
    ),
  );
}

// ── Trigger ───────────────────────────────────────────────────────────────────

@Directive({
  selector: '[uiSidebarTrigger]',
  standalone: true,
  host: {
    '[class]': '"cursor-pointer"',
    '(click)': '_sidebar.toggle()',
    '[attr.aria-expanded]': '!_sidebar.collapsed()',
    '[attr.aria-label]': '_sidebar.collapsed() ? "Expand sidebar" : "Collapse sidebar"',
  },
})
export class SidebarTriggerDirective {
  protected readonly _sidebar = inject(SIDEBAR_TOKEN);
}

// ── Header ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class SidebarHeaderComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('flex flex-col gap-2 p-2', this.class()));
}

// ── Content ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class SidebarContentComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', this.class()),
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class SidebarFooterComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('flex flex-col gap-2 p-2', this.class()));
}

// ── Menu ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class SidebarMenuComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('flex w-full min-w-0 flex-col gap-1', this.class()));
}

// ── Menu Item ────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"relative"' },
  template: `<ng-content />`,
})
export class SidebarMenuItemComponent {}

// ── Menu Button ───────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar-menu-button, [uiSidebarMenuButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-active]': 'isActive()',
  },
  template: `<ng-content />`,
})
export class SidebarMenuButtonComponent {
  readonly class = input<string>('');
  readonly isActive = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left cursor-pointer',
      'outline-none ring-sidebar-ring transition-[width,height,padding]',
      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      'focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      'data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground',
      '[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
      this.class(),
    ),
  );
}

// ── Group ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class SidebarGroupComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('relative flex w-full min-w-0 flex-col p-2', this.class()));
}

// ── Group Label ───────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-sidebar-group-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class SidebarGroupLabelComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn(
      'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70',
      'outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear',
      'focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      this.class(),
    ),
  );
}
