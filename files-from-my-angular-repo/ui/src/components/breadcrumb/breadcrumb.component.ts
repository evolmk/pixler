import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

type BreadcrumbSize = 'sm' | 'default' | 'lg';

const BC_SIZE: Record<BreadcrumbSize, string> = {
  sm: 'text-xs gap-1',
  default: 'text-sm gap-1.5 sm:gap-2.5',
  lg: 'text-base gap-2 sm:gap-3',
};

// ── Root ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"flex items-center gap-1.5 sm:gap-2.5 flex-wrap text-sm text-muted-foreground"',
    '[attr.aria-label]': '"breadcrumb"',
  },
  template: `<ng-content />`,
})
export class BreadcrumbComponent {}

// ── List ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-breadcrumb-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class BreadcrumbListComponent {
  readonly size = input<BreadcrumbSize>('default');
  readonly wrap = input<boolean>(true);
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn(
      'flex items-center break-words text-muted-foreground',
      BC_SIZE[this.size()],
      this.wrap() ? 'flex-wrap' : 'flex-nowrap overflow-hidden',
      this.class(),
    ),
  );
}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-breadcrumb-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class BreadcrumbItemComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('inline-flex items-center gap-1.5', this.class()));
}

// ── Link ──────────────────────────────────────────────────────────────────────

@Directive({
  selector: 'a[uiBreadcrumbLink]',
  standalone: true,
  host: { '[class]': 'computedClass()' },
})
export class BreadcrumbLinkDirective {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('transition-colors hover:text-foreground', this.class()));
}

// ── Page (current) ────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-breadcrumb-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"link"',
    '[attr.aria-disabled]': '"true"',
    '[attr.aria-current]': '"page"',
  },
  template: `<ng-content />`,
})
export class BreadcrumbPageComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('font-normal text-foreground', this.class()));
}

// ── Separator ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-breadcrumb-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"inline-flex [&>svg]:w-3.5 [&>svg]:h-3.5"',
    '[attr.role]': '"presentation"',
    '[attr.aria-hidden]': '"true"',
  },
  template: `
    <ng-content>
      <!-- Default: chevron right -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </ng-content>
  `,
})
export class BreadcrumbSeparatorComponent {}

// ── Ellipsis ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-breadcrumb-ellipsis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"flex h-9 w-9 items-center justify-center"',
    '[attr.role]': '"presentation"',
    '[attr.aria-hidden]': '"true"',
  },
  template: `
    <!-- Three dots icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-4 w-4"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span class="sr-only">More</span>
  `,
})
export class BreadcrumbEllipsisComponent {}
