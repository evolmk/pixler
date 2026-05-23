import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

type ResizableDirection = 'horizontal' | 'vertical';

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-resizable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class ResizableComponent {
  readonly direction = input<ResizableDirection>('horizontal');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex',
      this.direction() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.class(),
    ),
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-resizable-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[style.flex-basis]': 'size() + "%"',
    '[style.min-width]': '"0"',
    '[style.min-height]': '"0"',
  },
  template: `<ng-content />`,
})
export class ResizablePanelComponent {
  readonly size = input<number>(50);
  readonly minSize = input<number>(10);
  readonly maxSize = input<number>(90);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('overflow-auto', this.class()),
  );
}

// ── Handle ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-resizable-handle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"separator"',
    '[attr.tabindex]': '"0"',
    '[attr.aria-orientation]': 'direction()',
    '(mousedown)': '_startDrag($event)',
    '(keydown)': '_onKeydown($event)',
  },
  template: `
    <div class="absolute inset-0 flex items-center justify-center">
      <div [class]="barClass()"></div>
    </div>
  `,
})
export class ResizableHandleComponent {
  readonly direction = input<ResizableDirection>('horizontal');
  readonly class = input<string>('');

  protected readonly _dragging = signal(false);

  private readonly _el: ElementRef<HTMLElement>;

  constructor(el: ElementRef<HTMLElement>) {
    this._el = el;
  }

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex shrink-0 items-center justify-center bg-border',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      'cursor-col-resize hover:bg-muted transition-colors',
      this.direction() === 'horizontal' ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize',
      this._dragging() ? 'bg-primary' : '',
      this.class(),
    ),
  );

  protected readonly barClass = computed(() =>
    cn(
      'rounded-full bg-border group-hover:bg-muted-foreground/50 transition-colors',
      this.direction() === 'horizontal' ? 'h-8 w-1' : 'h-1 w-8',
    ),
  );

  protected _startDrag(event: MouseEvent): void {
    event.preventDefault();
    this._dragging.set(true);
    const horiz = this.direction() === 'horizontal';
    const parent = this._el.nativeElement.parentElement;
    if (!parent) return;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const ratio = horiz
        ? (e.clientX - rect.left) / rect.width
        : (e.clientY - rect.top) / rect.height;
      const pct = Math.round(Math.max(10, Math.min(90, ratio * 100)));
      // Update flex-basis of sibling panels via custom event
      parent.dispatchEvent(new CustomEvent('ui-resizable-drag', { detail: pct, bubbles: false }));
    };

    const onUp = () => {
      this._dragging.set(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  protected _onKeydown(event: KeyboardEvent): void {
    const parent = this._el.nativeElement.parentElement;
    if (!parent) return;
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 5 : -5;
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    parent.dispatchEvent(new CustomEvent('ui-resizable-key', { detail: delta, bubbles: false }));
  }
}
