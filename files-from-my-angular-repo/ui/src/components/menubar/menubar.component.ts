import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

export const MENUBAR_TOKEN = new InjectionToken<MenubarComponent>('MENUBAR_TOKEN');
export const MENUBAR_MENU_TOKEN = new InjectionToken<MenubarMenuComponent>('MENUBAR_MENU_TOKEN');

// ── Root ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-menubar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MENUBAR_TOKEN, useExisting: forwardRef(() => MenubarComponent) }],
  host: {
    '[class]': 'computedClass()',
    role: 'menubar',
    '(keydown.escape)': 'closeAll()',
  },
  template: `<ng-content />`,
})
export class MenubarComponent {
  readonly class = input<string>('');

  /** Track which menu ID is currently open */
  private readonly _openMenu = signal<string | null>(null);

  openMenu(id: string): void {
    this._openMenu.set(id);
  }
  closeAll(): void {
    this._openMenu.set(null);
  }
  isMenuOpen(id: string): boolean {
    return this._openMenu() === id;
  }
  toggleMenu(id: string): void {
    this._openMenu.update((current) => (current === id ? null : id));
  }

  protected readonly computedClass = computed(() =>
    cn('flex h-10 items-center space-x-1 rounded-md border bg-background p-1', this.class()),
  );
}

// ── Menu ──────────────────────────────────────────────────────────────────────

let _menuIdCounter = 0;

@Component({
  selector: 'ui-menubar-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MENUBAR_MENU_TOKEN, useExisting: forwardRef(() => MenubarMenuComponent) }],
  host: { '[class]': '"relative"' },
  template: `<ng-content />`,
})
export class MenubarMenuComponent {
  readonly _id = `menubar-menu-${++_menuIdCounter}`;
  protected readonly _menubar = inject(MENUBAR_TOKEN);

  get isOpen(): boolean {
    return this._menubar.isMenuOpen(this._id);
  }
  toggle(): void {
    this._menubar.toggleMenu(this._id);
  }
  close(): void {
    this._menubar.closeAll();
  }
}

// ── Trigger ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-menubar-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"menuitem"',
    '[attr.aria-haspopup]': '"true"',
    '[attr.aria-expanded]': '_menu.isOpen',
    '[attr.data-state]': '_menu.isOpen ? "open" : "closed"',
    '(click)': '_menu.toggle()',
  },
  template: `<ng-content />`,
})
export class MenubarTriggerComponent {
  readonly class = input<string>('');
  protected readonly _menu = inject(MENUBAR_MENU_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'flex cursor-pointer select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      this.class(),
    ),
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-menubar-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (_menu.isOpen) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-40" (click)="_menu.close()"></div>
      <!-- Panel -->
      <div [class]="computedClass()" role="menu" (keydown.escape)="_menu.close()" (click)="$event.stopPropagation()">
        <ng-content />
      </div>
    }
  `,
})
export class MenubarContentComponent {
  readonly class = input<string>('');
  /** Align dropdown relative to trigger: 'start' | 'end' */
  readonly align = input<'start' | 'end'>('start');

  protected readonly _menu = inject(MENUBAR_MENU_TOKEN);

  protected readonly computedClass = computed(() => {
    const alignClass = this.align() === 'end' ? 'right-0' : 'left-0';
    return cn(
      'absolute top-full z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
      'animate-in fade-in-0 zoom-in-95 duration-200',
      alignClass,
      this.class(),
    );
  });
}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-menubar-item, [uiMenubarItem]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"menuitem"',
    '[attr.tabindex]': '"0"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '(click)': '_handleClick()',
    '(keydown.enter)': '_handleClick()',
  },
  template: `<ng-content />`,
})
export class MenubarItemComponent {
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly closeOnClick = input<boolean>(true);

  protected readonly _menu = inject(MENUBAR_MENU_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      this.class(),
    ),
  );

  protected _handleClick(): void {
    if (this.disabled()) return;
    if (this.closeOnClick()) this._menu.close();
  }
}

// ── Separator ────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-menubar-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"separator"',
  },
  template: ``,
})
export class MenubarSeparatorComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('-mx-1 my-1 h-px bg-muted', this.class()));
}

// ── Label ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-menubar-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class MenubarLabelComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('block px-2 py-1.5 text-sm font-semibold', this.class()));
}

// ── Shortcut ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-menubar-shortcut',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class MenubarShortcutComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}
