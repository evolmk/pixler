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
  model,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { expandEnter, expandExit } from '../../utils/motion';

export const COLLAPSIBLE_TOKEN = new InjectionToken<CollapsibleComponent>('COLLAPSIBLE_TOKEN');

// ── Root ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-collapsible',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: COLLAPSIBLE_TOKEN, useExisting: forwardRef(() => CollapsibleComponent) }],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-state]': 'open() ? "open" : "closed"',
  },
  template: `<ng-content />`,
})
export class CollapsibleComponent {
  readonly open = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
  }

  protected readonly computedClass = computed(() => cn('block', this.class()));
}

// ── Trigger ──────────────────────────────────────────────────────────────────

@Directive({
  selector: '[uiCollapsibleTrigger]',
  standalone: true,
  host: {
    class: 'cursor-pointer',
    '(click)': '_collapsible.toggle()',
    '[attr.aria-expanded]': '_collapsible.open()',
    '[attr.data-state]': '_collapsible.open() ? "open" : "closed"',
  },
})
export class CollapsibleTriggerDirective {
  protected readonly _collapsible = inject(COLLAPSIBLE_TOKEN);
}

// ── Content ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-collapsible-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-state]': '_collapsible.open() ? "open" : "closed"',
  },
  template: `<ng-content />`,
})
export class CollapsibleContentComponent {
  readonly class = input<string>('');
  protected readonly _collapsible = inject(COLLAPSIBLE_TOKEN);
  private readonly _el = inject(ElementRef<HTMLElement>);
  private _initialized = false;

  constructor() {
    effect(() => {
      const open = this._collapsible.open();
      const el = this._el.nativeElement;
      if (!this._initialized) {
        this._initialized = true;
        if (!open) {
          el.style.display = 'none';
          el.style.height = '0';
          el.style.overflow = 'hidden';
          el.style.opacity = '0';
        }
        return;
      }
      if (open) {
        expandEnter(el);
      } else {
        void expandExit(el);
      }
    });
  }

  protected readonly computedClass = computed(() => cn('block', this.class()));
}
