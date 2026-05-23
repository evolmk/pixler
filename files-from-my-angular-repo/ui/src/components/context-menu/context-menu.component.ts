import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  InjectionToken,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { overlayEnter, overlayExit } from '../../utils/motion';

export const CONTEXT_MENU_TOKEN = new InjectionToken<ContextMenuComponent>('CONTEXT_MENU_TOKEN');

interface Point {
  x: number;
  y: number;
}

// ── Root ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-context-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: CONTEXT_MENU_TOKEN, useExisting: forwardRef(() => ContextMenuComponent) }],
  host: { '[class]': '"relative"' },
  template: `<ng-content />`,
})
export class ContextMenuComponent {
  readonly isOpen = signal(false);
  readonly position = signal<Point>({ x: 0, y: 0 });

  open(x: number, y: number): void {
    this.position.set({ x, y });
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}

// ── Trigger ─────────────────────────────────────────────────────────────────

@Directive({
  selector: '[uiContextMenuTrigger]',
  standalone: true,
  host: {
    '(contextmenu)': '_onContextMenu($event)',
  },
})
export class ContextMenuTriggerDirective {
  protected readonly _menu = inject(CONTEXT_MENU_TOKEN);
  private readonly _el = inject(ElementRef<HTMLElement>);

  protected _onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    // Position relative to the ui-context-menu root (which has position: relative)
    const root = this._el.nativeElement.closest('ui-context-menu');
    if (root) {
      const rect = root.getBoundingClientRect();
      this._menu.open(event.clientX - rect.left, event.clientY - rect.top);
    } else {
      this._menu.open(event.clientX, event.clientY);
    }
  }
}

// ── Content ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-context-menu-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (_visible()) {
      <div
        class="fixed inset-0 z-40"
        (click)="_animatedClose()"
        (contextmenu)="$event.preventDefault(); _animatedClose()"
      ></div>
      <div
        #panel
        [class]="computedClass()"
        [style.left.px]="_menu.position().x"
        [style.top.px]="_menu.position().y"
        style="position: absolute"
        role="menu"
        aria-orientation="vertical"
        (keydown.escape)="_animatedClose()"
        (click)="$event.stopPropagation()"
      >
        <ng-content />
      </div>
    }
  `,
})
export class ContextMenuContentComponent {
  readonly class = input<string>('');
  protected readonly _menu = inject(CONTEXT_MENU_TOKEN);
  protected readonly _visible = signal(false);
  private readonly _panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private _closing = false;

  constructor() {
    effect(() => {
      const open = this._menu.isOpen();
      if (open) {
        this._closing = false;
        this._visible.set(true);
        queueMicrotask(() => {
          const el = this._panelRef()?.nativeElement;
          if (el) overlayEnter(el, 'fade');
        });
      } else if (this._visible()) {
        this._animatedClose();
      }
    });
  }

  protected _animatedClose(): void {
    if (this._closing) return;
    this._closing = true;
    const el = this._panelRef()?.nativeElement;
    if (el) {
      void overlayExit(el, 'fade').then(() => {
        this._visible.set(false);
        this._menu.isOpen.set(false);
      });
    } else {
      this._visible.set(false);
      this._menu.isOpen.set(false);
    }
  }

  protected readonly computedClass = computed(() =>
    cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
      this.class(),
    ),
  );
}

// ── Group ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-context-menu-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { role: 'group' },
  template: `<ng-content />`,
})
export class ContextMenuGroupComponent {}

// ── Label ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-context-menu-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class ContextMenuLabelComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('block px-2 py-1.5 text-sm font-semibold', this.class()));
}

// ── Item ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-context-menu-item, [uiContextMenuItem]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"menuitem"',
    '[attr.tabindex]': '"0"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.aria-disabled]': 'disabled()',
    '(click)': '_handleClick()',
    '(keydown.enter)': '_handleClick()',
  },
  template: `<ng-content />`,
})
export class ContextMenuItemComponent {
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly closeOnClick = input<boolean>(true);

  protected readonly _menu = inject(CONTEXT_MENU_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'transition-colors',
      'focus:bg-accent focus:text-accent-foreground',
      'hover:bg-accent hover:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
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
  selector: 'ui-context-menu-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"separator"',
  },
  template: ``,
})
export class ContextMenuSeparatorComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('-mx-1 my-1 h-px bg-muted', this.class()));
}

// ── Shortcut ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-context-menu-shortcut',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class ContextMenuShortcutComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('ml-auto text-xs tracking-widest opacity-60', this.class()));
}
