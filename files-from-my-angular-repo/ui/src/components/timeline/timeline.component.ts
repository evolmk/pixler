import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

export const TIMELINE_TOKEN = new InjectionToken<TimelineComponent>('TIMELINE_TOKEN');

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: TIMELINE_TOKEN, useExisting: forwardRef(() => TimelineComponent) }],
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class TimelineComponent {
  readonly align = input<'left' | 'right' | 'alternate'>('left');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('relative flex flex-col', this.class()));
}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-timeline-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <div class="flex items-stretch gap-3">
      <!-- Icon column -->
      <div class="flex flex-col items-center">
        <ng-content select="ui-timeline-icon" />
        <!-- Connector line -->
        <div class="mt-1 flex-1 w-px bg-border min-h-[1.5rem] last-line"></div>
      </div>
      <!-- Content column -->
      <div class="pb-6 flex-1 min-w-0">
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      ui-timeline-item:last-child .last-line {
        display: none;
      }
    `,
  ],
})
export class TimelineItemComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('group', this.class()));
}

// ── Icon ──────────────────────────────────────────────────────────────────────

export type TimelineIconSize = 'sm' | 'default' | 'lg';
export type TimelineIconVariant = 'dot' | 'ring' | 'avatar';

const SIZE_CLASSES: Record<TimelineIconSize, string> = {
  sm: 'h-3 w-3',
  default: 'h-8 w-8 text-sm font-medium',
  lg: 'h-10 w-10 text-sm font-medium',
};

const COLOR_MAP: Record<string, string> = {
  default: 'bg-muted text-muted-foreground border border-border',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-destructive text-destructive-foreground',
};

@Component({
  selector: 'ui-timeline-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    @if (variant() === 'avatar') {
      <span [class]="spanClass()">
        <ng-content />
      </span>
    } @else if (variant() === 'dot') {
      <span [class]="spanClass()"></span>
    } @else {
      <span [class]="spanClass()">
        <ng-content />
      </span>
    }
  `,
})
export class TimelineIconComponent {
  readonly color = input<'default' | 'primary' | 'success' | 'warning' | 'error'>('default');
  readonly size = input<TimelineIconSize>('default');
  readonly variant = input<TimelineIconVariant>('ring');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(this.class()));

  protected readonly spanClass = computed(() => {
    const v = this.variant();
    const s = this.size();

    const base = 'flex shrink-0 items-center justify-center rounded-full';
    const sizeClass = SIZE_CLASSES[s];
    const colorClass = COLOR_MAP[this.color()] ?? COLOR_MAP['default'];

    if (v === 'dot') {
      return cn(base, sizeClass, colorClass);
    }
    if (v === 'avatar') {
      return cn(base, sizeClass, 'overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover');
    }
    // ring (default)
    return cn(base, sizeClass, colorClass, 'ring-4 ring-background');
  });
}

// ── Content ───────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-timeline-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    @if (title()) {
      <p class="text-sm font-semibold text-foreground leading-none mb-1">{{ title() }}</p>
    }
    @if (timestamp()) {
      <time class="text-xs text-muted-foreground">{{ timestamp() }}</time>
    }
    <div class="mt-1 text-sm text-muted-foreground">
      <ng-content />
    </div>
  `,
})
export class TimelineContentComponent {
  readonly title = input<string>('');
  readonly timestamp = input<string>('');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('flex flex-col', this.class()));
}
