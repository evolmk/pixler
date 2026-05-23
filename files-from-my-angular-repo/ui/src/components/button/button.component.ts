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
} from '@angular/core';
import { cn } from '../../utils/cn';
import { buttonVariants, type ButtonVariants } from './button.variants';
import { SpinnerComponent } from '../spinner/spinner.component';

// ── Button ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-button, [uiButton], [ui-button]',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-busy]': 'loading() || null',
  },
  template: `
    @if (loading()) {
      <ui-spinner size="sm" />
      @if (loadingText()) {
        {{ loadingText() }}
      }
    } @else {
      <ng-content />
    }
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariants['variant']>('default');
  readonly size = input<ButtonVariants['size']>('default');
  readonly shape = input<ButtonVariants['shape']>('default');
  readonly full = input<boolean>(false);
  readonly loading = input<boolean>(false);
  /** Text shown next to spinner while loading. When omitted, spinner replaces button content entirely. */
  readonly loadingText = input<string | undefined>(undefined);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      buttonVariants({
        variant: this.variant(),
        size: this.size(),
        shape: this.shape(),
        full: this.full(),
      }),
      this.loading() ? 'cursor-wait pointer-events-none' : '',
      this.class(),
    ),
  );
}

// ── Button Group ──────────────────────────────────────────────────────────────

export const BUTTON_GROUP_TOKEN = new InjectionToken<ButtonGroupComponent>('BUTTON_GROUP_TOKEN');

@Component({
  selector: 'ui-button-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: BUTTON_GROUP_TOKEN, useExisting: forwardRef(() => ButtonGroupComponent) }],
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class ButtonGroupComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex',
      this.orientation() === 'vertical' ? 'flex-col' : 'flex-row',
      '[&>ui-button]:rounded-none [&>[uiButton]]:rounded-none',
      this.orientation() === 'horizontal'
        ? '[&>ui-button:first-child]:rounded-l-md [&>ui-button:last-child]:rounded-r-md [&>[uiButton]:first-child]:rounded-l-md [&>[uiButton]:last-child]:rounded-r-md'
        : '[&>ui-button:first-child]:rounded-t-md [&>ui-button:last-child]:rounded-b-md [&>[uiButton]:first-child]:rounded-t-md [&>[uiButton]:last-child]:rounded-b-md',
      this.class(),
    ),
  );
}

// ── Button Group Divider ───────────────────────────────────────────────────────

@Component({
  selector: 'ui-button-group-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: ``,
})
export class ButtonGroupDividerComponent {
  readonly class = input<string>('');
  private readonly _group = inject(BUTTON_GROUP_TOKEN, { optional: true });

  protected readonly computedClass = computed(() =>
    cn('self-stretch bg-border', this._group?.orientation() === 'vertical' ? 'h-px w-full' : 'w-px', this.class()),
  );
}

// ── Button Group Text ─────────────────────────────────────────────────────────

@Directive({
  selector: '[uiButtonGroupText]',
  standalone: true,
  host: {
    '[class]': '"inline-flex items-center px-3 text-sm text-muted-foreground border border-input bg-background"',
  },
})
export class ButtonGroupTextDirective {}
