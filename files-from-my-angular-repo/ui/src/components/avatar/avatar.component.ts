import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

type AvatarSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'square';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

const AVATAR_SIZE: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  default: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-destructive',
  away: 'bg-yellow-500',
};

// ── Container ──────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <ng-content />
    @if (status()) {
      <span
        [class]="statusClass()"
        aria-hidden="true"
      ></span>
    }
  `,
})
export class AvatarComponent {
  readonly size = input<AvatarSize>('default');
  readonly shape = input<AvatarShape>('circle');
  readonly status = input<AvatarStatus | null>(null);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'relative inline-flex shrink-0 overflow-hidden',
      AVATAR_SIZE[this.size()],
      this.shape() === 'circle' ? 'rounded-full' : 'rounded-md',
      this.class(),
    ),
  );

  protected readonly statusClass = computed(() => {
    const s = this.status();
    return cn(
      'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
      this.size() === 'xs' || this.size() === 'sm' ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5',
      s ? STATUS_COLOR[s] : '',
    );
  });
}

// ── Image ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-avatar-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <img
      [src]="src()"
      [alt]="alt()"
      class="aspect-square h-full w-full object-cover"
      (error)="onError()"
      (load)="onLoad()"
      [class.hidden]="!loaded()" />
  `,
})
export class AvatarImageComponent {
  readonly src = input.required<string>();
  readonly alt = input<string>('');
  readonly class = input<string>('');

  protected readonly loaded = signal(false);

  protected readonly computedClass = computed(() => cn('aspect-square h-full w-full', this.class()));

  protected onLoad(): void {
    this.loaded.set(true);
  }

  protected onError(): void {
    this.loaded.set(false);
  }
}

// ── Fallback ───────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-avatar-fallback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class AvatarFallbackComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm font-medium',
      this.class(),
    ),
  );
}

// ── Group ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-avatar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class AvatarGroupComponent {
  readonly max = input<number>(5);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex -space-x-3 [&>ui-avatar]:ring-2 [&>ui-avatar]:ring-background', this.class()),
  );
}
