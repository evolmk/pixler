import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  ViewChild,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { ChevronDown, Plus } from 'lucide-angular';
import { IconComponent } from '../icon/icon.component';
import { cn } from '../../utils/cn';
import {
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentInnerVariants,
  type AccordionVariant,
  type AccordionSize,
} from './accordion.variants';

export const ACCORDION_TOKEN = new InjectionToken<AccordionComponent>('ACCORDION_TOKEN');
export const ACCORDION_ITEM_TOKEN = new InjectionToken<{ value: () => string }>('ACCORDION_ITEM_TOKEN');

// ── Root ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: ACCORDION_TOKEN, useExisting: forwardRef(() => AccordionComponent) }],
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class AccordionComponent {
  /** 'single' allows only one item open at a time; 'multiple' allows many */
  readonly type = input<'single' | 'multiple'>('single');
  /** When true (single mode only), clicking an open item closes it */
  readonly collapsible = input<boolean>(true);
  /** Pre-open item(s) by value. String for single, string[] for multiple. */
  readonly defaultValue = input<string | string[] | null>(null);
  /** Visual style variant */
  readonly variant = input<AccordionVariant>('default');
  /** Size preset */
  readonly size = input<AccordionSize>('default');
  readonly class = input<string>('');

  private readonly _openItems = signal<Set<string>>(new Set());

  constructor() {
    // Sync _openItems with defaultValue once inputs are bound (field initializers run too early)
    let applied = false;
    effect(() => {
      const dv = this.defaultValue();
      if (!applied && dv) {
        applied = true;
        const values = Array.isArray(dv) ? dv : [dv];
        this._openItems.set(new Set(values));
      }
    });
  }

  isOpen(value: string): boolean {
    return this._openItems().has(value);
  }

  toggle(value: string): void {
    this._openItems.update((set) => {
      const next = new Set(set);
      if (next.has(value)) {
        if (this.type() === 'single' && !this.collapsible()) return set;
        next.delete(value);
      } else {
        if (this.type() === 'single') next.clear();
        next.add(value);
      }
      return next;
    });
  }

  protected readonly computedClass = computed(() => cn('block', this.class()));
}

// ── Item ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-accordion-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: ACCORDION_ITEM_TOKEN, useExisting: forwardRef(() => AccordionItemComponent) }],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-state]': '_accordion.isOpen(value()) ? "open" : "closed"',
  },
  template: `<ng-content />`,
})
export class AccordionItemComponent {
  readonly value = input.required<string>();
  readonly class = input<string>('');

  protected readonly _accordion = inject(ACCORDION_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(accordionItemVariants({ variant: this._accordion.variant() }), this.class()),
  );
}

// ── Trigger ──────────────────────────────────────────────────────────────────

const ICON_SIZE_MAP: Record<AccordionSize, number> = {
  xs: 12,
  sm: 14,
  default: 16,
  lg: 20,
  xl: 24,
};

@Component({
  selector: 'ui-accordion-trigger',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"block w-full"' },
  template: `
    <button
      type="button"
      [class]="computedClass()"
      [attr.aria-expanded]="_accordion.isOpen(_item.value())"
      (click)="_accordion.toggle(_item.value())"
    >
      <ng-content />
      <ui-icon #iconEl [name]="iconData()" [size]="iconSize()" class="shrink-0" aria-hidden="true" />
    </button>
  `,
})
export class AccordionTriggerComponent {
  readonly class = input<string>('');
  /** Icon style: 'chevron' rotates 90°; 'plus' rotates 45° to become an × */
  readonly icon = input<'chevron' | 'plus'>('chevron');

  protected readonly _accordion = inject(ACCORDION_TOKEN);
  protected readonly _item = inject(ACCORDION_ITEM_TOKEN);
  private readonly _iconRef = signal<ElementRef<HTMLElement> | null>(null);
  private _initialized = false;
  private _prevOpen: boolean | null = null;

  protected readonly iconData = computed(() => (this.icon() === 'plus' ? Plus : ChevronDown));
  protected readonly iconSize = computed((): number => ICON_SIZE_MAP[this._accordion.size()]);

  @ViewChild('iconEl', { read: ElementRef }) set iconRefSetter(ref: ElementRef<HTMLElement>) {
    this._iconRef.set(ref);
  }

  constructor() {
    effect(() => {
      const open = this._accordion.isOpen(this._item.value());
      const el = this._iconRef()?.nativeElement;
      if (!el) return;
      const deg = this.icon() === 'plus' ? 45 : 180;
      if (!this._initialized) {
        this._initialized = true;
        this._prevOpen = open;
        gsap.set(el, { rotation: open ? deg : 0 });
        return;
      }
      if (open === this._prevOpen) return;
      this._prevOpen = open;
      gsap.to(el, {
        rotation: open ? deg : 0,
        duration: 0.35,
        ease: open ? 'back.out(1.7)' : 'power3.in',
      });
    });
  }

  protected readonly computedClass = computed(() =>
    cn(
      accordionTriggerVariants({
        variant: this._accordion.variant(),
        size: this._accordion.size(),
      }),
      this.class(),
    ),
  );
}

// ── Content ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-accordion-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-state]': '_accordion.isOpen(_item.value()) ? "open" : "closed"',
  },
  template: `
    <div [class]="innerClass()">
      <ng-content />
    </div>
  `,
})
export class AccordionContentComponent {
  readonly class = input<string>('');

  protected readonly _accordion = inject(ACCORDION_TOKEN);
  protected readonly _item = inject(ACCORDION_ITEM_TOKEN);
  private readonly _el = inject(ElementRef<HTMLElement>);
  private _initialized = false;
  private _prevOpen: boolean | null = null;

  protected readonly innerClass = computed(() =>
    accordionContentInnerVariants({
      variant: this._accordion.variant(),
      size: this._accordion.size(),
    }),
  );

  constructor() {
    effect(() => {
      const open = this._accordion.isOpen(this._item.value());
      const el = this._el.nativeElement;
      if (!this._initialized) {
        this._initialized = true;
        this._prevOpen = open;
        if (!open) {
          gsap.set(el, { display: 'none', height: 0, overflow: 'hidden', opacity: 0 });
        }
        return;
      }
      // Skip animation if state hasn't actually changed
      if (open === this._prevOpen) return;
      this._prevOpen = open;

      gsap.killTweensOf(el);
      if (open) {
        gsap.set(el, { overflow: 'hidden', display: 'block' });
        gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power3.out' });
      } else {
        gsap.set(el, { overflow: 'hidden' });
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.15,
          ease: 'power3.in',
          onComplete: () => {
            gsap.set(el, { display: 'none' });
          },
        });
      }
    });
  }

  protected readonly computedClass = computed(() => cn('overflow-hidden', this.class()));
}
