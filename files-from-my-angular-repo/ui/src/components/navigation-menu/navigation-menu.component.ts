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
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

export const NAV_MENU_TOKEN = new InjectionToken<NavigationMenuComponent>('NAV_MENU_TOKEN');
export const NAV_MENU_ITEM_TOKEN = new InjectionToken<NavigationMenuItemComponent>('NAV_MENU_ITEM_TOKEN');

// ── Root ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-nav-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NAV_MENU_TOKEN, useExisting: forwardRef(() => NavigationMenuComponent) }],
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-label]': '"Main navigation"',
    '(keydown.escape)': 'closeAll()',
  },
  template: `
    <ul [class]="listClass()" role="list">
      <ng-content />
    </ul>
    <!-- Viewport slot for submenus -->
    <div class="absolute left-0 top-full z-50 w-full">
      <ng-content select="ui-nav-menu-viewport" />
    </div>
  `,
})
export class NavigationMenuComponent {
  readonly class = input<string>('');

  readonly activeItem = signal<string | null>(null);

  activate(id: string): void {
    this.activeItem.set(id);
  }
  closeAll(): void {
    this.activeItem.set(null);
  }
  toggle(id: string): void {
    this.activeItem.update((current) => (current === id ? null : id));
  }

  protected readonly computedClass = computed(() =>
    cn('relative z-10 flex max-w-max flex-1 items-center justify-center', this.class()),
  );
  protected readonly listClass = computed(() => 'group flex flex-1 list-none items-center justify-center space-x-1');
}

// ── List ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-nav-menu-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    role: 'list',
  },
  template: `<ng-content />`,
})
export class NavigationMenuListComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('group flex flex-1 list-none items-center justify-center space-x-1', this.class()),
  );
}

// ── Item ──────────────────────────────────────────────────────────────────────

let _navMenuItemCounter = 0;

@Component({
  selector: 'ui-nav-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NAV_MENU_ITEM_TOKEN, useExisting: forwardRef(() => NavigationMenuItemComponent) }],
  host: { '[class]': '"relative"' },
  template: `<ng-content />`,
})
export class NavigationMenuItemComponent {
  readonly _id = `nav-menu-item-${++_navMenuItemCounter}`;
  protected readonly _navMenu = inject(NAV_MENU_TOKEN);

  readonly isActive = computed(() => this._navMenu.activeItem() === this._id);

  toggle(): void {
    this._navMenu.toggle(this._id);
  }
  close(): void {
    this._navMenu.closeAll();
  }
}

// ── Trigger ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-nav-menu-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-expanded]': '_item.isActive()',
    '[attr.data-state]': '_item.isActive() ? "open" : "closed"',
    '(click)': '_item.toggle()',
  },
  template: `
    <ng-content />
    <!-- Chevron icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="relative top-[1px] ml-1 h-3 w-3 transition duration-300"
      [class.rotate-180]="_item.isActive()"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  `,
})
export class NavigationMenuTriggerComponent {
  readonly class = input<string>('');
  protected readonly _item = inject(NAV_MENU_ITEM_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'group inline-flex h-10 w-max cursor-pointer items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium',
      'transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=open]:bg-accent/50',
      this.class(),
    ),
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-nav-menu-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (_item.isActive()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-40" (click)="_item.close()"></div>
      <!-- Panel -->
      <div [class]="computedClass()" (keydown.escape)="_item.close()" (click)="$event.stopPropagation()">
        <ng-content />
      </div>
    }
  `,
})
export class NavigationMenuContentComponent {
  readonly class = input<string>('');
  protected readonly _item = inject(NAV_MENU_ITEM_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'absolute left-0 top-full z-50 w-auto rounded-md border bg-popover p-2 shadow-md',
      'animate-in fade-in-0 zoom-in-95 duration-200',
      this.class(),
    ),
  );
}

// ── Link ──────────────────────────────────────────────────────────────────────

@Directive({
  selector: 'a[uiNavMenuLink]',
  standalone: true,
  host: {
    '[class]': 'computedClass()',
  },
})
export class NavigationMenuLinkDirective {
  readonly class = input<string>('');
  readonly active = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'block cursor-pointer select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors',
      'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
      this.active() ? 'bg-accent/50' : '',
      this.class(),
    ),
  );
}
