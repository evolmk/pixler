import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, signal } from '@angular/core';
import { cn } from '../../utils/cn';

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Desktop row -->
    <div class="flex h-full items-center gap-4">
      <ng-content select="ui-navbar-brand" />
      <ng-content select="ui-navbar-nav" />
      <ng-content select="ui-navbar-actions" />
      <ng-content select="ui-navbar-toggle" />
    </div>
    <!-- Mobile drawer -->
    @if (_mobileOpen()) {
      <div class="absolute inset-x-0 top-full border-b border-border bg-background px-4 py-3 shadow-md md:hidden">
        <ng-content select="[mobileMenu]" />
      </div>
    }
  `,
})
export class NavbarComponent {
  readonly sticky = input<boolean>(false);
  readonly bordered = input<boolean>(true);
  readonly class = input<string>('');

  readonly _mobileOpen = signal(false);

  toggleMobile(): void {
    this._mobileOpen.update((v) => !v);
  }

  protected readonly computedClass = computed(() =>
    cn(
      'relative w-full bg-background px-4',
      this.sticky() ? 'sticky top-0 z-40' : '',
      this.bordered() ? 'border-b border-border' : '',
      this.class(),
    ),
  );
}

// ── Brand ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-navbar-brand',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"flex shrink-0 items-center gap-2 font-semibold text-foreground"' },
  template: `<ng-content />`,
})
export class NavbarBrandComponent {}

// ── Nav (link list) ───────────────────────────────────────────────────────────

@Component({
  selector: 'ui-navbar-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"hidden flex-1 items-center gap-1 md:flex"' },
  template: `<ng-content />`,
})
export class NavbarNavComponent {}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'a[uiNavbarItem], button[uiNavbarItem]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class NavbarItemComponent {
  readonly active = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      this.active()
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      this.class(),
    ),
  );
}

// ── Actions ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-navbar-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"ml-auto hidden items-center gap-2 md:flex"' },
  template: `<ng-content />`,
})
export class NavbarActionsComponent {}

// ── Mobile toggle ─────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-navbar-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"ml-auto flex items-center md:hidden"' },
  template: `
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground
             hover:bg-accent hover:text-accent-foreground transition-colors
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Toggle menu"
      (click)="_toggleMobile()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    </button>
  `,
})
export class NavbarToggleComponent {
  // Optional — consumers can also wire toggle manually
  protected readonly _navbar: NavbarComponent | null = null;

  protected _toggleMobile(): void {
    this._navbar?.toggleMobile();
  }
}
